/**
 * Event handling for options page
 */

import '../frontend/options.css';

/**
 @description Sets up event handling
 */
const addListeners = () => {
    let addButton = document.getElementById("addButton");

    document.addEventListener("DOMContentLoaded", () => {
        addButton.addEventListener("click", () => {
            addSubreddit();
        });
    });
}

/**
 * @description Adds a subreddit to the table if the inputted name is not duplicated, otherwise does nothing
 */
const addSubreddit = () => {
    let subredditInput = document.getElementById("subredditInput").value;

    // TODO: check if key already exists with given value in storage
    chrome.storage.local.get(subredditInput, (result) => {
        // try catch
        if (result !== null) {
            // stub
        }
    });

    let row = document.getElementById("subreddits").getElementsByTagName("tbody")[0].insertRow();
    row.setAttribute("class", "subreddit");

    addName(row, subredditInput);
    addFilterCategory(row, subredditInput);
    addFilterDate(row, subredditInput);
    addSetActiveBox(row, subredditInput);
    addSelectedBox(row, subredditInput);

    // TODO: add to storage with default vals
    const res = chrome.storage.local.set(
                                {subredditInput: {
                                    "filterCategory": "before",
                                    "dateTime": new Date().toISOString(),
                                    "isActive": "false"
                                }}
    ); // stub

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
    element.setAttribute("class", "subreddit" + namePrefix);
    element.setAttribute("contentEditable", "true");
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
    element.setAttribute("class", "subreddit" + categoriesPrefix);

    // Populates element with filter categories
    for (let category of categories) {
        let option = document.createElement("OPTION");
        option.setAttribute("class", "subreddit" + categoriesPrefix + category);
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
    element.setAttribute("class", "subreddit" + datePrefix);
    element.setAttribute("value", new Date().toISOString());

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name associated with the active box
 * @description Adds a box indicating whether the filter is active to the table
 */
const addSetActiveBox = (row, name) => {
    let cell = addCell(row);

    let boxPrefix = "-activebox";

    // Creates a box element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param name The subreddit name associated with the selected box
 * @description Adds a box indicating whether the filter is currently selected to the table
 */
const addSelectedBox = (row, name) => {
    let cell = addCell(row);

    let boxPrefix = "-selectedbox";

    // Creates a box element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

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
 * @description Deletes all subreddits that are selected
 */
const deleteSubreddits = () => {

}

/**
 * @description Updates options for all subreddits if no names are duplicated, otherwise does nothing
 */
const updateSubreddits = () => {

}

addListeners();