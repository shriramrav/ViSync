export default function(message) {
    let retries = 2;
    const waitTime = 150;
    let videoExists = false;

    const loop = setInterval(() => {
        videoExists = document.querySelector('video') != null;
        if (videoExists || retries < 1) {
            clearInterval(loop);
            chrome.runtime.sendMessage({
                message: message,
                data: videoExists.toString()
            });
        }
        retries--;
    }, waitTime);
}