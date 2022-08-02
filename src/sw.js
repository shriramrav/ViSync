import * as m from "./modules/messages";
import { injectFile, getActiveTabId, injectFunc } from "./modules/utility";
import {
  requestResponsePort,
  requestResponseInjectFunc,
} from "./modules/requestResponse";
import checkForVideoPlayer from "./modules/checkForVideoPlayer";
import { generateRandomKey } from "./modules/keys";
import windowPostMessage from "./modules/windowPostMessage";
import getExtensionInfo from "./modules/getExtensionInfo";

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
async function initializeTab(tabId) {
  return new Promise((resolve) => {
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

      requestResponseInjectFunc(tabId, checkForVideoPlayer, message).then(
        (result) => {
          if (result) {
            data.page = "main";

            // Check if this saves time while opening popup
            injectFile(tabId, "content.js");
          }
          resolve();
        }
      );

      extensionInfo[tabId] = data;
    } else {
      resolve();
    }

    // Add check for if another tab already has room created
  });
}

async function onConnectEventListener(port) {

  // Could add listeners for current tab later
  ports[await getActiveTabId()] = port;
}

async function onMessageEventListener(message) {
  let tabId = await getActiveTabId();
  let shouldSendMessage = true;

  switch (message.request) {
    case m.getExtensionInfo.request:
      // Test
      // await initializeTab(tabId);

      console.log("initalizeTab finished");

      message.data = extensionInfo[tabId];


      injectFunc(tabId, getExtensionInfo, message);



      shouldSendMessage = false;
      break;
    case m.server.registerUser.request:
      let result = await requestResponsePort(ports[tabId], message);


      if (result.data !== m.server.events.error) {
        // 
        extensionInfo[tabId] = result;
      }
      console.log("From service worker");
      console.log(result);
      console.log(m.server.events.error);


      // 
      message.data = result;

      break;
    case m.server.destroy.request:
      await injectFunc(tabId, windowPostMessage, message);
      delete extensionInfo[tabId];

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
chrome.tabs.onRemoved.addListener(resetTab);

chrome.runtime.onConnect.addListener(onConnectEventListener);
chrome.runtime.onMessage.addListener(onMessageEventListener);

// chrome.runtime.onActivated.addListener()

console.log("Service Worker Running");
