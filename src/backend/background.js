/**
 * Handles browser events e.g. user clicking on popup button
 * Caches subreddit filter options
 */

// implement caching for subreddit filter options so that if user refreshes page (requestFilters key), then chrome storage does not need to be accessed (can pass cached subreddits to sendMessage)

// Listens for messages from popup or content script
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.key === 'refreshFilters' || parsedMessage.key === 'requestFilters') {
        getActiveSubreddits().then(() => sendResponse(''));
    }
    return true;
});

/**
 * @description Retrieves only the active subreddits from storage and passes the subreddits to the content script
 */
const getActiveSubreddits = async () => {
    const result = await chrome.storage.local.get(null);

    const activeSubreddits = {}
    for (let name in result) {
        if (result[name].isActive) {
            activeSubreddits[name] = result[name];
        }
    }

    await sendMessage('filter', activeSubreddits);
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

