
// Global variables
let serverWindow = null;
var loader = document.getElementById('loading-page');
var loaderLabel = document.getElementById('loading-label');

// Prototypes
Object.prototype.get = (key, obj) =>  {
    for (const [_key, _value] of Object.entries(obj)) {
        if (key === _key) {
            return _value;
        }
    } 
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



// Handles server selection popup window
document.getElementById('server-icon').addEventListener('click', (e) => {
    console.log('clicked');

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

    serverWindow.addEventListener('blur', () => serverWindow.close());
 
});


document.getElementById('create-btn').addEventListener('click', () => {

//  Starting loader
    removeClasses(loader, ['hidden']);
    addClasses(loader, ['shifted-up', 'visible']);


    checkVideoStatus().then(data => {
        if (data) {
            loaderLabel.innerHTML = 'Video player loaded &#10004;';
            addClasses(loaderLabel, ['success']);

            setTimeout(() => {
                loaderLabel.innerHTML = 'Connecting to server...';
                removeClasses(loaderLabel, ['success']);
                checkConnectionStatus();
            }, 50);
        } else {
            loaderLabel.innerHTML = 'Video not found &#10005;';
            addClasses(loaderLabel, ['failure']);

            setTimeout(() => {
                loaderLabel.innerHTML = 'Connecting to server...';
                removeClasses(loaderLabel, ['success']);
                checkConnectionStatus();
            }, 50);
        }
    });
})


function checkVideoStatus() {
    const waitingTime = 400;
    const keyName = 'foundVideo';
    const msg = 'check video';

    console.log('checking for video');
    chrome.runtime.sendMessage({ message: msg });

    return new Promise((resolve, reject) => setTimeout(() => {
        chrome.storage.local.get(keyName).then((data) => {
            resolve(Object.get(keyName, data));
        }).catch(err => reject(err));
    }, waitingTime));
}


function checkConnectionStatus() {
    chrome.runtime.sendMessage({ message: 'check connection'});


}
