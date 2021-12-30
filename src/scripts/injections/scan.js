(function (callback) {

    let ctr = 0;
    const MAX = 2;
    const INTERVAL = 150;

    const loop = setInterval(() => {


        // console.log('asdfasdfasd');

        if (document.querySelector('video') != null || ctr == MAX) {
            clearInterval(loop);
            callback();
        }
        ctr++;
    }, INTERVAL);

})(() => {

    chrome.storage.local.set({ 
        foundVideo: document.querySelector('video') != null
    }).catch(err => console.log(err));

});

