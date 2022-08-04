import * as m from "./modules/messages";
import { rejectErrors } from "./modules/utility";
import { injectFile, getActiveTab, injectFunc } from "./modules/swHelpers";
import * as ext from "./modules/injected";

let currentTab;

const functionMap = {
  [m.getExtensionInfo.response]: getExtensionInfo,
  [m.server.createRoom.response]: bcPostMessage,
  [m.server.joinRoom.response]: bcPostMessage,
  [m.server.destroy.response]: destroy,
  [m.injectContent.response]: injectContent,
};

// Response functions

function getExtensionInfo(message) {
  console.log(currentTab.url);
  console.log(currentTab.url.includes("https://"));

  const { url, id } = currentTab;

  if (url.includes("https://")) {
    injectFunc(id, ext.getInfo, Object.assign(message, { tabId: id }));
  } else {
    chrome.runtime.sendMessage(
      // Default page
      Object.assign(message, { data: { page: "failure" } })
    );
  }
}

function bcPostMessage(message) {
  const { id } = currentTab;

  injectFunc(id, ext.postMessage, message, id);
}

function injectContent() {
  injectFile(currentTab.id, "content.js");
}

function destroy(message) {
  console.log("recieved server destroy message");

  injectFunc(currentTab.id, ext.removeInfo);
  bcPostMessage(message);
}

// Event listener functions

async function onMessage(message) {
  if (message.request != undefined) {
    currentTab = await getActiveTab();

    delete message.request;

    console.log(message);
    console.log(currentTab);

    rejectErrors(() => functionMap[message.response](message));
  }
}

// check for url

chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onActivated.addListener((obj) => console.log(obj));

console.log("Service Worker Running");
