import * as m from "./modules/messages";
import { rejectErrors } from "./modules/utility";
import { registerUser, sync } from "./modules/socket";

let port = chrome.runtime.connect(m.connectInfo);
let socket;

//

async function portMessageHandler(message) {
  let caseTriggered = true;

  switch (message.request) {
    case m.server.registerUser.request:
      // socket = new WebSocket(`wss://${m.servers[1]}.glitch.me/`);
      let newData;

      [socket, newData] = await registerUser(message.data);


      console.log(`inside switch:`);
      console.log(socket);

      console.log("second entry");
      console.log(newData);

      if (newData.data !== m.server.events.error) {
        sync(socket);
      }

      message.data = newData;
      break;

    case m.server.destroy.request:
      //
      window.removeEventListener("message", windowMessageHandler);
      console.log("destroy event triggered");
      break;
    default:
      console.log("case not triggered, the following is the message:");
      console.log(message);
      caseTriggered = false;
  }

  if (caseTriggered) {
    rejectErrors(() => port.postMessage(message));
  }
}

let windowMessageHandler = (m) => portMessageHandler(m.data)


window.addEventListener("message", (m) => {
  console.log("hello, from content");
  console.log(m);
});

// Event listeners
port.onMessage.addListener(portMessageHandler);
window.addEventListener("message", windowMessageHandler);

console.log("done");
