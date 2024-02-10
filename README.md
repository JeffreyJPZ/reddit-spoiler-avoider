# Subreddit Time Filter

## Description:
An extension for blocking posts from subreddits within a specific time range on Old Reddit to avoid spoilers
or to decrease clutter. Written in JavaScript and HTML using the Chrome API, styled with CSS, bundled with Webpack, and tested with Jest and Puppeteer.

This filter is compatible with Reddit Enhancement Suite's never-ending scrolling feature,
which can be found here:

https://chromewebstore.google.com/detail/reddit-enhancement-suite/kbmfpngjjgdllneeigpgjifpgocmfgmb.

## Credits:
Inspiration was taken from:

https://dev.to/tommyli97/building-my-first-chrome-extension-reddit-filter-312m

## Installation:
1. Click **<> Code** and choose **Download ZIP** from the options.
2. Download the zipped folder into whatever directory you wish, then unzip the folder.
3. With the Chrome browser open, navigate to the menu (three dots on in the upper right). Click on **Extensions >> Manage Extensions**.
4. From the extensions menu, click on the **Load unpacked** button at the top left of the page.
5. When prompted to select the location of the extension directory, navigate to where you unzipped the extension folder, click on the folder, then choose the **dist** folder inside.
6. The extension should now be loaded, and an icon should appear in the toolbar next to the searchbar. For information on how to use the extension, click on the icon to open a popup. Enjoy!

## Possible Improvements:
- Create a database layer, as the extension relies on the Chrome Storage implementation currently
- Write more integration tests to test if values are being stored properly, which needs a database layer that exposes the right methods