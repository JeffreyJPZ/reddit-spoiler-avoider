/**
 * Content script for main and subreddit feeds
 * */

const ELEMENTS_ID_OLD_REDDIT_MAIN = "siteTable"; // ID of container with all posts for Old Reddit
const ELEMENTS_ID_NEW_REDDIT_MAIN = "main-content"; // ID of container with all posts for New Reddit
const ELEMENTS_ID_NEW_REDDIT_COMMENTS = "comment-tree" // ID of container with all comments for New Reddit

const OLD_REDDIT_MAIN = "oldRedditMain" // flag indicating Old Reddit
const OLD_REDDIT_SEARCH = "oldRedditSearch" // flag indicating search feed(s) for Old Reddit // TODO: implement
const OLD_REDDIT_COMMENTS = "oldRedditComments" // flag indicating comment feed(s) for Old Reddit // TODO: implement
const NEW_REDDIT_MAIN = "newRedditMain" // flag indicating main feed(s) for New Reddit
const NEW_REDDIT_SUBREDDIT = "newRedditSubreddit" // flag indicating subreddit feed(s) for New Reddit
const NEW_REDDIT_SEARCH = "newRedditSearch" // flag indicating search feed(s) for New Reddit
const NEW_REDDIT_COMMENTS = "newRedditComments" // flag indicating comment feed(s) for New Reddit

// Receives data from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.key === 'filter') {
        // caches active subreddit filter options
        cacheSubreddits(parsedMessage.data);
        try {
            filterPosts();
        } catch (err) {
            console.log(err);
        }
        sendResponse('');
    }
    return true;
});

/**
 * @description gets the container with the posts and filters out posts matching the active subreddit filter options
 */
const filterPosts = () => {
    const feedType = getFeedType();
    const elements = getParentContainer(feedType);

    const subredditFilterOptions = JSON.parse(window.localStorage.getItem('subredditFilterOptions')) || null;

    // skips filtering if there are no active subreddits
    if (shouldFilter(elements, subredditFilterOptions)) {
        tryFilter(elements, subredditFilterOptions, feedType);
    }
}

/**
 * @description Returns the string describing the version of reddit and the particular type of feed, if applicable
 */
const getFeedType = () => {
    const elements = document.getElementById(ELEMENTS_ID_NEW_REDDIT_MAIN); // assumes New Reddit

    if (elements === null) {
        return OLD_REDDIT_MAIN;
    } else {
        const pageType = document.getElementsByTagName('shreddit-app')[0]
                                        .getAttribute('pagetype');
        switch (pageType) {
            case "home":
            case "popular":
            case "all":
                return NEW_REDDIT_MAIN;
            case "community":
                return NEW_REDDIT_SUBREDDIT;
            case "post_detail":
                return NEW_REDDIT_COMMENTS;
            case "search_results":
                return NEW_REDDIT_SEARCH;
        }
    }
}

/**
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description gets the container with the posts and filters out posts matching the active subreddit filter options
 */
const getParentContainer = (feedType) => {

    switch (feedType) {
        case OLD_REDDIT_MAIN:
            return document.getElementById(ELEMENTS_ID_OLD_REDDIT_MAIN);
        case NEW_REDDIT_MAIN:
            return document.getElementById(ELEMENTS_ID_NEW_REDDIT_MAIN).getElementsByTagName('shreddit-feed')[0];
        case NEW_REDDIT_SUBREDDIT:
            return document.getElementById(ELEMENTS_ID_NEW_REDDIT_MAIN).children[2];
        case NEW_REDDIT_COMMENTS:
            return document.getElementById(ELEMENTS_ID_NEW_REDDIT_COMMENTS);
        case NEW_REDDIT_SEARCH:
            return document.getElementsByTagName('reddit-feed')[0];
        default:
            return null;
    }
}

/**
 * @param elements The container for all posts
 * @param subredditFilterOptions The active subreddit filter options
 * @description Returns true if subreddit filter options exist in storage and if there are elements
 */
const shouldFilter = (elements, subredditFilterOptions) => {
    return subredditFilterOptions !== null && elements !== null;
}

