import { io } from "socket.io-client";
import { server } from "./modules/messages";
import { rejectErrors } from "./modules/utility";
import { sync } from "./modules/video";
import { removeInfo, updateInfo, getInfo } from "./modules/injected";

const url = "https://serve.visync.repl.co";
const tabId = getInfo.apply({}, [, false]).tabId;

console.log(`tabId`);
console.log(tabId);

const channelName = `visync-${tabId}`;

let channel = new BroadcastChannel(channelName);
let videoSync;

console.log(channelName);

let socket = io(url);

const functionMap = {
  [server.createRoom.response]: createRoom,
  [server.joinRoom.response]: joinRoom,
  [server.destroy.response]: destroy,
};

// Response functions

function createRoom(message) {
  socket.removeAllListeners("createRoom");
  socket.on("createRoom", (key) => responseHandler(message, key, key));

  if (socket.connected) {
    socket.emit("createRoom");
  } else {
    socket.on("connect", socket.emit("createRoom"));
  }
}

function joinRoom(message) {
  const { key } = message;

  socket.removeAllListeners("joinRoom");
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
    if (message.response != undefined) {
      removeInfo();
      channel.close();
    }
    socket.close();
    videoSync.destroy();
  });
}

// Helper functions

function responseHandler(message, key, data, eventSuccessful = true) {

  console.log('responseHandler ran');

  chrome.runtime.sendMessage(Object.assign(message, { data: data }));
  if (eventSuccessful) {
    updateInfo({ page: "connected", key: key });

    videoSync = sync(socket);
  }
}

// Event listeners

function onMessage(event) {
  let message = event.data;
  delete message.request;

  console.log("message recieved");

  // rejectErrors(() => functionMap[message.response](message));
  functionMap[message.response](message);
}

// Binds all event listeners
channel.onmessage = onMessage;
// socket.on('joinRoom', joinRoomHandler);

console.log("injected content");
