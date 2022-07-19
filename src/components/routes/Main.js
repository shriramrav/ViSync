import React, { useState } from "react";
import Button from "../utility/Button";
import { useNavigate } from "react-router-dom";
import { server } from '../../modules/messages';
import inject from '../../modules/inject';
import "../../style.css";

function Main(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");

  let navigate = useNavigate();

  let onCreateClick = async () => {
    setCreateButtonAddClass("loading-anim");
    setCreateButtonText(
      "Loading...".split("").map((char, index) => <span key={index}>{char}</span>)
    );

    if ((await inject(server.connect)).data !== server.events.error) {
      navigate("./create");
    }
  };

  return (
    <>
      <div className="centered container">
        <p>First, navigate to a compatible video-viewing website.</p>
      </div>
      <Button
        text={createButtonText}
        addClass={createButtonAddClass}
        onClick={onCreateClick}
      />
      <Button text="Join room" />
    </>
  );
}

export default Main;
