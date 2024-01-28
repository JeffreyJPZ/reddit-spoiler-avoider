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
 *
 * @description goes through each element and deletes the element if:
 *              the element is a post, the subreddit that the post belongs to matches an active subreddit filter,
 *              and the post date matches with the filter category and date of the filter
 */
const filterPosts = async () => {
    const elementsContainerID = "siteTable";
    const elements = document.getElementById(elementsContainerID); // container with all posts

    const subredditFilterOptions = JSON.parse(window.localStorage.getItem('subredditFilterOptions'));

    // skips filtering if there are no active subreddits or no posts
    if (shouldFilter(subredditFilterOptions, elements)) {

        for (let element of elements.children) {
            let postSubredditName = element.getAttribute("data-subreddit");

            // check if postSubredditName exists and post name matches an active subreddit
            if (isPostNameValid(postSubredditName, subredditFilterOptions)) {
                let postDateTime = element.getElementsByTagName("time")[0].getAttribute("datetime");

                // subreddit matches
                if (doesPostMatchFilters(postSubredditName, postDateTime, subredditFilterOptions)) {
                    elements.removeChild(element);
                }
            }

        }
    }
}

/**
 * @param subredditFilterOptions The active subreddit filter options
 * @param elements The container for posts
 * @description Returns true if subreddit filter options exist in storage and if there are posts to filter
 */
const shouldFilter = (subredditFilterOptions, elements) => {
    return subredditFilterOptions !== null && elements !== null;
}

/**
 *
 * @param postSubredditName The name of the subreddit that the post is associated with
 * @param postDateTime The timestamp of the post
 * @param subredditFilterOptions The active subreddit filter options
 * @description Returns true if, for a given post for an active subreddit filter, either:
 *              postDateTime falls before the specified datetime when the category for the subreddit is "before"
 *              postDateTime falls after the specified datetime when the category for the subreddit is "after"
 */
const doesPostMatchFilters = (postSubredditName, postDateTime, subredditFilterOptions) => {
    let subreddit = subredditFilterOptions[postSubredditName]; // get options associated with post subreddit name

    let filterCategory = subreddit.filterCategory;
    let filterDate = new Date(subreddit.filterDateTime + 'Z'); // convert to UTC
    let postDate = new Date(postDateTime);

    return (filterCategory === "before" && postDate <= filterDate) ||
        (filterCategory === "after" && postDate >= filterDate);
}

/**
 * @param postSubredditName The name of the subreddit that a post is associated with, if it exists
 * @param subredditFilterOptions The active subreddit filter options
 * @description Returns true if postSubredditName is a valid name and matches an active subreddit filter
 */
const isPostNameValid = (postSubredditName, subredditFilterOptions) => {
    return postSubredditName !== (null | "") && subredditFilterOptions[postSubredditName] !== undefined;
}

/**
 * @param subreddits The active subreddit filter options
 * @description Saves the given subreddit filter options to storage
 */
const setSubreddits = (subreddits) => {
    window.localStorage.setItem('subredditFilterOptions', JSON.stringify(subreddits));
}