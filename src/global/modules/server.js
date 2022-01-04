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
    ws.onmessage = event => event.data.text().then(sendMessage); // .text() used to parse Blob
    ws.onerror = () => sendMessage(args.errorMessage);

    //Helper functions
    ws.sts = (obj) => ws.send(JSON.stringify(obj)); // Serializes then sends
    ws.sendMessage = sendMessage; // Binds messenger for future use
}

export function registerUser(message, args) {
    ws.chromeMessage = message;
    ws.sts(args);
}


export function init(args) {
    window.prevTimeStamp = _('video').currentTime;

    window.runSocketEvent = (event, data = '', key = args.key) => {
        ws.send(JSON.stringify({
            key: key,
            event: event,
            data: data
        }));
    };

    ws.onmessage = (event) => {
        event.data.text().then(result => {
            let obj = JSON.parse(result);
            window[`__on${obj.event}`](obj.data);
        });
    }

    window.__eventVars = {
        playState: false,
        timeUpdated: false
    }

    window.__onpause = function() {

        _('video').pause();
        console.log('paused');

    }

    window.__onplay = function() {
        _('video').play();
        console.log('played');
    }

    window.__ontimeupdate = function(timeStamp) {
        window.__eventVars.timeUpdated = true;
        _('video').currentTime = timeStamp;
        console.log(`changed time to : ${timeStamp}`);

        setTimeout(() => window.__eventVars.timeUpdated = false, 60);
    }


    _('video').on('pause', e => {
        if (!window.__eventVars.timeUpdated) {
            console.log('pause');

            window.runSocketEvent(args.events.pause);
        }
    });

    _('video').on('play', () => {
        if (!window.__eventVars.timeUpdated) {
            console.log('playing');
            window.runSocketEvent(args.events.play);
        }
    });


    _('video').on('timeupdate', () => {
        const manualAdjGap = .5;

        if (Math.abs(_('video').currentTime - window.prevTimeStamp) > manualAdjGap) {
            // let timeStamp = _('video').currentTime;
            // window.prevTimeStamp = _('video').currentTime;


            // CAUTION: CONDITION UNTESTED
            if (window.__eventVars.timeUpdated = true) {
                window.runSocketEvent(args.events.timeupdate, _('video').currentTime);
            }
        }

        window.prevTimeStamp = _('video').currentTime;
    });


    chrome.runtime.sendMessage({ 
        message: args.message,
        data: 'afsddfsdasdffasdsfadsdf'
    });
}