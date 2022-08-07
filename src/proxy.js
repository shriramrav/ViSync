import { getInfo, proxyIsInitialized, updateInfo, removeInfo } from "./modules/extension";
import { proxy, injectContent, initializeProxyIfNeeded, server } from "./modules/messages";
import {
  getIframeFromSrc,
  runAfterDocumentLoad,
} from "./modules/documentHelpers";

let sources = [];

const tabId = getInfo({}, false).tabId;
const channelName = `visync-${tabId}`;

let channel;

const functionMap = {
  [proxy.bindSource.response]: bindSource,
  [proxy.updateExtInfo.response]: updateExtInfo,
  [server.createRoom.response]: sendMessageToSource,
  [server.joinRoom.response]: sendMessageToSource,
  [server.destroy.response]: destroy,
};

function init() {
  channel = new BroadcastChannel(channelName);

  // Bind event listeners
  channel.onmessage = onMessage;
  window.addEventListener("message", onMessage);
  document.addEventListener("DOMNodeInserted", onDOMNodeInserted);

  updateInfo({ proxyIsInitialized: true });

  let message = injectContent;

  message.tabId = tabId;

  chrome.runtime.sendMessage(injectContent);
}

// Response functions

function bindSource(message) {
  sources.push({
    messagingWindow: message.isIframe
      ? getIframeFromSrc(message.origin).contentWindow
      : window.self,
  });

  updateInfo({ page: "main" });

  console.log(sources);
}

function sendMessageToSource(message) {
  console.log("sendMessageToSource started");

  sources[0].messagingWindow.postMessage(message, "*");
}

function updateExtInfo(message) {
  updateInfo(message.newInfo);
}

function destroy(message) {
  removeInfo();
  window.removeEventListener("message", onMessage);
  document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
  channel.close();
  sendMessageToSource(message);
  

  message = initializeProxyIfNeeded;
  message.tabId = tabId;

  chrome.runtime.sendMessage(message);
}


// Event listeners

function onDOMNodeInserted(event) {
  const reinjectNodes = ["IFRAME"];

  if (reinjectNodes.includes(event.target.nodeName)) {
    event.target.onload = function () {
      let message = injectContent;

      message.tabId = tabId;

      chrome.runtime.sendMessage(injectContent);
    };
  }
}

function onMessage(event) {
  let message = event.data;

  if (message.from === "sw" || message.from === "content") {
    message.from = "proxy";

    functionMap[message.response](message);
  }
}

runAfterDocumentLoad(() => {
  if (!proxyIsInitialized()) {

    console.log('proxy wasnt initialized');

    init();
  }
});

console.log("Proxy Script Running");