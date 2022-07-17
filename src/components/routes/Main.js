import React, { useState } from "react";
import Button from "../utility/Button";
import { useNavigate } from "react-router-dom";
import "../../style.css";

function Main(props) {
  const [createButtonAddClass, setCreateButtonAddClass] = useState("");
  const [createButtonText, setCreateButtonText] = useState("Create room");

  let navigate = useNavigate();

  let onCreateClick = () => {
    setCreateButtonAddClass("loading-anim");
    setCreateButtonText(
      "Loading...".split("").map((char) => <span>{char}</span>)
    );

    navigate("./create");
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
