/**
 * Handles browser events e.g. user clicking on tab or scrolling and sends message to appropriate script
 * e.g. user clicks, background fires, gets popup data and sends to content script
 */

// Listens for messages from popup or content script
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.key === 'refreshFilters' || parsedMessage.key === 'requestFilters') {
        getActiveSubreddits().then(sendResponse(''));
    }
    return true;
});

/**
 * @description Retrieves only the active subreddits from storage and passes the subreddits to the content script
 */
const getActiveSubreddits = async () => {
    chrome.storage.local.get(null, async (subreddits) => {

        const activeSubreddits = {}
        for (let name in subreddits) {
            if (subreddits[name].isActive) {
                activeSubreddits[name] = subreddits[name];
            }
        }

        await sendMessage('filter', activeSubreddits);
    });
}

/**
 * @param key The message key
 * @param subreddits The active subreddits to be passed in the message
 * @description Sends a message to the content script in the currently active tab
 */
const sendMessage = async (key, subreddits) => {
    const tabParams = {
        active: true,
        currentWindow: true
    }

    const [tab] = await chrome.tabs.query(tabParams);

    await chrome.tabs.sendMessage(tab.id, JSON.stringify({key: key, data: subreddits}));
}

