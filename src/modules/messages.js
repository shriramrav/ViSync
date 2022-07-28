const getExtensionInfo = {
  request: "jWe143lJ58",
  response: "AvKegfDKB0",
};

const checkForVideoPlayer = {
  request: "vRPriIQaKL",
  response: "ALSRIUcbWS",
};

const injectContentIfNeeded = {
  request: "pkKWEFkEuL",
  response: "bSLudtDQAM",
};

const server = {
  registerUser: {
    request: "tIVSkVefJp",
    response: "XXBBqabYOL",
  },
  sync: {
    status: "aflZjFaurJ",
    runScript: "PuHyziODac",
  },
  destroy: {
    status: "rKJCNCTLqK",
    runScript: "kewmYRJhAn",
  },
  events: {
    // Must match registered server events
    connect: "connect",
    registerUser: "registerUser",
    error: "error",
  },
};

const servers = ["wv4x8oubeg"];

const connectInfo = { name: "visync" };

export {
  checkForVideoPlayer,
  server,
  servers,
  connectInfo,
  injectContentIfNeeded,
  getExtensionInfo
};
