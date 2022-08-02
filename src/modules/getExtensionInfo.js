export default (message) => {

    if (window.viSyncInfo == undefined) {
        window.viSyncInfo = {
            page: document.querySelector("video") !== null ? "main" : "failure",
        };
    }

    chrome.runtime.sendMessage(Object.assign(message, { data: viSyncInfo }));
};
