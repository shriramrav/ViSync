import { io } from "socket.io-client";
import { proxy, server } from "./modules/messages";
// import { rejectErrors } from "./modules/utility";
import { sync } from "./modules/video";
import { isIframe, pollForDocumentReadyState } from "./modules/documentHelpers";
import { getRuntimeMessenger, getMessageEventHandler } from "./modules/getters";
import { generateRandomKey } from "./modules/keys";
import { rejectErrors } from "./modules/utility";

const functionMap = {
	[server.createRoom.response]: createRoom,
	[server.joinRoom.response]: joinRoom,
	[server.destroy.response]: destroy,
	[server.connect.response]: connect,
};

let messagingWindow;
let socket;
let videoSync;
let isConnected = false;
let disconnectionInterval;

// 30 seconds
const minTimeout = 30000;
const scriptId = `content-${generateRandomKey()}`;
const url = "https://serve.visync.repl.co";
const sendChromeRuntimeMessage = getRuntimeMessenger(scriptId);
const onMessage = getMessageEventHandler(scriptId, functionMap);

function init() {
	if (document.querySelector("video") != null) {
		setUpSource();
	} else {
		document.addEventListener("DOMNodeInserted", onDOMNodeInserted);
	}
}

// Response functions

function connect() {
	// console.log("inside content: connect ran");

	if (!isConnected) {
		if (socket === undefined) {
			socket = io(url);
			disconnectionInterval = diconnectOnInactivity();
		} else {
			clearInterval(disconnectionInterval);
			disconnectionInterval = diconnectOnInactivity();
		}
	}
}

function createRoom(message) {
	if (socket === undefined) {
		socket = io(url);
	}

	if (socket.connected) {
		socket.removeAllListeners("createRoom");
		socket.emit("createRoom");
	} else {
		socket.on("connect", () => socket.emit("createRoom"));
	}

	socket.on("createRoom", (key) => responseHandler(message, key, key));
}

function joinRoom(message) {
	if (socket === undefined) {
		socket = io(url);
	}

	if (socket.connected) {
		socket.removeAllListeners("joinRoom");
		socket.emit("joinRoom", message.key);
	} else {
		socket.on("connect", () => socket.emit("joinRoom", message.key));
	}

	socket.on("joinRoom", (result) => {
		responseHandler(message, message.key, result, result);
	});
}

function destroy() {
	// console.log("destroy ran");

	window.removeEventListener("message", onMessage);
	document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);

	delete window.__injected__content__;

	rejectErrors(() => {
		socket.close();
		videoSync.destroy();
	});
}

// Helper functions

function responseHandler(message, key, data, eventSuccessful = true) {
	// console.log("responseHandler ran");
	// console.log(message);

	message.data = data;
	sendChromeRuntimeMessage(message);

	if (eventSuccessful) {
		let proxyMessage = JSON.parse(JSON.stringify(proxy.updateExtInfo));

		proxyMessage.scriptId = scriptId;
		proxyMessage.newInfo = {
			page: "connected",
			key: key,
		};

		// console.log("proxyMessage:::");
		// console.log(proxyMessage);

		messagingWindow.postMessage(proxyMessage, "*");

		videoSync = sync(socket);
		isConnected = true;
	}
}

function diconnectOnInactivity() {
	return setTimeout(() => {
		if (!isConnected) {
			socket.disconnect();
			socket = undefined;
		}
	}, minTimeout);
}

function setUpSource() {
	console.log("found source with video");

	let message = proxy.bindSource;
	let iframeCheck = isIframe(window.self);

	messagingWindow = iframeCheck ? window.parent : window.self;

	message.scriptId = scriptId;
	message.isIframe = iframeCheck;
	message.origin = window.location.href;

	// console.log("inside setUpSource");
	// console.log(message);

	window.addEventListener("message", onMessage);
	messagingWindow.postMessage(message, "*");
}

// Event listners;

function onDOMNodeInserted(event) {
	if (event.target.nodeName === "VIDEO") {
		setUpSource();
		document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
	}
}

//Main

function main() {
	if (window.location.href !== "about:blank" && !window.__injected__content__) {
		window.__injected__content__ = true;
		init();
	}
}

// Start polling
pollForDocumentReadyState(main);
