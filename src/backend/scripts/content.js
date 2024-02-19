/**
 * Content script for main and subreddit feeds
 * */

const ELEMENTS_ID_OLD_REDDIT = "siteTable"; // ID of container with all posts for Old Reddit
const ELEMENTS_ID_NEW_REDDIT = "main-content"; // ID of container with all posts for New Reddit
const OLD_REDDIT = "oldReddit" // flag indicating Old Reddit
const NEW_REDDIT_SUBREDDIT = "newRedditSubreddit" // flag indicating subreddit page for New Reddit
const NEW_REDDIT_HOME = "newRedditHome" // flag indicating home page for New Reddit

let scrolled = true; // flag indicating whether to handle scroll event

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

// Runs script when user scrolls
// Credit to https://stackoverflow.com/a/34822169 and https://stackoverflow.com/a/50628760 for limiting scroll events
document.addEventListener("scroll", () => {
    if (scrolled) {
        scrolled = false;
        try {
            filterPosts();
        } catch (err) {
            console.log(err);
        }

        setTimeout(() => {scrolled = true}, 1000);
    }
});

/**
 * @description gets the container with the posts and filters out posts matching the active subreddit filter options
 */
const filterPosts = () => {
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

    const subredditFilterOptions = JSON.parse(window.localStorage.getItem('subredditFilterOptions')) || null;

    // skips filtering if there are no active subreddits
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
 * @description goes through each element and hides the element if:
 *              the element is a post, the subreddit that the post belongs to matches an active subreddit filter,
 *              and the post date matches with the filter category and date of the filter
 *              otherwise, skips the element if it is a post and has already been hidden
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
        } else if (feedType === OLD_REDDIT && element.getAttribute("class") === "sitetable linklisting") {
            // handles Reddit Enhancement Suite's infinite scroll
            tryFilter(element, subredditFilterOptions, feedType);
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
            postSubredditName = getPostSubreddit(element, feedType);
            postDateTime = parseFloat(getPostDateTime(element, feedType));
            break;
        default:
            postSubredditName = getPostSubreddit(element, feedType);
            postDateTime = getPostDateTime(element, feedType);
            break;
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
 * @param element The post to check using the active subreddit filter options
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Returns the subreddit name that the post belongs to according to the feed type
 */
const getPostSubreddit = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
            return element.getAttribute('data-subreddit');
        default:
            return element.getElementsByTagName('shreddit-post')[0]
                          .getAttribute('subreddit-prefixed-name')
                          .substring(2); // removes subreddit prefix
    }
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Returns the datetime of the post according to the feed type
 */
const getPostDateTime = (element, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
            return element.getAttribute('data-timestamp');
        default:
            return element.getElementsByTagName('shreddit-post')[0]
                          .getAttribute('created-timestamp');
    }
}

/**
 * @param post The post to remove
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Hides the post according to the given feed type
 */
const hidePost = (post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_HOME:
            post.style.opacity = 0; // allows post to still be clickable
            break;
        default:
            return;
    }
}

/**
 * @param post The post to check
 * @param feedType The version of reddit and the particular page type, if applicable
 * @description Returns whether the post is hidden
 */
const isPostHidden = (post, feedType) => {
    switch (feedType) {
        case OLD_REDDIT:
        case NEW_REDDIT_SUBREDDIT:
        case NEW_REDDIT_HOME:
            return post.style.opacity === 0;
        default:
            return false;
    }
}

// /**
//  * @param post The post to remove
//  * @param feedType The version of reddit and the particular page type, if applicable
//  * @description Removes the post according to the given feed type
//  */
// const removePost = (post, feedType) => {
//     switch (feedType) {
//         case OLD_REDDIT:
//         case NEW_REDDIT_SUBREDDIT:
//         case NEW_REDDIT_HOME:
//             post.style.display = "none";
//             break;
//         default:
//             return;
//     }
// }

/**
 * @param subredditFilterOptions The active subreddit filter options
 * @description Saves the given subreddit filter options to storage
 */
const cacheSubreddits = (subredditFilterOptions) => {
    window.localStorage.setItem('subredditFilterOptions', JSON.stringify(subredditFilterOptions));
}

// Attempts to filter when page is first loaded and refresh filters has not been pressed yet
try {
    filterPosts();
} catch (err) {
    console.log(err);
}

// Attempts to run the script occasionally
setInterval(() => {
    try {
        filterPosts();
    } catch (err) {
        console.log(err);
    }
}, 1000);
