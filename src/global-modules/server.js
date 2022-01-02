export function connect(server, message) {
    console.log('connection started');

    let ws = new WebSocket(`wss://${server}.glitch.me/`);
    ws.onopen = () => {
        console.log('connection success');
        chrome.runtime.sendMessage({ 
            message: message,
            data: server
        });
    };
    window.__ws = ws;
}

