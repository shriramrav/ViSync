export default (message) => {
    message.data = document.querySelector("video") != null;
    chrome.runtime.sendMessage(message);
}