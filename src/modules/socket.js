import * as m from "./messages";
import { rejectErrors } from "./utility";
import { generateRandomKey } from "./keys";

// Helper functions

function createEventObject(event, timeStamp = "") {
  return {
    event: event,
    timeStamp: timeStamp,
  };
}


class Disabler {
  constructor () {
    this.disabled = false;
  }

  disable() {
    this.disabled = true;
  } 
  
  enable() {
    this.disabled = false;
  }

  isDisabled() {
    return this.disabled;
  }
}

function serializeThenSend(socket, data) {
  console.log(`data ${data}`);
  socket.send(JSON.stringify(data));
}

function addDisabler(func, enableIfDisabled = true) {
  // let disabler = { disabled: false };

  let disabler = new Disabler();

  let newFunc = () => {
    if (disabler.isDisabled()) {
      if (enableIfDisabled) {
        // disabler.disabled = true;
        disabler.enable();
        console.log('disabler deactivated');
      }
    } else {
      func();
    }
  };

  return [newFunc, disabler];
}

async function parseBlobFromEvent(event) {
  return JSON.parse(await event.data.text());
}

// Retries required as server sleeps from inactivity
function registerUser(data) {
  return new Promise((resolve) => {
    // rejectErrors(() => socket.close());

    let socket = new WebSocket(`wss://${m.servers[1]}.glitch.me/`);
    // socket.onopen = () => socket.send(JSON.stringify(data));
    console.log(`inside of promise:`);
    console.log(socket);

    socket.onopen = () => serializeThenSend(socket, data);

    // socket.onmessage = (event) =>
    //   event.data.text().then((result) => resolve(JSON.parse(result)));

    socket.onmessage = async (event) => {
      console.log("inside onmessage");
      console.log(socket);
      resolve([socket, await parseBlobFromEvent(event)]);
    };
    // event.data.text().then((result) => resolve(JSON.parse(result)));

    socket.onerror = () => {
      // if (retries <= 0) {
      //   resolve(Object.assign(data, { data: m.server.events.error }));
      // } else {
      //   registerUser(socket, data, --retries).then(resolve);
      // }

      resolve([Object.assign(data, { data: m.server.events.error }), socket]);
    };
  });
}

//
function sync(socket) {
  console.log(`socket`);
  console.log(socket);

  let videoPlayer = document.querySelector("video");
  let prevTime = videoPlayer.currentTime;
  let sessionObj = {};
  let currentSessionProperty = generateRandomKey();

  // Time in seconds
  const minTimeUpdateRange = 0.5;

  // Time in milliseconds
  const sendPlayOrPauseEventDelay = 250;

  const playOrPauseEvent = (type) => {
    if (sessionObj[currentSessionProperty] === undefined) {
      currentSessionProperty = generateRandomKey();

      let tempProperty = currentSessionProperty;

      sessionObj[tempProperty] = createEventObject(type);

      setTimeout(() => {
        if (sessionObj[tempProperty] !== undefined) {
          console.log(`${type} ran`);
          // socket.send(JSON.stringify(sessionObj[tempProperty]));
          serializeThenSend(socket, sessionObj[tempProperty]);
        }

        delete sessionObj[tempProperty];
      }, sendPlayOrPauseEventDelay);
    } else {
      delete sessionObj[currentSessionProperty];
    }
  };

  let timeUpdateEvent = () => {
    let currentTime = videoPlayer.currentTime;

    if (Math.abs(currentTime - prevTime) > minTimeUpdateRange) {
      console.log(`manual adjustment was made`);
      serializeThenSend(socket, createEventObject("timeupdate", currentTime));
      // socket.send(JSON.stringify(createEventObject("timeupdate", currentTime)));
    }

    prevTime = currentTime;
  };

  let [playHandler, playDisabler] = addDisabler(() => playOrPauseEvent("play"));
  let [pauseHandler, pauseDisabler] = addDisabler(() =>
    playOrPauseEvent("pause")
  );
  let [timeUpdateHandler, timeUpdateDisabler] = addDisabler(timeUpdateEvent);

  // Add on message recieved code;
  socket.onmessage = async (event) => {
    let message = await parseBlobFromEvent(event);

    console.log("socket message");
    console.log(message);

    switch (message.event) {
      case "play":
        // playDisabler.disabled = true;
        playDisabler.disable();
        videoPlayer.play();
        break;
      case "pause":
        pauseDisabler.disable();
        // pauseDisabler.disabled = true;
        videoPlayer.pause();
        break;
      case "timeupdate":
        timeUpdateDisabler.disable();
        // timeUpdateDisabler.disabled = true;
        videoPlayer.currentTime = message.timeStamp;
        break;
    }
  };

  // Add listeners
  videoPlayer.addEventListener("play", () => {
    console.log(`play fired, playDisabler:${playDisabler.disabled}`);

    playHandler();
  });
  videoPlayer.addEventListener("pause", () => {
    console.log(`pause fired, playDisabler:${pauseDisabler.disabled}`);
    pauseHandler();
  });
  videoPlayer.addEventListener("timeupdate", () => {
    console.log(`timeUpdate fired, playDisabler:${timeUpdateDisabler.disabled}`);
    timeUpdateHandler();
  });
}

export { registerUser, sync };
