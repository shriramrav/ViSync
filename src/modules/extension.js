// change to __visync_info__ later

const getInfo = (message, sendChromeMessage = true) => {
  if (window.__visync_info__ == undefined) {
    window.__visync_info__ = {
      page: document.querySelector("video") !== null ? "main" : "failure",
      tabId: message.tabId,
      proxyIsInitialized: false,
    };
  }

  message.data = window.__visync_info__;

  if (sendChromeMessage) {
    chrome.runtime.sendMessage(message);
  }

  return message.data;
};

const updateInfo = (obj) => {
  console.log("info is being updated");
  console.log(window.__visync_info__);
  Object.assign(window.__visync_info__, obj);
};

const removeInfo = () => {
  console.log("info is being disconnected");
  delete window.__visync_info__;
};

const isInitialized = () => window.__visync_info__ !== undefined;

const proxyIsInitialized = () => window.__visync_info__.proxyIsInitialized;

const postMessage = (message, tabId) =>
  new BroadcastChannel(`visync-${tabId}`).postMessage(message);

export {
  getInfo,
  removeInfo,
  updateInfo,
  postMessage,
  isInitialized,
  proxyIsInitialized,
};
