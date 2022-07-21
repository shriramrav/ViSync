import React from "react";
import "../style.css";

function Button(props) {
  return (
    <button
      id={props.id}
      type="button"
      className={
        (props.class || "button centered container shadowed2") +
        " " +
        props.addClass
      }
      onClick={props.onClick}
    >
      <b>{props.text}</b>
    </button>
  );
}
export default Button;
