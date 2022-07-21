export function connect(message, args) {
  window.ws = new WebSocket(`wss://${args.server}.glitch.me/`);

  // Utility functions to make sure chrome messages are being sent
  //  only once server message is recieved
  ws.chromeMessage = message;
  ws.setDefaultChromeMessage = (message) => (ws.chromeMessage = message);

  let sendChromeMessage = (data = "", message = ws.chromeMessage) =>
    chrome.runtime.sendMessage({ data: data, message: message });

  ws.onopen = sendChromeMessage;

  // Parses blob recieved from server
  ws.onmessage = (event) => event.data.text().then((_event) => {
    console.log(`This is the event: ${_event}`);
    sendChromeMessage(_event);
  });
  ws.onerror = () => sendChromeMessage(args.errorMessage);
}

export function registerUser(message, args) {

  ws.setDefaultChromeMessage(message);

  console.log("from here" + ws.chromeMessage);

  ws.send(JSON.stringify(args));
}
