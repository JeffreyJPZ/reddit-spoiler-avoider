/**
 * Event handling for extension popup
 */

import '../frontend/popup.css';

/**
 @description Sets up event handling
 */
const addListeners = () => {
    let filterButton = document.getElementById("filterButton");
    let optionsButton = document.getElementById("optionsButton");

    document.addEventListener("DOMContentLoaded", () => {
        filterButton.addEventListener("click", () => {
            filterSubreddits();
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        optionsButton.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    });
}

/**
 * @description Filters the posts with the selected subreddits and returns filter statistics
 * @param subreddits JSON object with the active filters
 */
const filterSubreddits = (subreddits) => {
    getSelectedSubredditData()
        .then(sendMessage())
        .then(postFilterStatistics);

    return null; // stub
}

/**
 *@description Gets and returns the subreddit data for each selected subreddit
 */
const getSelectedSubredditData = () => {
    // return JSON data for each selected subreddit from storage
    return null;
}

/**
 * @param data The subreddit data in JSON object form
 * @description Sends subreddit data to content script when appropriate action occurs, receives response with
 * filter statistics
 * @return An object with filter statistics or an error message
 */
const sendMessage = async (data) => {
    try {
        let response = await chrome.runtime.sendMessage({key: "filter", data: data});
        return {response: response, error: undefined};
    } catch (error) {
        return {response: undefined, error: error};
    }
}

/**
 * @param response The filter statistics in JSON object form
 * @description Displays appropriate filter statistics to the user
 */
const postFilterStatistics = (response) => {
    // stub TODO: implement
}

addListeners();