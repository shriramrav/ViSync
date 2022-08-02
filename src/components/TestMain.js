import React, { useEffect, useState } from "react";
import Button from "./Button";
import Page from "./Page";
import { useNavigate } from "react-router-dom";
import { popupRegisterUser } from "../modules/popupRegisterUser";

function TestMain(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");

  let onCreateClick = () => {
    document.querySelectorAll("button").forEach((e) => (e.disabled = true));

    setCreateButtonAddClass("loading-anim");
    setCreateButtonText(
      "Loading..."
        .split("")
        .map((char, index) => <span key={index}>{char}</span>)
    );

    console.log('click ran');

  };

  useEffect(() => {
    props.textHandler(
      "First, navigate to a compatible video streaming website."
    );
    props.buttonPropsHandler({
      text: "Join room",
      onClick: () => props.pathHandler("/failure"),
    });
  }, []);

  return (
    <Button
      text={createButtonText}
      addClass={createButtonAddClass}
      onClick={onCreateClick}
    />
  );
}

export default TestMain;
