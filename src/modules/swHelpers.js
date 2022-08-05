function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      (tabs) => resolve(tabs[0])
    );
  });
}

function inject(tab, options, allFrames=false) {
  return new Promise((resolve) =>
    chrome.scripting.executeScript(
      Object.assign(
        {
          target: {
            tabId: tab,
            allFrames: allFrames
          },
        },
        options
      ),
      resolve
    )
  );
}

function injectFunc(tab, func, ...args) {
  return inject(tab, { func: func, args: args });
}

function injectFile(tab, file, allFrames=false) {
  return inject(tab, { files: [file] }, allFrames);
}

export { getActiveTab, injectFile, injectFunc };