/**
 * @param elements The container for the current set of posts
 * @param subredditFilterOptions The active subreddit filter options
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description goes through each element and hides the element if:
 *              the element is a post, the subreddit that the post belongs to matches an active subreddit filter,
 *              and the post date matches with the filter category and date of the filter
 *              OR, if the element is an already hidden post but does not match an active subreddit filter, shows the post
 *              OR, if the element is a container for more posts, then tries to filter the child posts
 *              otherwise, skips the element
 */
const tryFilter = (elements, subredditFilterOptions, feedType) => {

    for (let element of elements.children) {
        if (isElementAPost(element, feedType)
            && !isPostHidden(element, feedType)
            && doesPostMatchFilters(element, subredditFilterOptions, feedType)) {

            hidePost(element, feedType);
        } else if (feedType === NEW_REDDIT_SUBREDDIT && element.tagName === "FACEPLATE-BATCH") {
            // handles New Reddit's infinite scroll on subreddit page
            // eventually terminates as number of children is finite
            tryFilter(element, subredditFilterOptions, feedType)  // element has multiple children
        } else if (feedType === OLD_REDDIT_MAIN && element.getAttribute("class") === "sitetable linklisting") {
            // handles Reddit Enhancement Suite's infinite scroll
            tryFilter(element, subredditFilterOptions, feedType);
        } else if (isElementAPost(element, feedType) && !doesPostMatchFilters(element, subredditFilterOptions, feedType)) {
            // needs to be at the very end
            showPost(element, feedType);
        }
    }
}


/**
 * @param element The element to check
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Returns true if element is a post
 */
const isElementAPost = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
            const postSubredditName = element.getAttribute("data-subreddit");
            return postSubredditName !== (null | "");
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_MAIN:
            return element.tagName === "ARTICLE";
        case NEW_REDDIT_COMMENTS:
            return element.tagName === "SHREDDIT-COMMENT";
        case NEW_REDDIT_SEARCH:
            return element.tagName === "FACEPLATE-TRACKER";
        default:
            return false;
    }
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param subredditFilterOptions The active subreddit filter options
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Returns true if the subreddit that the post belongs to is active, and either:
 *              postDateTime falls before the specified datetime when the category for the subreddit is "before"
 *              postDateTime falls after the specified datetime when the category for the subreddit is "after"
 *              otherwise, returns false
 */
const doesPostMatchFilters = (element, subredditFilterOptions, feedType) => {
    let postSubredditName;
    let postDateTime;

    switch (feedType) {
        case OLD_REDDIT_MAIN:
            postSubredditName = getPostSubreddit(element, feedType);
            postDateTime = parseFloat(getPostDateTime(element, feedType));
            break;
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            postSubredditName = getPostSubreddit(element, feedType);
            postDateTime = getPostDateTime(element, feedType);
            break;
        default:
            postSubredditName = null;
            postDateTime = null;
    }

    const subreddit = subredditFilterOptions[postSubredditName]; // get options associated with post subreddit name
    if (!(postSubredditName in subredditFilterOptions)) { // if subreddit is not active, immediately return false
        return false;
    }

    const filterCategory = subreddit.filterCategory;
    const filterDate = new Date(subreddit.filterDateTime + 'Z'); // convert to UTC
    const postDate = new Date(postDateTime);

    return (filterCategory === "before" && postDate <= filterDate) ||
        (filterCategory === "after" && postDate >= filterDate);
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Returns the subreddit name that the post belongs to according to the feed type
 */
const getPostSubreddit = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
            return element.getAttribute('data-subreddit');
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
            return element.getElementsByTagName('shreddit-post')[0]
                          .getAttribute('subreddit-prefixed-name')
                          .substring(2); // removes subreddit prefix
        case NEW_REDDIT_COMMENTS:
            return document.getElementsByTagName('shreddit-post')[0]
                           .getAttribute('subreddit-prefixed-name')
                           .substring(2); // removes subreddit prefix
        case NEW_REDDIT_SEARCH:
            // object with post information
            const postData = JSON.parse(element.getAttribute('data-faceplate-tracking-context'));
            return postData['subreddit'].name;
        default:
            return "";
    }
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Returns the datetime of the post according to the feed type
 */
