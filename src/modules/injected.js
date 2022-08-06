// change to __visync_info__ later

const getInfo = (message, sendChromeMessage = true) => {
  let result;

  console.log(window.viSyncInfo);

  if (window.viSyncInfo == undefined) {
    window.viSyncInfo = {
      page: document.querySelector("video") !== null ? "main" : "failure",
      tabId: message.tabId,
      proxyIsInitialized: false,
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

const removeInfo = () => {
  console.log("info is being disconnected");
  delete window.viSyncInfo;
};

const isInitialized = () => {
  return window.viSyncInfo !== undefined;
};

const proxyIsInitialized = () => {
  return window.viSyncInfo.proxyIsInitialized;
};

const updateInfo = (obj) => {

  console.log('info is being updated');
  console.log(window.viSyncInfo);
  Object.assign(window.viSyncInfo, obj)
  
  
};

// const setInfo(obj) => window.viSyncInfo

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
