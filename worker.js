import connect from './src/scripts/modules/connect.js';
import servers from './src/scripts/modules/servers.js';


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
    if (request.message === 'check video') {

        getActiveId().then(tabId => {
            chrome.scripting.executeScript({
                target: {tabId: tabId },
                files: [injectionPath('scan')]
            });
        });

    } else if (request.message === 'check connection') {
        
        getActiveId().then(tabId => {
            chrome.scripting.executeScript({
                target: {tabId: tabId },
                func: connect,
                args: [servers[0]]
            });
        });
    }
});
