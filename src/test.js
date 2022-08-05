import { proxy, server } from "./modules/messages";
import { isIframe, runAfterLoad } from "./modules/contentHelpers";


const functionMap = {
  // [server.createRoom.response]: createRoom,
  // [server.joinRoom.response]: joinRoom,
  // [server.destroy.response]: destroy,
};

let messagingWindow;


function init() {
  if (document.querySelector("video") != null) {
    setUpSource();
  } else {
    document.addEventListener("DOMNodeInserted", onDOMNodeInserted);
  }

  window.injectedContent = true;
};

function setUpSource() {
  console.log('found frame with video');

  chrome.runtime.sendMessage('asdfasdfasdf');


  window.addEventListener('message', onMessage);

  let iframeCheck = isIframe(window.self);

  console.log(`isIframe: ${iframeCheck}`);

  messagingWindow = iframeCheck ? window.parent : window.self;

  messagingWindow.postMessage(Object.assign({
    isIframe: iframeCheck,
    origin: window.location.href
    // Add video size later
  }, proxy.bindSource), '*');
}

// Event listners;

function onDOMNodeInserted(e) {
  const { target } = e;

  if (target.nodeName === 'VIDEO') {
    setUpSource();
    document.removeEventListener("DOMNodeInserted", onDOMNodeInserted);
  }
}

function onMessage(message) {
  console.log('message');
}








// Can change to just if statement later
runAfterLoad(() => {
  if (!window.injectedContent) {
    init();
  }
});






// setTimeout(() => {
//   var highestTimeoutId = setTimeout(";");
//   for (var i = 0 ; i < highestTimeoutId ; i++) {
//       clearTimeout(i); 
//   }
//   // window._console = window.console;
//   // delete window.console;
// }, 5000);