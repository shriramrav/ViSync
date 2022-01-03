import servers from './src/global/modules/literals/servers.js';
import m from './src/global/modules/literals/messages.js';
import { scan } from './src/global/modules/video.js';
import * as server from './src/global/modules/server.js';
import * as key from './src/global/modules/key.js';
import { getCache } from './src/global/modules/cache.js';
import { bind } from './src/global/modules/wrapper.js';

function getActiveId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ 
            active: true,
            lastFocusedWindow: true
        }, tabs => resolve(tabs[0].id));
    });
}

function inject(tab, func, args = []) {
    return new Promise(
        resolve => chrome.scripting.executeScript({
            target: { 
                tabId: tab 
            },
            func: func,
            args: args
        }, resolve)
    );
}


chrome.runtime.onMessage.addListener(async (request) => {
    let tab = await getActiveId();

    // Loads injection dependencies
    [bind].forEach(async func => await inject(tab, func));

    switch (request.message) {
        case m.video.runScript:
            await inject(tab, scan, [
                m.video.status, 
                m.video.types
            ]);
            break;

        case m.server.connect.runScript:
            await inject(tab, server.connect, [{
                server: servers[0],
                message: m.server.connect.status,
                event: m.server.events.connect,
                id: key.random()
            }]);
            break;

        case m.server.create.runScript: 
            await inject(tab, server.create, [{
                key: await getCache(m.caches.id),
                message: m.server.create.status,
                event: m.server.events.create
            }]);
            break;
        case m.server.init.runScript:
            await inject(tab, server.init, [{
                key: await getCache(m.caches.key),
                message: m.server.init.status,
                events: m.video.events,
            }]);
            break;
    }
});
