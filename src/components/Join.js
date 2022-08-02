import React, { useState } from "react";
import { useNavigate } from "react-router";
import { popupRegisterUser } from "../modules/popupRegisterUser";
import Input from "./Input";

function Join(props) {
  const [buttonAddClass, setButtonAddClass] = useState("");
  const [buttonText, setButtonText] = useState("Join");

  let navigate = useNavigate(); 

  const clickHandler = (e) => {
    let button = document.querySelector("button");

    let setStates = (addClass, text) => {
      setButtonAddClass(addClass);
      setButtonText(text);
    };

    button.disabled = true;

    setStates(
      "loading-anim",
      "Loading..."
        .split("")
        .map((char, index) => <span key={index}>{char}</span>)
    );

    popupRegisterUser("join", document.querySelector("input").value)
      .then((result) => {
        console.log("result");
        console.log(result);
        props.keyHandler(result.key);
        navigate("../create");
      })
      .catch((e) => {

        console.log('error has occured');
        console.log(e);

        setStates("error", "Invalid key");
        setTimeout(() => setStates("", "Join"), 500);

        button.disabled = false;
      });
  };

  let buttonProps = {
    text: buttonText,
    addClass: buttonAddClass,
    onClick: clickHandler,
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
