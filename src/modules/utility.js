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
  return new Promise((resolve) =>
    chrome.scripting.executeScript(
      {
        target: {
          tabId: tab,
        },
        func: func,
        args: args,
      },
      resolve
    )
  );
}

function injectFile(tab, file) {
  return new Promise((resolve) =>
    chrome.scripting.executeScript(
      {
        target: { tabId: tab },
        files: [file],
      },
      resolve
    )
  );
}

// Utility for content script

class ReferencableBoolean {
  constructor(value) {
    this.value = value;
  }

  set(value) {
    this.value = value;
  }

  state() {
    return this.value;
  }
}

function addToggle(func, setTrueIfFalse = true) {
  let toggle = new ReferencableBoolean(true);

  let newFunc = () => {
    if (toggle.state()) {
      func();
    } else {
      toggle.set(setTrueIfFalse);
    }
  };

  return [newFunc, disabler];
}

function rejectErrors(func) {
  try {
    func();
  } catch (err) {}
}

export { getActiveTabId, injectFunc, injectFile, rejectErrors, addToggle };
