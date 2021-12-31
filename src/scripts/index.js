import messages from './modules/messages.js';

// Global variables
let serverWindow = null;
var loader = document.getElementById('loading-page');
var loaderLabel = document.getElementById('loading-label');


loaderLabel.update = (text=null, classAction=null, args=null) => { 
    loaderLabel.innerHTML = text == null ? loaderLabel.innerHTML : text;
    classAction != null ? classAction(loaderLabel, args) : null;
}

function addClasses(element, classList) {
    for (let i = 0; i < classList.length; i++) {
        element.classList.add(classList[i]);
    }
}

function removeClasses(element, classList) {
    for (let i = 0; i < classList.length; i++) {
        element.classList.remove(classList[i]);
    }
}

function wait(time, callback = () => {}) {
    return new Promise((resolve) => setTimeout(() => {
        callback();
        resolve();
    }, time));
}


// Handles server selection popup window
document.getElementById('server-icon').addEventListener('click', (e) => {
    const popupWidth = 275;
    const popupHeight = 350;
    const posX = window.top.outerWidth / 2 + window.top.screenX - ( popupWidth / 2);
    const posY = window.top.outerHeight / 2 + window.top.screenY - ( popupHeight / 2);

    serverWindow = window.open('./popup/popup.html', 'targetWindow', 
        `width=${popupWidth},
        height=${popupHeight},
        top=${posY},
        left=${posX}`
    );

    serverWindow.addEventListener('blur', serverWindow.close);
 
});


document.getElementById('create-btn').addEventListener('click', async () => {

//  Starting loader
    removeClasses(loader, ['hidden']);
    addClasses(loader, ['shifted-up', 'visible']);
    const waitTime =  200;
    const resetLoader = async () => {
        removeClasses(loader, ['visible']);
        addClasses(loader, ['hidden']);
        await wait(waitTime);
        removeClasses(loader, ['shifted-up']);
        loaderLabel.update('Locating video...', removeClasses, ['failure', 'success']);
    }

    checkVideoStatus().then(async data => {

        if (data) {
            loaderLabel.update('Video player loaded &#10004;', addClasses, ['success']);

            await wait(waitTime);

            loaderLabel.update('Connecting to server...', removeClasses, ['success']);
            checkConnectionStatus().then(async result => {
                if (result) {
                    loaderLabel.update('Connection successful &#10004;', addClasses, ['success']);
                    startRoom();
                } else {
                    loaderLabel.update('Failed to connect &#10005;', addClasses, ['failure']);
                    await wait(waitTime, resetLoader);
                }
            });

        } else {
            loaderLabel.update('Video not found &#10005;', addClasses, ['failure']);
            await wait(waitTime, resetLoader);
        }
    });
})


function checkVideoStatus() {
    let result = false;
    let onMessage = chrome.runtime.onMessage;
    const waitTime = 400;
    const checkVideoMessage = (event) => {
        if (event.message === messages.video.status) {
            result = event.data === 'true';
        }
    }

    chrome.runtime.sendMessage({ message: messages.video.locate });
    onMessage.addListener(checkVideoMessage);

    return new Promise(async (resolve) => {
        await wait(waitTime);
        onMessage.removeListener(checkVideoMessage);
        resolve(result);
    });
}

function checkConnectionStatus() {
    let connected = false;
    let retries = 40;
    let onMessage = chrome.runtime.onMessage;
    const waitTime = 500;
    const checkConnectionMessage = (event) => {
        if (event.message === messages.server.status) {
            connected = true;
        }
    }

    chrome.runtime.sendMessage({ message: messages.server.connect });
    onMessage.addListener(checkConnectionMessage);

    return new Promise((resolve) => {
        const loop = setInterval(() => {
            if (connected || retries < 1) {
                resolve(connected);
                onMessage.removeListener(checkConnectionMessage);
                clearInterval(loop);
            }
            retries--; 
        }, waitTime);
    });

}

function startRoom() {


}