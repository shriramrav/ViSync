import {
  getActiveTabId,
  injectFile,
  injectFunc,
  rejectErrors,
} from "../src/modules/utility";
import getExtensionInfo from "./modules/getExtensionInfo";
import * as m from "./modules/messages";

chrome.tabs.onActivated.addListener((args) => {
  // const {}

  injectFile(args.tabId, "content.js");
  console.log(obj);
});

let operations = {};

operations[m.getExtensionInfo.request] = async (message) =>
  injectFunc(await getActiveTabId(), getExtensionInfo, message);

chrome.runtime.onMessage.addListener((message) =>
  rejectErrors(() => operations[message.request](message))
);

console.log("Test Service Worker Running");
