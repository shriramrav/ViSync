import * as storage from "./modules/storage";

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
	[server.connect.response]: sendMessageToSource,
	[server.destroy.response]: destroy,
};

const scriptId = "proxy";
const tabId = storage.get("tabId");
const channelName = `visync-${tabId}`;
const href = document.location.href;
const sendChromeRuntimeMessage = getRuntimeMessenger(scriptId, tabId);
const onMessage = getMessageEventHandler(scriptId, functionMap);

function init() {
	// console.log("proxy init running");
	// console.log(tabId);

	channel = new BroadcastChannel(channelName);

	// Bind event listeners
	channel.onmessage = onMessage;
	window.addEventListener("message", onMessage);
	document.addEventListener("DOMNodeInserted", onDOMNodeInserted);

	storage.update({ proxyIsInitialized: true });
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

	// console.log("bindSOurce ran");
	// console.log(message);

	storage.update({ page: "main" });

	if (!hrefPollingStarted) {
		pollForHrefChange(onHrefChange);
		hrefPollingStarted = true;
	}
}

function sendMessageToSource(message) {
	sources[0].messagingWindow.postMessage(message, "*");
}

function updateExtInfo(message) {
	// console.log("inside updateInfo:");
	// console.log(message);

	storage.update(message.newInfo);
}

function destroy(message) {
	delete window.__injected_proxy__;

	window.removeEventListener("message", onMessage);
	document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
	channel.close();
	storage.remove("page");

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
		// console.log(href);
		// console.log(window.location.href);
		// console.log("href change happened");
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
	if (window.__injected_proxy__ === undefined) {
		window.__injected_proxy__ = true;
		init();
		console.log('New Proxy Script Running');
	}
}

// Start polling
pollForDocumentReadyState(main);
