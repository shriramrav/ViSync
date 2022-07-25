import * as m from "./modules/messages";

let port = chrome.runtime.connect(m.connectInfo);

console.log(port);


function onMessageEventListener(message) {

    let caseTriggered = true;

    switch (message.request) {
        // case m.checkForVideoPlayer.request:
        //     message.data = checkForVideoPlayer();
        //     break;
        default:
            console.log('case not triggered, the following is the message:');
            console.log(message);
            caseTriggered = false;
    }

    if (caseTriggered) {
        port.postMessage(message);
    }
}


// Event listeners
port.onMessage.addListener(onMessageEventListener);


console.log('done');