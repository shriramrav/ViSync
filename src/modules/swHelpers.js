function getActiveTab() {
  const options = {
    active: true,
    lastFocusedWindow: true,
  };

  return new Promise((resolve) => {
    chrome.tabs.query(options, (tabs) => resolve(tabs[0]));
  });
}

function inject(tabId, options, allFrames = false) {
  options.target = {
    tabId: tabId,
    allFrames: allFrames,
  };

  return new Promise((resolve) =>
    chrome.scripting.executeScript(options, resolve)
  );
}

function injectFunc(tabId, func, ...args) {
  return inject(tabId, { func: func, args: args });
}

function injectFile(tabId, file, allFrames = false) {
  return inject(tabId, { files: [file] }, allFrames);
}

export { getActiveTab, injectFile, injectFunc };
