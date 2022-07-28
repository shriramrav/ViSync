import React, { useState } from "react";
import { popupRegisterUser } from "../modules/popupRegisterUser";
import Input from "./Input";

function Join(props) {
  const [buttonAddClass, setButtonAddClass] = useState("");
  const [buttonText, setButtonText] = useState("Join");

  const clickHandler = () => {
    setButtonAddClass("loading-anim");
    setButtonText(
      "Loading..."
        .split("")
        .map((char, index) => <span key={index}>{char}</span>)
    );

    popupRegisterUser("join", document.querySelector("input").value)
      .then((result) => {
        //   props.keyHandler(result.key);
        //   navigate("../create");
        console.log("result");
        console.log(result);
      })
      .catch(() => console.log("Error Registering User"));
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
