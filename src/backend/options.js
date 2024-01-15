/**
 * Event handling for options page
 */

import '../frontend/options.css';

/**
 @description Sets up event handling
 */
const addListeners = () => {
    let addButton = document.getElementById("addButton");
    let deleteButton = document.getElementById("deleteButton");
    let updateButton = document.getElementById("updateButton");

    document.addEventListener("DOMContentLoaded", () => {
        addButton.addEventListener("click", async () => {
            try {
                await addSubreddit();
            } catch (err) {
                console.log(err);
            }

        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        deleteButton.addEventListener("click", async () => {
            try {
                await deleteSubreddits();
            } catch (err) {
                console.log(err);
            }
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        updateButton.addEventListener("click", async () => {
            try {
                await updateSubreddits();
            } catch (err) {
                console.log(err);
            }
        });
    });
}

/**
 * @description Parses the inputted subreddit and adds a subreddit to the table
 */
const addSubreddit = async () => {
    let name = document.getElementById("subredditInput").value;

    await addSubredditToStorage(name);

}

/**
 * @param name The name of the subreddit
 * @description If a subreddit with the given name already exists, throws an error,
 *              otherwise adds a subreddit to storage with the given name
 */
const addSubredditToStorage = async (name) => {

    await chrome.storage.local.get(name, async (result) => {

        if (!(name in result)) {

            let subreddit = {};
            subreddit[name] = {
                filterCategory: "before",
                filterDateTime: parseUTCDate(new Date()),
                isActive: "false"
            };

            // adds subreddit
            await chrome.storage.local.set(subreddit);

            console.log("Subreddit " + name + " added"); // debugging purposes

            addSubredditToTable(name, null, null, null, null);

        } else {
            console.log("Duplicate subreddit " + name + " was not added");
        }

    });

}

/**
 * @param name The name of the subreddit
 * @param filterCategory The filter category of the subreddit, if null then uses default values
 * @param filterDateTime The filter date of the subreddit, if null then uses default values
 * @param isActive Whether the filter is active, if null then uses default values
 * @param isSelected Whether the filter is selected, if null then uses default values
 * @description Adds a subreddit to the table
 */
const addSubredditToTable = (name, filterCategory, filterDateTime, isActive, isSelected) => {
    let row = document.getElementById("subreddits").getElementsByTagName("tbody")[0].insertRow();
    row.setAttribute("class", "subreddit");

    addName(row, name);
    addFilterCategory(row, filterCategory);
    addFilterDateTime(row, filterDateTime);
    addSetActiveBox(row, isActive);
    addSelectedBox(row, isSelected);
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
 * @param filterCategory The filter category of the subreddit, if null then uses default values
 * @description Adds the filter categories to the table
 */
const addFilterCategory = (row, filterCategory) => {
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

    if (filterCategory !== null) {
        element.value = filterCategory;
    } else {
        element.value = categories[0];
    }

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param filterDateTime The filter datetime of the subreddit, if null then uses default values
 * @description Adds a date to the table
 */
const addFilterDateTime = (row, filterDateTime) => {
    let cell = addCell(row);

    let datePrefix = "-datetime-local";

    // Creates a date element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "datetime-local");
    element.setAttribute("class", "subreddit" + datePrefix);
    element.setAttribute("contentEditable", "true");

    if (filterDateTime !== null) {
        element.value = parseLocalDate(filterDateTime);
    } else {
        // sets default value as local time
        element.value = new Date().toLocaleString('sv').slice(0, -3);
    }


    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param isActive Whether the filter is active, if null then uses default values
 * @description Adds a box indicating whether the filter is active to the table
 */
const addSetActiveBox = (row, isActive) => {
    let cell = addCell(row);

    let boxPrefix = "-activebox";

    // Creates a box element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

    if (isActive !== null) {
        element.value = isActive;
    } else {
        element.value = false;
    }

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param isSelected Whether the filter is selected, if null then uses default values
 * @description Adds a box indicating whether the filter is currently selected to the table
 */
const addSelectedBox = (row, isSelected) => {
    let cell = addCell(row);

    let boxPrefix = "-selectedbox";

    // Creates a box element
    let element = document.createElement("INPUT");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

    if (isSelected !== null) {
        element.value = isSelected
    } else {
        element.value = false;
    }

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
const deleteSubreddits = async () => {

    // iterate through table and get all selected subreddits as a map, deleting rows
    let subreddits = document.getElementById("subreddits").getElementsByTagName("tbody")[0];
    let selectedSubreddits = [];
    let selectedColumn = 4; // column index for the selected boxes

    let i = 0;

    while (i < subreddits.rows.length) {
        // check if subreddit is selected
        let subreddit = subreddits.rows[i];

        if (subreddit.children[selectedColumn].getElementsByTagName("input")[0].checked) {
            let name = subreddit.children[0].getElementsByTagName("DIV")[0].innerHTML;
            selectedSubreddits.push(name);
            subreddits.deleteRow(i);
        } else {
            i++;
        }
    }

    await chrome.storage.local.remove(selectedSubreddits);
}

/**
 * @description Updates subreddit table if no names are duplicated and all fields are valid
 *              otherwise resets options to the currently stored options
 */
const updateSubreddits = async () => {
    // stub
}

/**
 * @description Retrieves subreddits from storage and displays them in table
 */
const loadSubreddits = async () => {

    await chrome.storage.local.get(null, (result) => {

        for (let key in result) {

            let name = key;
            let filterCategory = result[key].filterCategory;
            let filterDateTime = result[key].filterDateTime;
            let isActive = result[key].isActive;

            addSubredditToTable(name, filterCategory, filterDateTime, isActive, null);
        }
    });
}

/**
 * @param localDate The local datetime string from which to parse in ISO 8601 compliance
 * @description Parses UTC date from local date string up to minutes
 */
const parseUTCDate = (localDate) => {
    return new Date(localDate).toISOString().slice(0, -8);
}

/**
 * @param utcDate The datetime string in UTC from which to parse in ISO 8601 compliance
 * @description Parses local date from UTC string date up to minutes
 */
const parseLocalDate = (utcDate) => {
    // uses sweden's similarity to iso, but is a bit inefficient

    let offsetMinutes = new Date().getTimezoneOffset();
    let date = new Date(utcDate);
    date.setMinutes(date.getMinutes() - offsetMinutes)

    return date.toLocaleString('sv').slice(0, -3);
}

await loadSubreddits();
addListeners();