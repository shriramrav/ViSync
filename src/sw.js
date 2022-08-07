import * as m from "./modules/messages";
import { injectFile, getActiveTab, injectFunc } from "./modules/swHelpers";
import * as ext from "./modules/extension";

let currentTab;

let functionMap = {
  [m.getExtensionInfo.response]: getExtensionInfo,
  [m.server.createRoom.response]: bcPostMessage,
  [m.server.joinRoom.response]: bcPostMessage,
  [m.server.destroy.response]: bcPostMessage,
  [m.injectContent.response]: injectContent,
  [m.initializeProxyIfNeeded.response]: initializeProxyIfNeeded,
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

function initializeProxyIfNeeded(message) {

  console.log('initalizeProxy if needed ran');

  let tabId = message.tabId;

  injectFunc(tabId, ext.getInfo, { tabId: tabId }, false).then(() => {
    injectFile(tabId, "proxy.js");
  });
}

// Helper functions

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

function onActivated(tabInfo) {
  initializeProxyIfNeeded(tabInfo);
}

function onUpdated(tabId, docInfo, tab) {
  if (tab.url !== undefined && docInfo.status == "complete") {
    initializeProxyIfNeeded({ tabId: tabId });
  }
}

// Binds event listeners

chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

console.log("Service Worker Running");

// TODO

// make destroy run on url change 

// connect socket when popup loads


