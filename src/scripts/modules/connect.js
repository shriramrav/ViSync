export default function(serverName) {

    let channel = new BroadcastChannel('check');

    channel.postMessage('yoo');

    let ws = new WebSocket(`wss://${serverName}.glitch.me/`);

    ws.onopen = () => {
        chrome.runtime.sendMessage({ message: 'yello' });
        console.log('connection successful');
    };

    window.__ws = ws;
}