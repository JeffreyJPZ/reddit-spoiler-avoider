/**
 * Handles browser events e.g. user clicking on tab or scrolling and sends message to appropriate script
 * e.g. user clicks, background fires, gets popup data and sends to content script,
 * displays count of subreddits that have active filters, stores saved subreddits to storage api
 */

/**
 * @description Sets up event handling
 */
const addListeners = () => {
    chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
            handleMessage(message).then(sendResponse);
            return true;
    });
}

/**
 * @description Handles message sending to content scripts
 * @param message The data to be passed
 * @return response The response message from the content scripts
 */
const handleMessage = async (message) => {
    if (message.key === "filter") { // passes data to content script
        let tabParams = {
            active: true,
            currentWindow: true
        }

        let [tab] = await chrome.tabs.query(tabParams);

        return chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['./mainPage.js'], // TODO: may need to update this for dist
            func: mainPage(tab, message)
        });
    }
}

const mainPage = (tab, message) => {
    return chrome.scripting.executeScript({
        target: {tabId: tab.id},
        args: [message.data],
        func: (...args) => {
            parseData(...args);
        }
    });
}

addListeners();