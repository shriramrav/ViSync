import {
	getInfo,
	proxyIsInitialized,
	updateInfo,
	removeInfo,
} from "./modules/extension";

import {
	proxy,
	injectContent,
	initializeProxyIfNeeded,
	server,
} from "./modules/messages";

import {
	getIframeFromSrc,
	iframesSetOnLoad,
	pollForDocumentReadyState,
	pollForHrefChange,
} from "./modules/documentHelpers";
import { rejectErrors } from "./modules/utility";
import { getRuntimeMessenger, getMessageEventHandler } from "./modules/getters";

let sources = [];
let channel;
let hrefPollingStarted = false;

const functionMap = {
	[proxy.bindSource.response]: bindSource,
	[proxy.updateExtInfo.response]: updateExtInfo,
	[server.createRoom.response]: sendMessageToSource,
	[server.joinRoom.response]: sendMessageToSource,
	// [server.connect.response]: sendMessageToSource,
	// [server.disconnectIfNeeded.response]: sendMessageToSource,
	[server.destroy.response]: destroy,
};

const scriptId = "proxy";
const tabId = getInfo({}, false).tabId;
const channelName = `visync-${tabId}`;
const href = document.location.href;
const sendChromeRuntimeMessage = getRuntimeMessenger(scriptId, tabId);
const onMessage = getMessageEventHandler(scriptId, functionMap);

function init() {
	channel = new BroadcastChannel(channelName);

	// Bind event listeners
	channel.onmessage = onMessage;
	window.addEventListener("message", onMessage);
	document.addEventListener("DOMNodeInserted", onDOMNodeInserted);

	updateInfo({ proxyIsInitialized: true });
	sendChromeRuntimeMessage(injectContent);
	iframesSetOnLoad(onLoad);
}

// Response functions

function bindSource(message) {
	sources.push({
		messagingWindow: message.isIframe
			? getIframeFromSrc(message.origin).contentWindow
			: window.self,
	});

	updateInfo({ page: "main" });

	if (!hrefPollingStarted) {
		pollForHrefChange(onHrefChange);
		hrefPollingStarted = true;
	}
}

function sendMessageToSource(message) {
	sources[0].messagingWindow.postMessage(message, "*");
}

function updateExtInfo(message) {
	updateInfo(message.newInfo);
}

function destroy(message) {
	window.removeEventListener("message", onMessage);
	document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
	channel.close();

	removeInfo();
	rejectErrors(() => sendMessageToSource(message));
	sendChromeRuntimeMessage(initializeProxyIfNeeded);
}

// Event listeners

function onDOMNodeInserted(event) {
	const reinjectNodes = ["IFRAME"];

	if (reinjectNodes.includes(event.target.nodeName)) {
		event.target.onload = onLoad;
	}
}

function onHrefChange() {
	if (href !== window.location.href) {
		console.log(href);
		console.log(window.location.href);
		console.log("href change happened");
		let message = server.destroy;
		message.scriptId = scriptId;
		destroy(message);
	}
}

function onLoad() {
	sendChromeRuntimeMessage(injectContent);
}

//Main

function main() {
	if (!proxyIsInitialized()) {
		init();
	}
}

// Start polling
pollForDocumentReadyState(main);
