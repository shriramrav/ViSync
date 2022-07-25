function requestResponseSendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message);

    const listener = (event) => {
      if (event.response === message.response) {
        chrome.runtime.onMessage.removeListener(listener);
        resolve(event.data);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
  });
}

function requestResponsePort(port, message) {
  return new Promise((resolve) => {
    port.postMessage(message);

    const listener = (event) => {
      if (event.response === message.response) {
        port.onMessage.removeListener(listener);
        resolve(event.data);
      }
    };

    port.onMessage.addListener(listener);
  });
}

export { requestResponseSendMessage, requestResponsePort };
