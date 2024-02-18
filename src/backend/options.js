/**
 * Event handling for options page
 */

import '../frontend/options.css';

/**
 @description Sets up event handling
 */
const addListeners = () => {
    const addButton = document.getElementById("addButton");
    const deleteButton = document.getElementById("deleteButton");
    const updateButton = document.getElementById("updateButton");

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
    const name = document.getElementById("subredditInput").value;
    await addSubredditFromInput(name);
}

/**
 * @param name The name of the subreddit
 * @description If a subreddit with the given name already exists, throws an error,
 *              otherwise adds a subreddit to storage with the given name and updates the table
 */
const addSubredditFromInput = async (name) => {

    chrome.storage.local.get(name, async (result) => {

        if (!(name in result)) {

            const subredditOptions = {};

            subredditOptions[name] = {
                filterCategory: "before",
                filterDateTime: parseUTCDate(new Date()),
                isActive: false
            };

            // adds subreddit
            await chrome.storage.local.set(subredditOptions);

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
    const cell = addCell(row);

    const namePrefix = "-name";

    // Creates an element with the name of the subreddit
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.setAttribute("class", "subreddit" + namePrefix);
    element.setAttribute("value", name);

    element.required = true;
    element.value = name;

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param filterCategory The filter category of the subreddit, if null then uses default values
 * @description Adds the filter categories to the table
 */
const addFilterCategory = (row, filterCategory) => {
    const cell = addCell(row);

    const categoriesPrefix = "-filter-categories";
    const categories = ["before", "after"];

    // Creates an element with the filter categories
    const element = document.createElement("select");
    element.setAttribute("class", "subreddit" + categoriesPrefix);

    // Populates element with filter categories
    for (let category of categories) {
        let option = document.createElement("option");

        option.innerHTML = category;
        option.value = category;

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
    const cell = addCell(row);

    const datePrefix = "-datetime-local";

    // Creates a date element
    const element = document.createElement("input");
    element.setAttribute("type", "datetime-local");
    element.setAttribute("class", "subreddit" + datePrefix);

    element.required = true;

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
    const cell = addCell(row);

    const boxPrefix = "-activebox";

    // Creates a box element
    const element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

    if (isActive !== null) {
        element.checked = isActive;
    } else {
        element.checked = false;
    }

    cell.appendChild(element);
}

/**
 * @param row The table row to add to
 * @param isSelected Whether the filter is selected, if null then uses default values
 * @description Adds a box indicating whether the filter is currently selected to the table
 */
const addSelectedBox = (row, isSelected) => {
    const cell = addCell(row);

    const boxPrefix = "-selectedbox";

    // Creates a box element
    const element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.setAttribute("class", "subreddit" + boxPrefix);

    if (isSelected !== null) {
        element.checked = isSelected
    } else {
        element.checked = false;
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
    const subreddits = document.getElementById("subreddits").getElementsByTagName("tbody")[0];
    const selectedSubreddits = [];
    const selectedColumn = 4; // column index for the selected boxes

    let i = 0;

    while (i < subreddits.rows.length) {
        // check if subreddit is selected
        let subreddit = subreddits.rows[i];

        if (subreddit.children[selectedColumn].getElementsByTagName("input")[0].checked) {
            let name = subreddit.children[0].getElementsByTagName("input")[0].value;
            selectedSubreddits.push(name);
            subreddits.deleteRow(i);
        } else {
            i++;
        }
    }

    await chrome.storage.local.remove(selectedSubreddits);
}

/**
 * @description Updates subreddit table if no names are duplicated or empty, and if no datetimes are empty
 *              otherwise resets options to the currently stored options
 */
const updateSubreddits = async () => {
    const subreddits = document.getElementById("subreddits").getElementsByTagName("tbody")[0];

    const checkedSubreddits = {};
    const nameColumn = 0; // column index for subreddit name
    const filterDateTimeColumn = 2; // column index for datetime
    let shouldUpdate = true;

    for (let i = 0; i < subreddits.rows.length; i++) {
        let subreddit = subreddits.rows[i];
        let name = subreddit.children[nameColumn].getElementsByTagName("input")[0].value;
        let filterDateTime = subreddit.children[filterDateTimeColumn].getElementsByTagName("input")[0].value;

        // check for duplication in table
        if (checkedSubreddits[name] || name === "" || filterDateTime === "") {
            shouldUpdate = false;
            break;
        } else {
            checkedSubreddits[name] = true;
        }
    }

    if (shouldUpdate) {
        await updateSubredditsFromInput();
    } else {
        console.log("Duplicate or invalid field inputted");
    }
}

/**
 * @description Updates storage with the subreddit table information
 */
const updateSubredditsFromInput = async () => {
    const subreddits = document.getElementById("subreddits").getElementsByTagName("tbody")[0];
    const nameColumn = 0; // column index for subreddit name
    const filterCategoryColumn = 1; // column index for filter category
    const filterDateTimeColumn = 2; // column index for datetime
    const isActiveColumn = 3; // column index for activebox

    for (let i = 0; i < subreddits.rows.length; i++) {
        let subreddit = subreddits.rows[i];

        // gets name stored in attribute and dynamically updated name
        let oldName = subreddit.children[nameColumn].getElementsByTagName("input")[0].getAttribute("value");
        let newName = subreddit.children[nameColumn].getElementsByTagName("input")[0].value;

        let filterCategory = subreddit.children[filterCategoryColumn].getElementsByTagName("select")[0].value;
        let filterDateTime = subreddit.children[filterDateTimeColumn].getElementsByTagName("input")[0].value;
        let isActive = subreddit.children[isActiveColumn].getElementsByTagName("input")[0].checked;

        if (oldName !== newName) {
            // removes old item only if name has been changed
            await chrome.storage.local.remove(oldName);
        }

        const subredditOptions = {};
        subredditOptions[newName] = {
            filterCategory: filterCategory,
            filterDateTime: parseUTCDate(filterDateTime),
            isActive: isActive
        };

        await chrome.storage.local.set(subredditOptions);

        // updates value attribute of subreddit to reflect updated name
        subreddit.children[nameColumn].getElementsByTagName("input")[0].setAttribute("value", newName);
    }

}

/**
 * @description Retrieves subreddits from storage, clears table and displays them in table
 */
const loadSubreddits = async () => {
    const subreddits = document.getElementById("subreddits").getElementsByTagName("tbody")[0];
    let i = 0;

    while (i < subreddits.rows.length) {
        subreddits.deleteRow(i);
        i++;
    }

    chrome.storage.local.get(null, (result) => {

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

    const offsetMinutes = new Date().getTimezoneOffset();
    const date = new Date(utcDate);
    date.setMinutes(date.getMinutes() - offsetMinutes)

    return date.toLocaleString('sv').slice(0, -3);
}

await loadSubreddits();
addListeners();

