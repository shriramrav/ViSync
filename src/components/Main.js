import React, { useState } from "react";
import Button from "./Button";
import Page from "./Page";
import { useNavigate } from "react-router-dom";
import { popupRegisterUser } from "../modules/popupRegisterUser";

function Main(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");

  let navigate = useNavigate();

  let onCreateClick = () => {

    document.querySelectorAll('button').forEach((e) => e.disabled = true);

    setCreateButtonAddClass("loading-anim");
    setCreateButtonText(
      "Loading..."
        .split("")
        .map((char, index) => <span key={index}>{char}</span>)
    );

    popupRegisterUser("create")
      .then((result) => {
        props.keyHandler(result.key);
        navigate("../create");
      })
      .catch(() => console.log("Error Registering User"));
  };

  return (
    <Page
      text="First, navigate to a compatible video streaming website."
      buttonProps={{
        text: createButtonText,
        addClass: createButtonAddClass,
        onClick: onCreateClick,
      }}
      footer={<Button text="Join room" onClick={() => navigate("../join")} />}
    />
  );
}

export default Main;
