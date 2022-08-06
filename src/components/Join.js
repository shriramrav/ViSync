import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { requestResponseSendMessage } from "../modules/requestResponse";
import { addLoadingAnimation, addErrorAnimation } from "./Button";
import { server } from "../modules/messages";
import Input from "./Input";

function Join(props) {
  const [buttonAddClass, setButtonAddClass] = useState("");
  const [buttonText, setButtonText] = useState("Join");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const textHandler = (text) => setButtonText(text);
  const addClassHandler = (addClass) => setButtonAddClass(addClass);

  let navigate = useNavigate();

  const clickHandler = (e) => {
    setButtonDisabled(true);

    addLoadingAnimation(textHandler, addClassHandler);

    let input = document.querySelector("input");

    let message = server.joinRoom;

    // 
    message.key = input.value;
    message.tabId = props.tabId;

    requestResponseSendMessage(message).then((result) => {
      console.log("result::::");
      console.log(result);

      if (result) {
        props.keyHandler(input.value);
        navigate("../connected");
      } else {
        addErrorAnimation(
          { errorText: "Invalid key", defaultText: "Join" },
          textHandler,
          addClassHandler
        );

        setButtonDisabled(false);
      }
    });

    console.log("loading");
  };

  let buttonProps = {
    text: buttonText,
    addClass: buttonAddClass,
    onClick: clickHandler,
    disabled: buttonDisabled,
  };

  let inputProps = { onClick: () => {}, style: { caretColor: "auto" } };

  return (
    <Input
      text={<>To join a room, please enter a valid generated room key.</>}
      buttonProps={buttonProps}
      inputProps={inputProps}
    />
  );
}

export default Join;
