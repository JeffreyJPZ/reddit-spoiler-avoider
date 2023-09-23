import {Subreddit} from "./modules/subreddit.js";

const subredditPrefix = "subreddit-"; // identifier for subreddit

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
 * @description Adds a subreddit
 */
const addSubreddit = () => {
    addCells("subreddits", 1);
}

/**
 *
 * @param id The id of the table
 * @param numCells The number of cells to add
 * @description Adds the appropriate number of cells to the subreddit table
 */
const addCells = (id, numCells) => {
    let row = document.getElementById(id).getElementsByTagName("tbody")[0].insertRow();

    for (let i = 0; i < numCells; i++) {
        let cell = row.insertCell();
        let subredditInput = document.getElementById("subredditInput").value;
        let sub = new Subreddit(subredditInput);
        let text = sub.getName();

        // Creates an element with the name of the subreddit
        let textElement = document.createElement("DIV");
        textElement.setAttribute("id", subredditPrefix + subredditInput + "-name");
        textElement.appendChild(document.createTextNode(text));

        // Creates a date element
        let dateElement = document.createElement("INPUT");
        dateElement.setAttribute("type", "datetime-local");
        dateElement.setAttribute("id", subredditPrefix + subredditInput + "-datetime-local");

        // Creates a checkbox element
        let selectElement = document.createElement("INPUT");
        selectElement.setAttribute("type", "checkbox");
        selectElement.setAttribute("id", subredditPrefix + subredditInput + "-checkbox");

        // Creates a label element to store the subreddit
        let element = document.createElement("LABEL");
        element.setAttribute("id", subredditPrefix + subredditInput);

        element.append(textElement, dateElement);
        cell.appendChild(element);
        console.log("i")
    }
}

addListeners();

// // EFFECTS: sends the subreddit names and time filters to the content script
// const sendFilters = () => {
//     let params = {
//         active: true,
//         currentWindow : true
//     }
//
//     chrome.tabs.query();
// }