/**
 * Event handling for extension popup
 */

import '../frontend/popup.css';

/**
 @description Sets up event handling
 */
const addListeners = () => {
    const filterButton = document.getElementById("filterButton");
    const optionsButton = document.getElementById("optionsButton");

    document.addEventListener("DOMContentLoaded", () => {
        filterButton.addEventListener("click", async () => {
            try {
                await filterSubreddits();
            } catch (err) {
                console.log(err);
            }
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        optionsButton.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    });
}

/**
 * @description Notifies the background script to pass active subreddits to the content script
 */
const filterSubreddits = async () => {
    await chrome.runtime.sendMessage(JSON.stringify({key: 'refreshFilters'}));
}

addListeners();

