// Utility functions for service worker

function getActiveId() {
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


function inject(tab, func, args = []) {
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


export { getActiveId, inject };