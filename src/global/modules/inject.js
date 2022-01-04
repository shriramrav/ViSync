// Injection from popup
export default function(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            message: message.runScript
        });

        const eventListener = (event) => {
            if (event.message === message.status) {
                chrome.runtime.onMessage.removeListener(eventListener);
                resolve(event.data);
            }
        }
        
        chrome.runtime.onMessage.addListener(eventListener);
    });

}

// Service worker injection 
// Note: args should maintain [message, obj] form
export function inject(tab, func, args = []) {
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