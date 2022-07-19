export function connect(message, args) {
  window.ws = new WebSocket(`wss://${args.server}.glitch.me/`);

  ws.onopen = () => chrome.runtime.sendMessage({ data: "", message: message });

  ws.onmessage = (event) =>
    event.data.text().then((text) => {
      chrome.runtime.sendMessage({ data: text, message: message });
    });

  ws.onerror = () =>
    chrome.runtime.sendMessage({ data: args.errorMessage, message: message });
}
