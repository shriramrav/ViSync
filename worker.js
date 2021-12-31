import connect from './src/scripts/modules/connect.js';
import servers from './src/scripts/modules/servers.js';
import messages from './src/scripts/modules/messages.js';
import scan from './src/scripts/modules/scan.js';

function injectionPath(fileName) {
    return `./src/scripts/injections/${fileName}.js`;
}

function getActiveId() {
    return new Promise(resolve => {
        chrome.tabs.query({ 
            active: true,
            lastFocusedWindow: true
        }, tabs => {
            resolve(tabs[0].id);
        });
    });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === messages.video.locate) {
        getActiveId().then(tabId => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: scan,
                args: [messages.video.status]
            });
        });

    } else if (request.message === messages.server.connect) {
        getActiveId().then(tabId => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: connect,
                args: [servers[0], messages.server.status]
            });
        });
    }
});
