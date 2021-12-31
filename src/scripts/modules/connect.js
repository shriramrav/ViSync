export default function(server, message) {
    let ws = new WebSocket(`wss://${server}.glitch.me/`);
    ws.onopen = () => chrome.runtime.sendMessage({ message: message });
    window.__ws = ws;
}