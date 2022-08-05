import { getInfo, proxyIsInitialized, updateInfo } from "./modules/injected";
import { proxy, injectContentNew } from "./modules/messages";
import { runAfterLoad } from "./modules/contentHelpers";
import { getIframeFromSrc } from "./modules/proxyHelpers";

let sources = [];

const tabId = getInfo.apply({}, [, false]).tabId;
const channelName = `visync-${tabId}`;

let channel;

const functionMap = {
  [proxy.bindSource.response]: bindSource,
};

console.log("proxy injected");

function init() {
  channel = new BroadcastChannel(channelName);

  // Bind event listeners
  channel.onmessage = onMessage;
  window.addEventListener("message", onMessage);
  document.addEventListener("DOMNodeInserted", onDOMNodeInserted);

  getInfo({ proxyIsInitialized: true }, false);
  chrome.runtime.sendMessage(injectContentNew);
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

// Event listeners

function onDOMNodeInserted(e) {
  let { target } = e;

  const reinjectNodes = ["IFRAME"];

  if (reinjectNodes.includes(target.nodeName)) {
    target.onload = function () {
      chrome.runtime.sendMessage(injectContentNew);
    };
  }
}

function onMessage(event) {
  let message = event.data;
  if (message.request !== undefined) {
    delete message.request;

    console.log("message recieved");

    // rejectErrors(() => functionMap[message.response](message));
    functionMap[message.response](message);
  }
}

// change to runAfterDocumentLoad
runAfterLoad(() => {
  if (!proxyIsInitialized()) {
    init();
  }
});
