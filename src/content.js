import { io } from "socket.io-client";
import { proxy, server } from "./modules/messages";
import { rejectErrors } from "./modules/utility";
import { sync } from "./modules/video";
// import { removeInfo, updateInfo } from "./modules/injected";
import { isIframe, runAfterLoad } from "./modules/contentHelpers";

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

  window.injectedContent = true;
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
  // if (!socket) socket = io(url);

  const { key } = message;

  if (socket === undefined) {
    socket = io(url);
  }

  if (socket.connected) {
    socket.removeAllListeners("joinRoom");
  }

  socket.on("joinRoom", (result) => {
    responseHandler(message, key, result, result);
  });

  if (socket.connected) {
    socket.emit("joinRoom", message.key);
  } else {
    socket.on("connect", () => socket.emit("joinRoom", message.key));
  }
}

function destroy(message) {
  console.log("destroy ran");

  rejectErrors(() => {
    // if (message.response != undefined) {
    //   removeInfo();
    //   channel.close();
    // }
    // socket.close();
    // videoSync.destroy();
  });
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

function onDOMNodeInserted(e) {
  const { target } = e;

  if (target.nodeName === "VIDEO") {
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

// Can change to just if statement later
runAfterLoad(() => {
  if (!window.injectedContent) {
    init();
  }
});
