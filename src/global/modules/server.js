export function connect(message, args) {
    window.ws = new WebSocket(`wss://${args.server}.glitch.me/`);
    ws.chromeMessage = message;

    function sendMessage(data = '', _message = ws.chromeMessage) {
        chrome.runtime.sendMessage({ 
            message: _message,
            data: data
        });
    }

    ws.onopen = sendMessage;
    ws.onmessage = event => event.data.text().then(sendMessage);
    ws.onerror = () => sendMessage(args.errorMessage);

    //Helper functions
    ws.sts = obj => ws.send(JSON.stringify(obj)); // Serializes then sends
    ws.deserialize = event => new Promise(
        resolve => event.data.text().then(resolve(JSON.parse(result)))
    );
    ws.sendMessage = sendMessage; // Binds messenger for future use
}

export function registerUser(message, args) {
    ws.chromeMessage = message;
    ws.sts(args);
}


export function sync(args) {
    ws.chromeMessage = args.message;
    // Video sync functionality attached to socket so it can be easily removed if needed
    ws.player = {
        prevTimeStamp: _('video').currentTime,
        currentTime: Date.now(),
        consecutiveEventCount: 0,
        minManualAdjGap: 0.5
    };

    ws.player.sendEvent = (event, data = '', key = args.key, id = args.id) => ws.sts({
        key: key,
        event: event,
        data: data,
        id: id
    });

    ws.player.pause = () => _('video').pause();

    ws.player.play = () => _('video').play();

    ws.player.updateTime = timeStamp => {
        ws.player.prevTimeStamp = timeStamp;
        _('video').currentTime = timeStamp;
    }

    // Listeners
    ws.player.pauseListener = () => ws.player.sendEvent(args.events.pause);

    ws.player.playListener = () => ws.player.sendEvent(args.events.play);

    ws.player.timeUpdateListener = () => {
        if (Math.abs(_('video').currentTime - ws.player.prevTimeStamp) > ws.player.minManualAdjGap) {
            ws.player.sendEvent(args.events.timeUpdate, _('video').currentTime);
        }

        ws.player.prevTimeStamp = _('video').currentTime;
    }

    // Add listeners to video player
    _('video').on('pause', ws.player.pauseListener);
    _('video').on('play', ws.player.playListener);
    _('video').on('timeupdate', ws.player.timeUpdateListener);

    ws.onmessage = (event) => {

        // Prevent infinite socket messaging glitch
        const minEventInterval = 100;

        event.data.text().then(result => {
            let obj = JSON.parse(result);
            if (obj.id !== args.id) {
                if (Date.now() - ws.player.currentTime < minEventInterval) {
                    ws.player.consecutiveEventCount++;
                } else {
                    ws.player.consecutiveEventCount = 0;
                }

                if (ws.player.consecutiveEventCount <= 1) {
                    ws.player[`${obj.event}`](obj.data);
                    ws.player.currentTime = Date.now();
                }
            }
        });
    }

    ws.sendMessage();
}

export function destroy(message) {
    try {
        _('video').off('pause', ws.player.pauseListener);
        _('video').off('play', ws.player.playListener);
        _('video').off('timeupdate', ws.player.timeUpdateListener);
    } finally {
        ws.chromeMessage = message;
        ws.sendMessage();
        ws.close();
        ws = null;
    }
}
