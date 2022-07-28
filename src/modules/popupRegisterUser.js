import { generateRandomKey } from "./keys";
import { requestResponseSendMessage } from "./requestResponse";
import { server } from "./messages";

function popupRegisterUser(page, key=generateRandomKey()) {
  return new Promise((resolve, reject) => {
    let id = page === "create" ? key : generateRandomKey();

    // Test if this preserves import for future use later
    let message = structuredClone(server.registerUser);

    message.data = {
      page: page,
      // Same key for both key and id prop is for create page
      event: server.events.registerUser,
      id: id,
      key: key,
    };

    requestResponseSendMessage(message).then((result) => {
      // Change to ternary operator later
      if (result.data !== server.events.error) {

        console.log("result:::::::");
        console.log(result);

        resolve(result);
      } else {
        reject();
      }
    });
  });
}

export { popupRegisterUser };
