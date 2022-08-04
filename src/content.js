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

function createRoomSuccess(message) {
  chrome.runtime.sendMessage(Object.assign(message, { data: socket.id }));

  updateInfo({ page: "connected", key: socket.id });

  console.log(`socket connected: ${socket.connected}`);

  console.log(" videoSync about to run");

  videoSync = sync(socket);
}

function createRoom(message) {
  // console.log(socket._callbacks);
  // console.log(socket._callbacks["$joinRoom"]);

  // socket.removeAllListeners("joinRoom");
  // console.log(socket._callbacks['$joinRoom']);

  if (socket.connected) {

    createRoomSuccess(message);
  } else {
    socket.on("connect", () => createRoomSuccess(message));
  }

  // socket.on("connect", () => {
  //   chrome.runtime.sendMessage(Object.assign(message, { data: socket.id }));

  //   updateInfo({ page: "connected", key: socket.id });

  //   console.log(`socket connected: ${socket.connected}`);

  //   console.log(" videoSync about to run");

  //   videoSync = sync(socket);
  // });

  // socket.on("disconnect", destroy);
}

function joinRoom(message) {
  console.log(message);

  socket.removeAllListeners("joinRoom");

  // Resets handler for new message obj
  socket.on("joinRoom", (result) => {
    console.log("joinRoom recieved");
    console.log(message.key);
    console.log(result);

    chrome.runtime.sendMessage(Object.assign(message, { data: result }));
    if (result) {
      updateInfo({ page: "connected", key: message.key });

      videoSync = sync(socket);
    }
  });

  if (socket.connected) {
    socket.emit("joinRoom", message.key);
  } else {
    socket.on("connect", () => socket.emit("joinRoom", message.key));
  }

  // if (socket == undefined) {
  //   console.log("socket undefined ran");

  //   socket = io(url);

  //   socket.on("connect", () => socket.emit("joinRoom", message.key));
  //   socket.on("joinRoom", (result) => {
  //     console.log("joinRoom recieved");
  //     console.log(result);
  //     chrome.runtime.sendMessage(Object.assign(message, { data: result }));
  //     if (result) {
  //       updateInfo({ page: "connected", key: message.key });

  //       videoSync = sync(socket);
  //     }
  //   });
  //   socket.on("disconnect", destroy);
  // } else {
  //   socket.emit("joinRoom", message.key);
  // }
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

// Event listeners

function onMessage(event) {
  let message = event.data;
  delete message.request;

  console.log("message recieved");

  rejectErrors(() => functionMap[message.response](message));
}

// Binds all event listeners
channel.onmessage = onMessage;
// socket.on('joinRoom', joinRoomHandler);

console.log("injected content");
