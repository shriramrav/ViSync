export function connect(message, args) {
    window.ws = new WebSocket(`wss://${args.server}.glitch.me/`);
    ws.chromeMessage = message;

    function sendMessage(data = '', _message = ws.chromeMessage) {

        console.log('message has been recieved');

        chrome.runtime.sendMessage({ 
            message: _message,
            data: data
        });
    }

    ws.onopen = sendMessage;
    ws.onmessage = event => {
        console.log('onmessage event listenr');
        console.log(event);
        console.log(event.data);

        event.data.text().then(sendMessage);
        // console.log(event.data);
        // event.data.text().then(sendMessage)
    }; // .text() used to parse Blob
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


// Name should be changed
export function init(args) {
    // Video sync functionality attached to socket so it can be easily removed if needed
    ws.player = {
        // Add used vars here later
    };
    ws.chromeMessage = args.message;
    ws.player.prevTimeStamp = _('video').currentTime;
    

    ws.player.sendEvent = (event, data = '', key = args.key) => ws.sts({
        key: key,
        event: event,
        data: data
    });

    ws.player.pause = () => {
        _('video').pause();
        console.log('paused');
    }

    ws.player.play = () => {
        _('video').play();
        console.log('played');
    }

    ws.player.updateTime = timeStamp => {
        _('video').currentTime = timeStamp;
        console.log(`changed time to : ${timeStamp}`);
    }

    // Listeners
    ws.player.pauseListener = () => {
        console.log('pause');
        ws.player.sendEvent(args.events.pause);
    }

    ws.player.playListener = () => {
        console.log('playing');
        ws.player.sendEvent(args.events.play);
    }

    ws.player.timeUpdateListener = () => {
        const manualAdjGap = .5;

        if (Math.abs(_('video').currentTime - window.prevTimeStamp) > manualAdjGap) {
            // let timeStamp = _('video').currentTime;
            // window.prevTimeStamp = _('video').currentTime;


            // CAUTION: CONDITION UNTESTED
            ws.player.sendEvent(args.events.timeupdate, _('video').currentTime);
        }

        ws.player.prevTimeStamp = _('video').currentTime;
    }

    // Add listeners to video player
    _('video').on('pause', ws.player.pauseListener);
    _('video').on('play', ws.player.playListener);
    _('video').on('timeupdate', ws.player.timeUpdateListener);

    ws.onmessage = (event) => {
        event.data.text().then(result => {
            let obj = JSON.parse(result);
            ws.player[`${obj.event}`](obj.data);
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
