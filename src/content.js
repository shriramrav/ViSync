import * as m from "./modules/messages";
// import { rejectErrors } from "./modules/utility";
import { registerUser } from "./modules/socket";

let port = chrome.runtime.connect(m.connectInfo);
let socket;

//

async function onMessageEventListener(message) {
  let caseTriggered = true;

  switch (message.request) {
    case m.server.registerUser.request:
      let newData = await registerUser(socket, message.data);

      console.log('newData');
      console.log(newData);

      message.data = newData;
      break;

    default:
      console.log("case not triggered, the following is the message:");
      console.log(message);
      caseTriggered = false;
  }

  if (caseTriggered) {
    port.postMessage(message);
  }
}

// Event listeners
port.onMessage.addListener(onMessageEventListener);

console.log("done");
