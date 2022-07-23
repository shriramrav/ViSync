import * as m from "./modules/messages";
import { scan } from "./modules/video";
import { getActiveId, inject } from "./modules/utility";
import testFunc from "./modules/test1";
import temp1 from "./modules/temp1";
// Store injected tab in activeExtensionTabs

console.log("hello");
let activeExtensionTabs = null;

chrome.tabs.onUpdated.addListener((tabId) => {
  if (activeExtensionTabs === tabId) {
    activeExtensionTabs = null;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeExtensionTabs === tabId) {
    activeExtensionTabs = null;
  }
});

// change request name to event
chrome.runtime.onMessage.addListener(async (request) => {



  let tab = await getActiveId();

  await inject(tab, temp1, [m]);


  // chrome.scripting.executeScript({
  //   target: { tabId: tab },
  //   files: ['test2.js']
  // });
  const channel = new BroadcastChannel('hello-world');
  channel.postMessage('sup');

  console.log(tab);

  // This is test
  await inject(tab, testFunc, []);

  switch (request.message) {
    case m.video.runScript:
      console.log("video injection called");
      await inject(tab, scan, [m.video.status]);
      break;

    

    
    // case m.server.connect.runScript:
    //   await inject(tab, server.connect, [
    //     m.server.connect.status,
    //     {
    //       server: m.servers[0],
    //       errorMessage: m.server.events.errorMessage,
    //     },
    //   ]);

    //   break;
    // case m.server.registerUser.runScript:
    //   await inject(tab, server.registerUser, [
    //     m.server.registerUser.status,
    //     {
    //       // errorMessage: m.server.events.errorMessage,
    //       key: await getCache(m.cacheKeys.key),
    //       id: await getCache(m.cacheKeys.id),
    //       event: m.server.events.registerUser,
    //     },
    //   ]);
  }
});
