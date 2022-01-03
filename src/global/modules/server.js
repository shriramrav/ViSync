export function connect(args) {
    console.log('connection started');

    let ws = new WebSocket(`wss://${args.server}.glitch.me/`);
    ws.onopen = () => {
        console.log('connection success');
        
        ws.onmessage = (event) => {
            event.data.text().then(result => {
                console.log(result);
                chrome.runtime.sendMessage({ 
                    message: args.message,
                    data: result
                });
            });
        }

        ws.send(JSON.stringify({
            key: '',
            event: args.event,
            data: {
                server: args.server,
                id: args.id
            }
        }));

        window.__ws = ws;
    };

}

export function create(args) {
    window.__ws.onmessage = (event) => {
        event.data.text().then(result => { // .text() used to parse Blob
            chrome.runtime.sendMessage({ 
                message: args.message,
                data: result
            });
        });
    }

    // Note: data is not used
    window.__ws.send(JSON.stringify({
        key: args.key,
        event: args.event,
        data: '' 
    }));
}

export function init(args) {
    window.prevTimeStamp = _('video').currentTime;

    window.runSocketEvent = (event, data = '', key = args.key) => {
        window.__ws.send(JSON.stringify({
            key: key,
            event: event,
            data: data
        }));
    };

    window.__ws.onmessage = (event) => {
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