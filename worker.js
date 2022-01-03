import servers from './src/global/modules/literals/servers.js';
import messages from './src/global/modules/literals/messages.js';
import { scan } from './src/global/modules/video.js';
import * as server from './src/global/modules/server.js';
import * as key from './src/global/modules/key.js';
import { bind } from './src/global/modules/wrapper.js';

function getActiveId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ 
            active: true,
            lastFocusedWindow: true
        }, tabs => resolve(tabs[0].id));
    });
}

async function loadInjectionDependencies(activeTab) {
    await chrome.scripting.executeScript({
        target: { 
            tabId: activeTab 
        },
        func: bind
    });
}

chrome.runtime.onMessage.addListener(async (request) => {
    let activeTab = await getActiveId();

    loadInjectionDependencies(activeTab);

    switch (request.message) {
        case messages.video.runScript:
            console.log('yoooo');

            chrome.scripting.executeScript({
                target: { 
                    tabId: activeTab 
                },
                func: scan,
                args: [
                    messages.video.status, 
                    messages.video.types
                ]
            });
            break;

        case messages.server.connect.runScript:
            chrome.scripting.executeScript({
                target: { 
                    tabId: activeTab
                },
                func: server.connect,
                args: [{
                    server: servers[0],
                    message: messages.server.connect.status,
                    event: messages.server.events.connect,
                    id: key.random()
                }]
            });
            break;

        case messages.server.create.runScript: 
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTab
                },
                func: server.create,
                args: [{
                    key: key.random(),
                    message: messages.server.create.status,
                    event: messages.server.events.create
                }]
            });

            break;
        case messages.server.init.runScript:
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTab
                },
                func: server.init,
                args: [{
                    message: messages.server.init.status,
                    events: messages.server.events
                }]
            });

    }
});
