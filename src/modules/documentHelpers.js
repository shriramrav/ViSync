function startPolling(cond, cb, pollingRate = 50) {
	const interval = setInterval(() => {
		if (cond()) {
			clearInterval(interval);
			cb();
		}
	}, pollingRate);
}

function pollForDocumentReadyState(cb, pollingRate = 50) {
	startPolling(() => document.readyState === "complete", cb, pollingRate);
}

function pollForHrefChange(cb, pollingRate = 50) {
	const href = document.location.href;

	const interval = setInterval(() => {
		if (href !== window.location.href) {
			clearInterval(interval);
			cb();
		}
	}, pollingRate);
}

// Currently, only a depth of 1 is supported
function isIframe(currentWindow) {
	return currentWindow !== window.top;
}

function getIframeFromSrc(src) {
	const iframes = document.querySelectorAll("iframe");

	for (let i = 0; i < iframes.length; i++) {
		if (iframes[i].src === src) {
			return iframes[i];
		}
	}
}

function iframesSetOnLoad(fn) {
	const iframes = document.querySelectorAll("iframe");

	for (let i = 0; i < iframes.length; i++) {
		iframes[i].onload = fn;
	}
}

export {
	getIframeFromSrc,
	pollForDocumentReadyState,
	pollForHrefChange,
	isIframe,
	iframesSetOnLoad,
};
