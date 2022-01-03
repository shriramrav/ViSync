export function connect(args) {
    console.log('connection started');

    let ws = new WebSocket(`wss://${args.server}.glitch.me/`);
    ws.onopen = () => {
        console.log('connection success');

        ws.onmessage = (event) => {
            console.log('event rann');
            // Parse data
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
            data: args.id
        }));

        window.__ws = ws;
    };

}

export function create(args) {
    window.__ws.onmessage = (event) => {
        console.log('event rann');
        // .text() used to parse data
        event.data.text().then(result => {
            
            console.log('create result:');
            console.log(result);
            chrome.runtime.sendMessage({ 
                message: args.message,
                data: result
            });
        });
    }

    window.__ws.send(JSON.stringify({
        key: args.key,
        event: args.event,
        data: ''
    }));
}

export function init(args) {
    window.prevTimeStamp = 0;

    window.runSocketEvent = (event, key = args.key, data = '') => {
        window.__ws.send(JSON.stringify({
            key: key,
            event: event,
            data: data
        }));
    };

    window.__onpause = function() {
        _('video').pause();
    }

    window.__onplay = function() {
        _('video').play();
    }

    window.__ontimeupdate = function(timeStamp) {
        _('video').currentTime = timeStamp;
    }


    _('video').on('pause', e => {
        console.log(window.__ws);
        console.log(__ws);
        // console.log(e);
        // window.runSocketEvent(args.events.paused);
    });

    _('video').on('timeupdate', () => {
        const manualAdjGap = .5;

        // console.log(document.querySelector('video'))

        if (Math.abs(_('video').currentTime - window.prevTimeStamp) > manualAdjGap) {
            console.log('mannually adjusted');
        }

        window.prevTimeStamp = _('video').currentTime;
    });

    _('video').on('play', () => {
        console.log('playing');
        // console.log(e);
    });

    // document.addEventListener('waiting', e => {
    //     console.log('waiting');
    //     console.log(e);
    // });

    chrome.runtime.sendMessage({ 
        message: args.message,
        data: 'yoooo'
    });
}