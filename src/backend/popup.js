/**
 * Event handling for extension popup
 */

// Using node 21.0.0 and npm 10.2.0
// TODO: test using jasmine

import {Subreddit} from './modules/subreddit.js';
import '../frontend/popup.css';

const SUBREDDIT_PREFIX = "subreddit-"; // identifier for subreddit

/**
 @description Sets up event handling
 */
const addListeners = () => {
    let addButton = document.getElementById("addButton");
    let filterButton = document.getElementById("filterButton");

    document.addEventListener("DOMContentLoaded", () => {
        addButton.addEventListener("click", () => {
            addSubreddit();
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        filterButton.addEventListener("click", () => {
            filterSubreddits();
        });
    });
}

/**
 * @description Adds a subreddit to the table
 */
const addSubreddit = () => {
    let subredditInput = document.getElementById("subredditInput").value;
    let sub = new Subreddit(subredditInput); // TODO: STORE SUB IN STORAGE
    let name = sub.getName();

    let row = document.getElementById("subreddits").getElementsByTagName("tbody")[0].insertRow();
    row.setAttribute("id", SUBREDDIT_PREFIX + subredditInput);

    addName(row, name);
    addFilterCategory(row, name);
    addFilterDate(row, name);
    addSelectedBox(row, name);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name
 * @description Adds the inputted subreddit name to the table
 */
const addName = (row, name) => {
    let cell = addCell(row);

    let namePrefix = "-name";

    // Creates an element with the name of the subreddit
    let element = document.createElement("DIV");
    element.setAttribute("id", SUBREDDIT_PREFIX + name + namePrefix);
    element.appendChild(document.createTextNode(name));

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name associated with the filter categories
 * @description Adds the filter categories to the table
 */
const addFilterCategory = (row, name) => {
    let cell = addCell(row);

    let categoriesPrefix = "-filter-categories";
    let categories = ["before", "after"];

    // Creates an element with the filter categories
    let element = document.createElement("SELECT");
    element.setAttribute("id", SUBREDDIT_PREFIX + name + categoriesPrefix);

    // Populates element with filter categories
    for (let category of categories) {
        let option = document.createElement("OPTION");
        option.setAttribute("id", SUBREDDIT_PREFIX + name + categoriesPrefix + category);
        option.setAttribute("value", category);
        option.innerHTML = category;

        element.appendChild(option);
    }

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name associated with the filter date
 * @description Adds a date to the table
 */
const addFilterDate = (row, name) => {
    let cell = addCell(row);

    let datePrefix = "-datetime-local";

    // Creates a date element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "datetime-local");
    element.setAttribute("id", SUBREDDIT_PREFIX + name + datePrefix);

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name associated with the selected box
 * @description Adds a selected box to the table
 */
const addSelectedBox = (row, name) => {
    let cell = addCell(row);

    let boxPrefix = "-checkbox";

    // Creates a box element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "checkbox");
    element.setAttribute("id", SUBREDDIT_PREFIX + name + boxPrefix);

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @description Adds and returns a cell to the given row
 */
const addCell = (row) => {
    return row.insertCell();
}

/**
 * @description Filters the posts with the selected subreddits and returns filter statistics
 */
const filterSubreddits = () => {
    getSelectedSubredditData()
        .then(sendMessage())
        .then(postFilterStatistics);

}

/**
 *@description Gets and returns the subreddit data for each selected subreddit
 */
const getSelectedSubredditData = () => {
    // return JSON data for each selected subreddit TODO: implement async

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