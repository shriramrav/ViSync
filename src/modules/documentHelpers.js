function runAfterDocumentLoad(fn) {
  const delay = 50;
  const readyState = "complete";

  const interval = setInterval(() => {
    if (document.readyState === readyState) {
      clearInterval(interval);
      fn();
    }
  }, delay);
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

export { getIframeFromSrc, runAfterDocumentLoad, isIframe };
