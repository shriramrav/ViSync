import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { generateRandomKey } from "../src/modules/keys";
// import Button from "./Button";

function Test(props) {
  let socket;

  useEffect(() => {
    socket = io("https://serve.visync.repl.co");

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("createRoom");
    });

    // socket.on("createRoom", ())


  }, []);

  return (
    <div className="centered container">
      <p>test</p>
      {/* <Button text="hello"/> */}
    </div>
  );
}

export default Test;
