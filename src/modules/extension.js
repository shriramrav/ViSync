export function init(messages) {
  let extension = {
    storage: {},
    socket: {
        //Allows for chrome messages only after server communication has occurred
        chromeMessage: "",
        setDefaultChromeMessage: (message) => (socket.chromeMessage = message),
    },
    messages: messages
  };

  let socket = extension.socket;
  let storage = extension.storage;
  let m = extension.messages;

  // All socket functions

  socket.connect = () => {
    socket.setDefaultChromeMessage(m.connect.status);

    socket.connection = new WebSocket(`wss://${args.server}.glitch.me/`);

    let connection = socket.connection;

    let sendChromeMessage = (data = "", message = socket.chromeMessage) =>
      chrome.runtime.sendMessage({ data: data, message: message });

    connection.onopen = sendChromeMessage;

    // Parses blob recieved from server
    connection.onmessage = (event) =>
      event.data.text().then((e) => {
        console.log(`This is the event: ${e}`);
        sendChromeMessage(e);
      });
    connection.onerror = () => sendChromeMessage(m.events.error);
  };

  socket.registerUser = (message, args) => {
    socket.setDefaultChromeMessage(message);
  
    storage.id = args.id;
    storage.key = args.key;

    ws.send(JSON.stringify(args));
  }

  chrome.runtime.onMessage.addListener((event) => {
    switch(event.message){
        case m.connect.runScript:
            socket.connect();
        // case 
    }
  });


}
// const server = {
//     connect: {
//       status: "sNdpaVKlSR",
//       runScript: "VKJINmRnzJ",
//     },
//     registerUser: {
//       status: "tIVSkVefJp",
//       runScript: "XXBBqabYOL",
//     },
//     sync: {
//       status: "aflZjFaurJ",
//       runScript: "PuHyziODac",
//     },
//     destroy: {
//       status: "rKJCNCTLqK",
//       runScript: "kewmYRJhAn",
//     },
//     events: {
//       // Must match registered server events
//       connect: "connect",
//       registerUser: "registerUser",
//       error: "error",
//     },
//   };