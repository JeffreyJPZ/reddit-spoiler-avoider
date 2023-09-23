/**
 * Manages script injection and message sending
 */

/**
 *
 * @param type The type of script to be injected
 * @param path The path of the script to be injected
 * @param dest The tag of the element in the document to be inserted
 * @description Injects a script with the given path into the document
 */
const injectScript = (type, path, dest) => {
    let element = document.querySelector(dest);
    let script = document.createElement("script");

    script.setAttribute("src", path);
    script.setAttribute("type", type);

    element.appendChild(script);
}

injectScript()