import * as m from "./modules/messages";
import { scan } from "./modules/video";
import * as server from "./modules/server";
import { inject } from "./modules/inject";
import { getCache } from "./modules/cache";

function getActiveId() {
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

chrome.runtime.onMessage.addListener(async (request) => {
  let tab = await getActiveId();

  switch (request.message) {
    case m.video.runScript:
      console.log("video injection called");
      await inject(tab, scan, [m.video.status]);
      break;

    case m.server.connect.runScript:
      await inject(tab, server.connect, [
        m.server.connect.status,
        {
          server: m.servers[0],
          errorMessage: m.server.events.errorMessage,
        },
      ]);

      break;
    case m.server.registerUser.runScript:
      await inject(tab, server.registerUser, [
        m.server.registerUser.status,
        {
          // errorMessage: m.server.events.errorMessage,
          key: await getCache(m.cacheKeys.key),
          id: await getCache(m.cacheKeys.id),
          event: m.server.events.registerUser,
        },
      ]);
  }
});
