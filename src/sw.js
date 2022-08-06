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

function getExtensionInfo(message) {
  const { url, id } = currentTab;

  if (url.includes("https://")) {
    message.tabId = id;

    injectFunc(id, ext.getInfo, message);
  } else {
    message.data = {
      page: "failure",
    };

    chrome.runtime.sendMessage(message);
  }
}

function bcPostMessage(message) {
  const { id } = currentTab;

  injectFunc(id, ext.postMessage, message, id);
}

function injectContent(message) {
  injectFile(currentTab.id, "content.js", true);
}

function destroy(message) {
  console.log("recieved server destroy message");
}

// Binds event listeners

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

// make sure tabIds that are being used are from what was originally binded

// add destroyer and make sure to reset with url change

// rename to proxy and content helpers to document helpers documentHelpers

// fix variable names through proxy and content, and service worker

// for global variables, change to __x__ style name
