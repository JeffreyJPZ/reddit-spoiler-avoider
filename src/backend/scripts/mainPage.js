/**
 * Content script for reddit main page
 * */

let menuContainer = "XEkFoehJNxIH9Wlr5Ilzd _2MgAHlPDdKvXiG-Qbz5cbC ";
let searchedContainer = "";
let postsContainer = "rpBJOHq2PR60pnwJlUyP0";
let postContainerPrefix = "_1oQyIsiPHYt6nx7VOmd1sz _1RYN-7H8gYctjOQeL8p2Q7 scrollerItem _3Qkp11fjcAw9I9wtLo8frE _1qftyZQ2bhqP62lbPjoGAh _1Qs6zz6oqdrQbR7yE_ntfY" // class name of container w/ post, need to match
let exampleSubredditClassName = "_3ryJoIoycVkA88fy40qNJc"; // class name of container containing subreddit name

let posts = document.querySelector("${postsContainer}");
let menu = document.querySelector("${menuContainer}");

let subredditIDs = {};

/**
 * @description gets all the necessary subreddits and maps their subreddit class name to name
 */
const makeIDs = () => {
    subredditIDs = new Map();
}

/**
 *
 * @param ids   the subreddit names associated with their container names
 * @param date  the date from which to filter posts
 * @description goes through each post and deletes the post if the subreddit name matches,
 * and the post is within the given date
 */
const removePosts = (ids, date) => {

}

// map id tags to subreddit names
// check posts with subreddit id tag in parent container e.g. t3_14ci7cr and if child container w/ subreddit name matches, delete the post