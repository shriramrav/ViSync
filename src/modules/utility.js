// Utility functions for service worker

function getActiveTabId() {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      (tabs) => resolve(tabs[0].id)
    );
  });
}


function injectFunc(tab, func, ...args) {
    return new Promise(
        resolve => chrome.scripting.executeScript({
            target: { 
                tabId: tab 
            },
            func: func,
            args: args
        }, resolve)
    );
}

function injectFile(tab, file) {
  return new Promise(
      resolve => chrome.scripting.executeScript({
          target: { 
              tabId: tab 
          },
          files: [file]
      }, resolve)
  );
}



export { getActiveTabId, injectFunc, injectFile };