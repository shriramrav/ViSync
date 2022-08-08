function getRuntimeMessenger(scriptId = undefined, tabId = undefined) {
  return function (message) {
    message.scriptId = scriptId;
    message.tabId = tabId;
    chrome.runtime.sendMessage(message);
  };
}

function getMessageEventHandler(scriptId, functionMap) {
  return function (event) {
    let message = event.data;
    if (message.scriptId !== undefined && message.scriptId !== scriptId) {
      // Copy object
      console.log("message recieved");
      console.log(message);

      let newMessage = JSON.parse(JSON.stringify(message));
      newMessage.scriptId = scriptId;

      functionMap[message.response](newMessage);
    }
  };
}

export { getRuntimeMessenger, getMessageEventHandler };
