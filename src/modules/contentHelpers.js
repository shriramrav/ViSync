function runAfterLoad(fn) {
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

export { runAfterLoad, isIframe };
