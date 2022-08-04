const getInfo = (message, sendChromeMessage = true) => {
  let result;

  console.log(window.viSyncInfo);

  if (window.viSyncInfo == undefined) {
    window.viSyncInfo = {
      page: document.querySelector("video") !== null ? "main" : "failure",
      tabId: message.tabId,
    };

    result = Object.assign({ initialized: true }, viSyncInfo);
  } else {
    result = viSyncInfo;
  }

  console.log("result");
  console.log(result);

  if (sendChromeMessage) {
    chrome.runtime.sendMessage(Object.assign(message, { data: result }));
  }

  return result;
};

const removeInfo = () => delete window.viSyncInfo;

const updateInfo = (obj) => Object.assign(window.viSyncInfo, obj);

const postMessage = (message, tabId) =>
  new BroadcastChannel(`visync-${tabId}`).postMessage(message);

export { getInfo, removeInfo, updateInfo, postMessage };
