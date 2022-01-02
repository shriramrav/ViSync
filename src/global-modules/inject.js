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