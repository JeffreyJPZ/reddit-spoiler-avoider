/**
 * Content script for reddit pages in old reddit
 * */

// Receives data from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.key === 'filter') {
        setSubreddits(parsedMessage.data);
        filterPosts().then(sendResponse(''));
    }
    return true;
});

// Runs script when user scrolls
document.addEventListener("scroll", async () => {
    try {
        await filterPosts();
    } catch (err) {
        console.log(err);
    }
});

// Runs script when user refreshes or navigates to next page
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await filterPosts();
    } catch (err) {
        console.log(err);
    }
});

/**
 * @description gets the container with the posts and filters out posts matching the active subreddit filter options
 */
const filterPosts = async () => {
    const elementsContainerID = "siteTable";
    const elements = document.getElementById(elementsContainerID); // container with all posts

    const subredditFilterOptions = JSON.parse(window.localStorage.getItem('subredditFilterOptions'));

    // skips filtering if there are no active subreddits or no posts
    if (shouldFilter(elements, subredditFilterOptions)) {
        tryFilter(elements, subredditFilterOptions);
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
 * @description goes through each element and deletes the element if:
 *              the element is a post, the subreddit that the post belongs to matches an active subreddit filter,
 *              and the post date matches with the filter category and date of the filter
 */
const tryFilter = (elements, subredditFilterOptions) => {

    for (let element of elements.children) {

        // handles Reddit Enhancement Suite's never ending scroll feature,
        // eventually terminates as number of children is finite
        if (element.getAttribute("class") === "sitetable linklisting") {
            tryFilter(element, subredditFilterOptions); // element has multiple children
        } else {
            if (isElementAPost(element)) {

                if (doesPostMatchFilters(element, subredditFilterOptions)) {
                    elements.removeChild(element);
                }
            }
        }
    }
}

/**
 * @param element The component to check
 * @description Returns true if element is a post
 */
const isElementAPost = (element) => {
    const postSubredditName = element.getAttribute("data-subreddit");
    return postSubredditName !== (null | "");
}

/**
 * @param element The post to check using the active subreddit filter options
 * @param subredditFilterOptions The active subreddit filter options
 * @description Returns true if the subreddit that the post belongs to is active, and either:
 *              postDateTime falls before the specified datetime when the category for the subreddit is "before"
 *              postDateTime falls after the specified datetime when the category for the subreddit is "after"
 *              otherwise, returns false
 */
const doesPostMatchFilters = (element, subredditFilterOptions) => {
    const postSubredditName = element.getAttribute("data-subreddit");
    const subreddit = subredditFilterOptions[postSubredditName]; // get options associated with post subreddit name

    if (subreddit === undefined) { // subreddit is not active
        return false;
    }

    const postDateTime = element.getElementsByTagName("time")[0].getAttribute("datetime");

    const filterCategory = subreddit.filterCategory;
    const filterDate = new Date(subreddit.filterDateTime + 'Z'); // convert to UTC
    const postDate = new Date(postDateTime);

    return (filterCategory === "before" && postDate <= filterDate) ||
        (filterCategory === "after" && postDate >= filterDate);
}

/**
 * @param subreddits The active subreddit filter options
 * @description Saves the given subreddit filter options to storage
 */
const setSubreddits = (subreddits) => {
    window.localStorage.setItem('subredditFilterOptions', JSON.stringify(subreddits));
}