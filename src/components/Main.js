import React, { useState } from "react";
import Button, { addLoadingAnimation } from "./Button";
import Page from "./Page";
import { useNavigate } from "react-router-dom";
import { requestResponseSendMessage } from "../modules/requestResponse";
import { server } from "../modules/messages";

function Main(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");
  const [buttonsAreDisabled, setButtonsAreDisabled] = useState(false);

  const textHandler = (text) => setCreateButtonText(text);
  const addClassHandler = (addClass) => setCreateButtonAddClass(addClass);

  let navigate = useNavigate();

  function onCreateClick() {
    setButtonsAreDisabled(true);
    addLoadingAnimation(textHandler, addClassHandler);

    let message = server.createRoom;
    
    message.tabId = props.tabId;

    requestResponseSendMessage(message).then((result) => {
      console.log(result);
      props.keyHandler(result);
      navigate("../connected");
    });
  }

  return (
    <Page
      text="First, navigate to a compatible video streaming website."
      buttonProps={{
        text: createButtonText,
        addClass: createButtonAddClass,
        onClick: onCreateClick,
        disabled: buttonsAreDisabled,
      }}
      footer={
        <Button
          text="Join room"
          onClick={() => navigate("../join")}
          disabled={buttonsAreDisabled}
        />
      }
    />
  );
}

export default Main;
