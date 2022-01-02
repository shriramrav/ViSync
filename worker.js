import servers from './src/global-modules/literals/servers.js';
import messages from './src/global-modules/literals/messages.js';
import { scan } from './src/global-modules/video.js';
import { connect } from './src/global-modules/server.js';


function getActiveId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ 
            active: true,
            lastFocusedWindow: true
        }, tabs => resolve(tabs[0].id));
    });
}

chrome.runtime.onMessage.addListener(async (request) => {
    let activeTab = await getActiveId();

    switch (request.message) {
        case messages.video.runScript:
            chrome.scripting.executeScript({
                target: { 
                    tabId: activeTab 
                },
                func: scan,
                args: [messages.video.status]
            });
            break;

        case messages.server.runScript:
            chrome.scripting.executeScript({
                target: { 
                    tabId: activeTab
                },
                func: connect,
                args: [
                    servers[Math.floor(Math.random() * servers.length)], 
                    messages.server.status
                ]
            });
            break;

    }
});
