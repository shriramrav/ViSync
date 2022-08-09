import * as m from "./modules/messages";
import { injectFile, getActiveTab, injectFunc } from "./modules/swHelpers";
import * as storage from "./modules/storage";

let currentTab;
let scriptId = "sw";

let functionMap = {
	[m.getExtensionInfo.response]: getExtensionInfo,
	[m.server.createRoom.response]: bcPostMessage,
	[m.server.joinRoom.response]: bcPostMessage,
	[m.server.connect.response]: bcPostMessage,
	[m.server.destroy.response]: bcPostMessage,
	[m.injectContent.response]: injectContent,
	[m.initializeProxyIfNeeded.response]: initializeProxyIfNeeded,
};

// Response functions

async function getExtensionInfo(message) {
	message.tabId = currentTab.id;

	// console.log("inside getExtensionInfo");
	// console.log(message.tabId);

	const tab = await chrome.tabs.get(message.tabId);

	if (tab.url.includes("https://")) {
		injectFunc(message.tabId, storage.sendAsChromeRuntimeMessage, message);
	} else {
		message.data = {
			page: "failure",
		};

		chrome.runtime.sendMessage(message);
	}
}

function bcPostMessage(message) {
	injectFunc(
		message.tabId,
		(_message, _tabId) =>
			new BroadcastChannel(`visync-${_tabId}`).postMessage(_message),
		message,
		message.tabId
	);
}

function injectContent(message) {
	injectFile(message.tabId, "content.js", true);
}

function initializeProxyIfNeeded(message) {
	// console.log("initalizeProxy if needed ran");
	// console.log(message);

	let tabId = message.tabId;

	injectFunc(tabId, storage.init, { tabId: tabId }, false).then(() => {
		injectFile(tabId, "proxy.js");
	});
}

// Helper functions

// Event listener functions

async function onMessage(message) {
	if (
		message.request !== undefined ||
		(message.scriptId != undefined &&
			!message.scriptId.includes("content-") &&
			message.scriptId !== scriptId)
	) {
		// console.log("inside sw onmessage::");
		// console.log(message);

		// Change to get tabdata from message later
		currentTab = await getActiveTab();

		delete message.request;

		// Attach script id;
		message.scriptId = scriptId;

		functionMap[message.response](message);
	}
}

function onActivated(tabInfo) {
	initializeProxyIfNeeded(tabInfo);
}

function onUpdated(tabId, docInfo, tab) {
	if (tab.url !== undefined && docInfo.status == "complete") {
		initializeProxyIfNeeded({ tabId: tabId });
	}
}

// Binds event listeners

chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onActivated.addListener(onActivated);
chrome.tabs.onUpdated.addListener(onUpdated);

console.log("Service Worker Running");