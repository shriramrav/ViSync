import { getInfo, proxyIsInitialized, updateInfo } from "./modules/injected";
import { proxy, injectContent, server } from "./modules/messages";
import { runAfterLoad } from "./modules/contentHelpers";
import { getIframeFromSrc } from "./modules/proxyHelpers";

let sources = [];

const tabId = getInfo.apply({}, [, false]).tabId;
const channelName = `visync-${tabId}`;

let channel;

const functionMap = {
  [proxy.bindSource.response]: bindSource,
  [proxy.updateExtInfo.response]: updateExtInfo,
  [server.createRoom.response]: sendMessageToSource,
  [server.joinRoom.response]: sendMessageToSource,
  [server.destroy.response]: () => {},
};

console.log("proxy injected");

function init() {
  channel = new BroadcastChannel(channelName);

  // Bind event listeners
  channel.onmessage = onMessage;
  window.addEventListener("message", onMessage);
  document.addEventListener("DOMNodeInserted", onDOMNodeInserted);

  getInfo({ proxyIsInitialized: true }, false);
  chrome.runtime.sendMessage(injectContent);
}

// Response functions

function bindSource(message) {
  console.log("bindSource: ");
  console.log(message);

  const { isIframe, origin } = message;

  sources.push({
    messagingWindow: isIframe
      ? getIframeFromSrc(origin).contentWindow
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

// Event listeners

function onDOMNodeInserted(event) {
  let { target } = event;

  const reinjectNodes = ["IFRAME"];

  if (reinjectNodes.includes(target.nodeName)) {
    target.onload = function () {
      chrome.runtime.sendMessage(injectContent);
    };
  }
}

function onMessage(event) {
  let message = event.data;

  console.log("message recieved");
  console.log(message);

  if (message.from === "sw" || message.from === "content") {

    message.from = "proxy";

    functionMap[message.response](message);
  }
}

// change to runAfterDocumentLoad
runAfterLoad(() => {
  if (!proxyIsInitialized()) {
    init();
  }
});
