import * as m from "./messages";
import { rejectErrors } from "./utility";

// Retries required as server sleeps from inactivity
function registerUser(socket, data, retries = 10) {
  return new Promise((resolve) => {
    rejectErrors(() => socket.close());

    socket = new WebSocket(`wss://${m.servers[0]}.glitch.me/`);
    socket.onopen = () => socket.send(JSON.stringify(data));
    socket.onmessage = (event) => event.data.text().then((result) => resolve(JSON.parse(result)));
    socket.onerror = () => {
      if (retries <= 0) {
        resolve(Object.assign(data, { data: m.server.events.error }));
      }
      registerUser(--retries).then(resolve);
    };
  });
}

export { registerUser };
