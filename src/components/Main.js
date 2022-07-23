import React, { useState } from "react";
import Button from "./Button";
import Page from "./Page";
import { useNavigate } from "react-router-dom";
import { server } from "../modules/messages";
import {requestResponse} from "../modules/requestResponse";
import "../style.css";

function Main(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");

  let navigate = useNavigate();

  let onCreateClick = async () => {
    setCreateButtonAddClass("loading-anim");
    setCreateButtonText(
      "Loading..."
        .split("")
        .map((char, index) => <span key={index}>{char}</span>)
    );

    // if ((await inject(server.connect)).data !== server.events.error) {

    //   // console.log((await inject(server.registerUser)).data);

    //   navigate("../create");
    // }
  };



  return (
    <Page
      text="First, navigate to a compatible video streaming website."
      buttonProps={{
        text: createButtonText,
        addClass: createButtonAddClass,
        onClick: onCreateClick,
      }}
      footer={<Button text="Join room" />}
    />
  );
}

export default Main;
