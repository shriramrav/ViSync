// Method to help communicate between service worker, injected scripts, and popup
function requestResponse(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      message: message.runScript,
    });

    const eventListener = (event) => {
      if (event.message === message.status) {
        chrome.runtime.onMessage.removeListener(eventListener);
        resolve(event.data);
      }
    };

    chrome.runtime.onMessage.addListener(eventListener);
  });
}

export { requestResponse };
