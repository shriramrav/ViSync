export default function() {
    chrome.runtime.onMessage.addListener(async (request) => {
        console.log('message recieved');
        console.log(request);
    })
    console.log('test event listener loaded');
}