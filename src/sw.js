import * as m from "./modules/messages";
import { injectFile, injectFunc, getActiveTabId } from "./modules/utility";
import {
  requestResponsePort,
  requestResponseSendMessage,
} from "./modules/requestResponse";
import checkForVideoPlayer from "./modules/checkForVideoPlayer";
import { generateRandomKey } from "./modules/keys";

let extensionInfo = {};
let activeExtensionTab = null;
let ports = {};

// Event listener functions

function resetTab(tabId) {
  if (activeExtensionTab === tabId) {
    activeExtensionTab = null;
  }
  delete extensionInfo[tabId];
  delete ports[tabId];
}

// Change function name later
function initializeTab(tabId) {
  if (extensionInfo[tabId] === undefined) {
    // Message for checking if video player exists
    let message = {
      request: generateRandomKey(),
      response: generateRandomKey(),
    };

    let data = {
      page: "failure",
      key: "",
    };

    requestResponseSendMessage(message).then((result) => {
      if (result) {
        data.page = "main";

        // Check if this saves time while opening popup
        injectFile(tabId, "content.js");
      }
    });

    injectFunc(tabId, checkForVideoPlayer, message);

    extensionInfo[tabId] = data;
  }

  // Add check for if another tab already has room created
}

async function onConnectEventListener(port) {
  ports[await getActiveTabId()] = port;
  // setTimeout(() => {
  //   port.postMessage("hello");
  //   console.log("port added to ports obj");
  // }, 2000);
}

async function onMessageEventListener(message) {
  let tabId = await getActiveTabId();
  let shouldSendMessage = true;

  switch (message.request) {
    case m.getExtensionInfo.request:
      message.data = extensionInfo[tabId];
      break;
    default:
      shouldSendMessage = false;
  }

  if (shouldSendMessage) {
    // CAUTION: make sure for no infinite message sending
    chrome.runtime.sendMessage(message);
  }
}

// Binds all event listeners
chrome.tabs.onUpdated.addListener(resetTab);
chrome.tabs.onUpdated.addListener(initializeTab);

chrome.tabs.onRemoved.addListener(resetTab);

chrome.tabs.onActivated.addListener(({ tabId } = {}) => initializeTab(tabId));

chrome.runtime.onConnect.addListener(onConnectEventListener);

chrome.runtime.onMessage.addListener(onMessageEventListener);

console.log("Service Worker Running");
