import m from './src/global/modules/literals/messages.js';
import { scan } from './src/global/modules/video.js';
import * as server from './src/global/modules/server.js';
import * as key from './src/global/modules/key.js';
import { getCache } from './src/global/modules/cache.js';
import { bind } from './src/global/modules/wrapper.js';
import { inject } from './src/global/modules/inject.js';

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

    // Loads injection dependencies
    [ bind ].forEach(async func => await inject(tab, func));

    switch (request.message) {
        case m.video.runScript:
            await inject(tab, scan, [ m.video.status ]);
            break;

        case m.server.connect.runScript:
            await inject(tab, server.connect, [
                m.server.connect.status,
                {
                    server: await getCache(m.caches.server),
                    errorMessage: m.server.events.errorMessage
                } 
            ]);

            break;
        case m.server.registerUser.runScript: 
            await inject(tab, server.registerUser, [
                m.server.registerUser.status,
                {
                    // If error, server sets data property to error message
                    key: await getCache(m.caches.key),
                    event: m.server.events.registerUser,
                    id: await getCache(m.caches.id),
                    data: ''
                }
            ]);
            break;
        case m.server.init.runScript:
            await inject(tab, server.init, [{
                key: await getCache(m.caches.key),
                message: m.server.init.status,
                events: m.video.events,
            }]);
            break;
        case m.server.destroy.runScript: 
            await inject(tab, server.destroy, [ m.server.destroy.status ]);
            break;
    }
});