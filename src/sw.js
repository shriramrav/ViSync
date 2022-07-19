import * as m from './modules/messages';
import { scan } from './modules/video';
import * as server from './modules/server'
import { inject } from './modules/inject';

function getActiveId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ 
            active: true,
            lastFocusedWindow: true
        }, tabs => resolve(tabs[0].id));
    });
}

chrome.runtime.onMessage.addListener(async (request) => {
    let tab = await getActiveId();

    switch (request.message) {
        case m.video.runScript:
            await inject(tab, scan, [ m.video.status ]);
            break;

        case m.server.connect.runScript:
            await inject(tab, server.connect, [
                m.server.connect.status,
                {
                    server: m.servers[0],
                    errorMessage: m.server.events.errorMessage
                } 
            ]);

            break;
    }
});