function init(obj) {
	if (window.__visync_info__ === undefined) {
		window.__visync_info__ = {
			page: document.querySelector("video") !== null ? "main" : "failure",
		};
		Object.assign(window.__visync_info__, obj);
	}
}

function get(key) {
	return window.__visync_info__[key];
}

function getAll() {
	return window.__visync_info__;
}

function remove(key) {
	delete window.__visync_info__[key];
}

function removeAll() {
	delete window.__visync_info__;
}

const update = (obj) => {
	// console.log("info is being updated");
	// console.log(window.__visync_info__);
	Object.assign(window.__visync_info__, obj);
};

const sendAsChromeRuntimeMessage = (message) => {
	// console.log("sendAsChromeRuntimeMessage ran");
	// console.log(message);

	message.data = window.__visync_info__;
	chrome.runtime.sendMessage(message);
};

const isInitialized = () => window.__visync_info__ !== undefined;

export {
	init,
	get,
	getAll,
	update, 
	remove,
	removeAll,
	sendAsChromeRuntimeMessage,
	isInitialized
};
