import { io } from "socket.io-client";

console.log('injected');

// window.io = io;


// var test = io;

bc = new BroadcastChannel('yo');
bc.postMessage('hello');