const getPostDateTime = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
            return element.getAttribute('data-timestamp');
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
            return element.getElementsByTagName('shreddit-post')[0]
                .getAttribute('created-timestamp');
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            return element.getElementsByTagName('faceplate-timeago')[0]
                .getAttribute('ts');
        default:
            return 0;
    }
}

/**
 * @param post The post to hide
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Hides the post according to the given feed type
 */
const hidePost = (post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            post.style.opacity = 0; // allows post to still be clickable
            break;
        default:
            return;
    }
}

/**
 * @param post The post to show
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Shows the post according to the given feed type
 */
const showPost = (post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            post.style.opacity = 1; // allows post to still be clickable
            break;
        default:
            return;
    }
}

/**
 * @param post The post to check
 * @param feedType The version of reddit and the particular type of feed, if applicable
 * @description Returns whether the post is hidden
 */
const isPostHidden = (post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            return post.style.opacity === 0;
        default:
            return false;
    }
}

/**
 * @param subredditFilterOptions The active subreddit filter options
 * @description Saves the given subreddit filter options to storage
 */
const cacheSubreddits = (subredditFilterOptions) => {
    window.localStorage.setItem('subredditFilterOptions', JSON.stringify(subredditFilterOptions));
}

/**
 * @param node The node to check
 * @description Checks to see if a new node added is a post and attempts to filter
 * Credit to https://stackoverflow.com/a/8866924
 */
const tryFilterMutation = (node) => {
    const feedType = getFeedType();
    switch (feedType) {
        case OLD_REDDIT_MAIN:
            if (node.parentNode.id === ELEMENTS_ID_OLD_REDDIT_MAIN && node.tagName === "DIV") {
                try {
                    filterPosts();
                } catch (err) {
                    console.log(err);
                }
            }
            break;
        case NEW_REDDIT_MAIN:
            if (node.parentNode.tagName === "SHREDDIT-FEED" && node.tagName === "FACEPLATE-BATCH") {
                try {
                    filterPosts();
                } catch (err) {
                    console.log(err);
                }
            }
            break;
        case NEW_REDDIT_SUBREDDIT:
            if (node.parentNode.tagName === "DIV" && node.tagName === "FACEPLATE-BATCH") {
                try {
                    filterPosts();
                } catch (err) {
                    console.log(err);
                }
            }
            break;
        case NEW_REDDIT_COMMENTS:
            if (node.parentNode.id === NEW_REDDIT_COMMENTS) {
                try {
                    filterPosts();
                } catch (err) {
                    console.log(err);
                }
            }
            break;
        case NEW_REDDIT_SEARCH:
            if (node.parentNode.tagName === "REDDIT-FEED") {
                try {
                    filterPosts();
                } catch (err) {
                    console.log(err);
                }
            }
            break;
        default:
    }
}

/**
 * @description Creates an observer to check if:
 *              user has navigated to a different feed using the sidebar or search tool (New Reddit)
 *              OR new posts have been added
 */
const createObserver = () => {
    const feedType = getFeedType();
    const config = {attributes: true, childList: true, subtree: true};
    let app;

    switch (feedType) {
        case OLD_REDDIT_MAIN:
            app = document;
            break;
        case NEW_REDDIT_MAIN:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_COMMENTS:
        case NEW_REDDIT_SEARCH:
            // need to monitor posts being added and page type change
            app = document.getElementsByTagName('shreddit-app')[0];
            break;
        default:
            app = null;
    }
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            switch (mutation.type) {
                case "attributes":
                    if (mutation.attributeName === "pagetype") {
                        // for New Reddit, attempts to get updated filters if navigating to new feed
                        chrome.runtime.sendMessage(JSON.stringify({key: 'requestFilters'})).then();
                    }
                    break;
                case "childList":
                case "subtree":
                    // need childList for New Reddit
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        try {
                            tryFilterMutation(mutation.addedNodes[i]);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    break;
                default:
            }
        }
    }

    const observer = new MutationObserver(callback);
    observer.observe(app, config);
}

// Attempts to get updated filters and creates observer when page is first loaded
try {
    chrome.runtime.sendMessage(JSON.stringify({key: 'requestFilters'})).then();
    createObserver();
} catch (err) {
    console.log(err);
}