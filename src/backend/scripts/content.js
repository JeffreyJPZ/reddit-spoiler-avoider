/**
 * Content script for main and subreddit feeds
 * */

const ELEMENTS_ID_OLD_REDDIT = "siteTable"; // ID of container with all posts for Old Reddit
const ELEMENTS_ID_NEW_REDDIT = "main-content"; // ID of container with all posts for New Reddit
const OLD_REDDIT = "oldReddit" // flag indicating Old Reddit
const NEW_REDDIT_SUBREDDIT = "newRedditSubreddit" // flag indicating subreddit page for New Reddit
const NEW_REDDIT_HOME = "newRedditHome" // flag indicating home page for New Reddit

// Receives data from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.key === 'filter') {
        setSubreddits(parsedMessage.data);
        filterPosts().then(sendResponse(''));
    }
    return true;
});

/**
 * @description gets the container with the posts and filters out posts matching the active subreddit filter options
 */
const filterPosts = async () => {
    let elements = document.getElementById(ELEMENTS_ID_NEW_REDDIT); // assumes New Reddit
    let feedType;

    // if not using New Reddit, tries for Old Reddit
    if (elements === null) {
        elements = document.getElementById(ELEMENTS_ID_OLD_REDDIT);
        feedType = OLD_REDDIT;
    } else {
        // checks if New Reddit feed is on the home page or on a subreddit page, updates elements to be the immediate parent of post elements
        const queryHomePageContainer = elements.getElementsByTagName('shreddit-feed');
        if (queryHomePageContainer.length > 0) {
            // home page
            elements = queryHomePageContainer[0];
            feedType = NEW_REDDIT_HOME;
        } else {
            // subreddit page
            elements = elements.children[2]; // get third div (2nd index) for subreddit feed
            feedType = NEW_REDDIT_SUBREDDIT;
        }
    }

    const subredditFilterOptions = JSON.parse(window.localStorage.getItem('subredditFilterOptions'));

    // skips filtering if there are no active subreddits or no posts
    if (shouldFilter(elements, subredditFilterOptions)) {
        tryFilter(elements, subredditFilterOptions, feedType);
    }
}

/**
 * @param elements The container for all elements
 * @param subredditFilterOptions The active subreddit filter options
 * @description Returns true if subreddit filter options exist in storage and if there are elements
 */
const shouldFilter = (elements, subredditFilterOptions) => {
    return subredditFilterOptions !== null && elements !== null;
}

/**
 * @param elements The container for the current set of posts
 * @param subredditFilterOptions The active subreddit filter options
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description goes through each element and deletes the element if:
 *              the element is a post, the subreddit that the post belongs to matches an active subreddit filter,
 *              and the post date matches with the filter category and date of the filter
 */
const tryFilter = (elements, subredditFilterOptions, feedType) => {

    for (let element of elements.children) {

        if (feedType === NEW_REDDIT_SUBREDDIT && element.tagName === "FACEPLATE-BATCH") {
            // handles New Reddit's infinite scroll on subreddit page
            // eventually terminates as number of children is finite
            tryFilter(element, subredditFilterOptions, feedType)  // element has multiple children
        } else if (feedType === OLD_REDDIT && element.getAttribute('class') === "sitetable linklisting") {
            // handles Reddit Enhancement Suite's infinite scroll
            tryFilter(element, subredditFilterOptions, feedType);
        } else if (isElementAPost(element, feedType) && doesPostMatchFilters(element, subredditFilterOptions, feedType)) {
            removePost(elements, element, feedType);
        }
    }
}


/**
 * @param element The element to check
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Returns true if element is a post
 */
const isElementAPost = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
            const postSubredditName = element.getAttribute("data-subreddit");
            return postSubredditName !== (null | "");
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_HOME:
            return element.tagName === "ARTICLE";
        default:
            return false;
    }
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param subredditFilterOptions The active subreddit filter options
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Returns true if the subreddit that the post belongs to is active, and either:
 *              postDateTime falls before the specified datetime when the category for the subreddit is "before"
 *              postDateTime falls after the specified datetime when the category for the subreddit is "after"
 *              otherwise, returns false
 */
const doesPostMatchFilters = (element, subredditFilterOptions, feedType) => {
    let postSubredditName;
    let postDateTime;

    switch (feedType) {
        case OLD_REDDIT:
            postSubredditName = element.getAttribute('data-subreddit');
            postDateTime = parseFloat(element.getAttribute('data-timestamp'));
            break;
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_HOME:
            postSubredditName = element.getElementsByTagName('shreddit-post')[0]
                                       .getAttribute('subreddit-prefixed-name')
                                       .substring(2); // removes subreddit prefix
            postDateTime = element.getElementsByTagName('shreddit-post')[0]
                                  .getAttribute('created-timestamp');
            break;
        default:
    }

    const subreddit = subredditFilterOptions[postSubredditName]; // get options associated with post subreddit name
    if (subreddit === undefined) { // if subreddit is not active, immediately return false
        return false;
    }

    const filterCategory = subreddit.filterCategory;
    const filterDate = new Date(subreddit.filterDateTime + 'Z'); // convert to UTC
    const postDate = new Date(postDateTime);

    return (filterCategory === "before" && postDate <= filterDate) ||
        (filterCategory === "after" && postDate >= filterDate);
}

/**
 * @param elements The parent container of the post
 * @param post The post to remove
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Removes the post according to the given feed type by deleting it from its parent container
 */
const removePost = (elements, post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_HOME:
            // elements.removeChild(post.nextSibling); // removes border element after the post (CANT HAVE THIS)
            elements.removeChild(post);
            break;
        default:
            return;
    }
}

/**
 * @param subreddits The active subreddit filter options
 * @description Saves the given subreddit filter options to storage
 */
const setSubreddits = (subreddits) => {
    window.localStorage.setItem('subredditFilterOptions', JSON.stringify(subreddits));
}

// Requests for active subreddit filters when page is first loaded and refresh filters has not been pressed yet
try {
    chrome.runtime.sendMessage(JSON.stringify({key: 'requestFilters'})).then();
} catch (err) {
    console.log(err);
}

// Runs script periodically, beginning when document first finishes loading or page is refreshed
setInterval(() => {
    try {
        filterPosts().then();
    } catch (err) {
        console.log(err);
    }
}, 4);
