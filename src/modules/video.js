import { generateRandomKey } from "../modules/keys";
import { addToggle } from "../modules/utility";

function createEventObject(event, timeStamp = 0) {
  return {
    event: event,
    timeStamp: timeStamp,
  };
}

function sync(socket) {
  console.log(`socket`);
  console.log(socket);

  let video = document.querySelector("video");
  let prevTime = video.currentTime;

  // Time in seconds
  const minTimeUpdateRange = 0.5;

  // Time in milliseconds
  const sendPlayOrPauseEventDelay = 250;

  // Used to prevent extra emits from user spamming play/pause
  let spamFilter = {};
  let session = generateRandomKey();

  let [playHandler, playToggle] = addToggle(() => onPlayOrPause("play"));
  let [pauseHandler, pauseToggle] = addToggle(() => onPlayOrPause("pause"));
  let [timeUpdateHandler, timeUpdateToggle] = addToggle(onTimeUpdate);

  const runVideoEvents = {
    play: () => {
      playToggle.set(false);
      video.play();
    },
    pause: () => {
      pauseToggle.set(false);
      video.pause();
    },
    timeupdate: (currentTime) => {
      timeUpdateToggle.set(false);
      prevTime = currentTime;
      video.currentTime = currentTime;
    },
  };

  // Event listeners

  function onPlayOrPause(type) {
    if (spamFilter[session] === undefined) {
      session = generateRandomKey();

      let temp = session;

      spamFilter[temp] = createEventObject(type);

      setTimeout(() => {
        if (spamFilter[temp] !== undefined) {
          console.log(`${type} ran`);

          // should send socket event here
          socket.emit("videoEvent", spamFilter[temp]);
        }

        delete spamFilter[temp];
      }, sendPlayOrPauseEventDelay);
    } else {
      delete spamFilter[session];
    }
  }

  function onTimeUpdate() {
    let currentTime = video.currentTime;

    if (Math.abs(currentTime - prevTime) > minTimeUpdateRange) {
      console.log(`manual adjustment was made`);

      // socket should send here
      socket.emit("videoEvent", createEventObject("timeupdate", currentTime));
    }

    prevTime = currentTime;
  }

  const videoEventHandler = (e) => runVideoEvents[e.event](e.timeStamp);

  // Binds event listeners;

  video.addEventListener("play", playHandler);
  video.addEventListener("pause", pauseHandler);
  video.addEventListener("timeupdate", timeUpdateHandler);

  socket.on("videoEvent", videoEventHandler);

  return {
    destroy: () => {
      video.removeEventListener("play", playHandler);
      video.removeEventListener("pause", pauseHandler);
      video.removeEventListener("timeupdate", timeUpdateHandler);
    },
  };
}

export { sync };
