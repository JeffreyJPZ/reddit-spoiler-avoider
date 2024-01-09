/**
 * Content script for reddit main page
 * */

// let menuContainer = "XEkFoehJNxIH9Wlr5Ilzd _2MgAHlPDdKvXiG-Qbz5cbC ";
// let searchedContainer = "";
// let postsContainer = "rpBJOHq2PR60pnwJlUyP0";
// let postContainerPrefix = "_1oQyIsiPHYt6nx7VOmd1sz _1RYN-7H8gYctjOQeL8p2Q7 scrollerItem _3Qkp11fjcAw9I9wtLo8frE _1qftyZQ2bhqP62lbPjoGAh _1Qs6zz6oqdrQbR7yE_ntfY" // class name of container w/ post, need to match
// let exampleSubredditClassName = "_3ryJoIoycVkA88fy40qNJc"; // class name of container containing subreddit name
//
// let posts = document.querySelector("${postsContainer}");
// let menu = document.querySelector("${menuContainer}");

let subredditIDs = {};

/**
 * @description constructs a subreddit structure
 */
const initializeMap = () => {
    subredditIDs = new Map();
}

/**
 *
 * @param data  the JSON serializable object containing filter parameters for subreddits
 * @description parses the JSON object and updates the subreddit structure with the parsed data
 */
const parseData = (data) => {
    // TODO: implement
}

/**
 *
 * @param name The subreddit name whose data needs to be updated
 * @param data The subreddit filter parameters for the given name
 * @description if subreddit structure is not initialized, initializes the structure
 *              and if name does not match any existing entry, make a new entry with name and data
 *              otherwise, update the entry for name with data
 */
const updateSubreddit = (name, data) => {
    // TODO: implement
}

/**
 *
 * @param ids   the subreddit names associated with their container names
 * @param date  the date from which to filter posts
 * @param category boolean representing whether to filter after the given date
 *                 true if after
 *                 false otherwise
 * @description goes through each post and deletes the post if the subreddit name matches,
 * and the post is within the given date
 */
const filterPosts = (ids, date, category) => {
    // TODO: implement
}

// map id tags to subreddit names
// check posts with subreddit id tag in parent container e.g. t3_14ci7cr and if child container w/ subreddit name matches, delete the post

// should run everytime the user scrolls - need event listener that filters and sends statistics on scroll