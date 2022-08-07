import { io } from "socket.io-client";
import { proxy, server } from "./modules/messages";
import { rejectErrors } from "./modules/utility";
import { sync } from "./modules/video";
import { isIframe, runAfterDocumentLoad } from "./modules/documentHelpers";

const functionMap = {
  [server.createRoom.response]: createRoom,
  [server.joinRoom.response]: joinRoom,
  [server.destroy.response]: destroy,
};

const url = "https://serve.visync.repl.co";

let messagingWindow;
let socket;
let videoSync;

function init() {
  if (document.querySelector("video") != null) {
    setUpSource();
  } else {
    document.addEventListener("DOMNodeInserted", onDOMNodeInserted);
  }

  window.__injected__content__ = true;
}

// Response functions

function createRoom(message) {
  if (socket === undefined) {
    socket = io(url);
  }

  if (socket.connected) {
    socket.removeAllListeners("createRoom");
  }

  socket.on("createRoom", (key) => responseHandler(message, key, key));

  if (socket.connected) {
    socket.emit("createRoom");
  } else {
    socket.on("connect", () => socket.emit("createRoom"));
  }
}

function joinRoom(message) {
  if (socket === undefined) {
    socket = io(url);
  }

  if (socket.connected) {
    socket.removeAllListeners("joinRoom");
  }

  socket.on("joinRoom", (result) => {
    responseHandler(message, message.key, result, result);
  });

  if (socket.connected) {
    socket.emit("joinRoom", message.key);
  } else {
    socket.on("connect", () => socket.emit("joinRoom", message.key));
  }
}

function destroy() {
  console.log("destroy ran");

  window.removeEventListener("message", onMessage);
  document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
  
  delete window.__injected__content__;
  
  socket.close();
  videoSync.destroy();
}

// Helper functions

function responseHandler(message, key, data, eventSuccessful = true) {
  console.log("responseHandler ran");

  message.data = data;

  chrome.runtime.sendMessage(message);
  if (eventSuccessful) {
    let proxyMessage = proxy.updateExtInfo;

    proxyMessage.from = "content";
    proxyMessage.newInfo = {
      page: "connected",
      key: key,
    };

    messagingWindow.postMessage(proxyMessage, "*");

    videoSync = sync(socket);
  }
}

function setUpSource() {
  console.log("found frame with video");

  window.addEventListener("message", onMessage);

  let iframeCheck = isIframe(window.self);

  messagingWindow = iframeCheck ? window.parent : window.self;

  let message = proxy.bindSource;

  message.from = "content";
  message.isIframe = iframeCheck;
  message.origin = window.location.href;

  messagingWindow.postMessage(message, "*");
}

// Event listners;

function onDOMNodeInserted(event) {
  if (event.target.nodeName === "VIDEO") {
    setUpSource();
    document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
  }
}

function onMessage(event) {
  let message = event.data;
  delete message.request;

  console.log("message recieved");

  if (message.from === "proxy") {
    functionMap[message.response](message);
  }
}

runAfterDocumentLoad(() => {

  console.log('content script injected');
  console.log(window.location.href);
  console.log('injected')

  if (!window.__injected__content__) {
    init();
  }
});
