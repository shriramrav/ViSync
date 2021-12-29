// Handles server selection popup window
let serverWindow = null;

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

    serverWindow.onload = () => {
        serverWindow.document.querySelector('button').addEventListener('click', (e) => {
            console.log('yoooooooo');
        })
    }

    serverWindow.addEventListener('blur', (e) => {
        console.log('asldfkjasl;dkfj')
        serverWindow.close();
    })
 
})

window.onload = () => {
    console.log(document.getElementsByClassName('page'))
}

// document.addEventListener('click', (e) => {
//     console.log('asdlfkjasdlasdfasdfasdf');
    
//     let lp = document.getElementById('loading-page');

//     if (lp.classList.contains('show')) {
//         lp.classList.remove('show');
//         setTimeout(() => lp.classList.remove('shifted-up'), 100); // Ensures that the z-index is changed last

//     } else {
//         lp.classList.add('shifted-up')
//         lp.classList.add('show');
//     }

// })




// Video player loaded &#10004;
// Video not found &#10005;