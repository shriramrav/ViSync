import * as m from "./modules/messages";
import { injectFile, getActiveTab, injectFunc } from "./modules/swHelpers";
import * as ext from "./modules/injected";

let currentTab;

let functionMap = {
  [m.getExtensionInfo.response]: getExtensionInfo,
  [m.server.createRoom.response]: bcPostMessage,
  [m.server.joinRoom.response]: bcPostMessage,
  [m.server.destroy.response]: destroy,
  [m.injectContent.response]: injectContent,
};

// Response functions

async function getExtensionInfo(message) {
  message.tabId = currentTab.id;

  console.log("inside getExtensionInfo");
  console.log(message.tabId);

  const tab = await chrome.tabs.get(message.tabId);

  if (tab.url.includes("https://")) {
    injectFunc(message.tabId, ext.getInfo, message);
  } else {
    message.data = {
      page: "failure",
    };

    chrome.runtime.sendMessage(message);
  }
}

function bcPostMessage(message) {
  injectFunc(message.tabId, ext.postMessage, message, message.tabId);
}

function injectContent(message) {
  injectFile(message.tabId, "content.js", true);
}

function destroy(message) {
  console.log("recieved server destroy message");
}

// Helper functions

function initializeProxyIfNeeded(tabId) {
  injectFunc(tabId, ext.getInfo, { tabId: tabId }, false).then(() => {
    injectFile(tabId, "proxy.js");
  });
}

// Event listener functions

async function onMessage(message) {
  if (message.request != undefined) {
    // Change to get tabdata from message later
    currentTab = await getActiveTab();

    delete message.request;

    message.from = "sw";

    functionMap[message.response](message);
  }
}

function onActivated(tabObj) {
  const { tabId } = tabObj;
  initializeProxyIfNeeded(tabId);
}

function onUpdated(tabId, docInfo, tab) {
  const { url } = tab;
  if (url !== undefined && docInfo.status == "complete") {
    initializeProxyIfNeeded(tabId);
  }
}

// Binds event listeners

chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

console.log("Service Worker Running");

// TODO

// change checks in listeners

// add destroyer and make sure to reset with url change

// rename to proxy and content helpers to document helpers documentHelpers

// fix variable names through proxy and content, and service worker

// for global variables, change to __x__ style name
