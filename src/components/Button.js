import React from "react";

function Button(props) {
  return (
    <button
      className={"button " + props.addClass}
      onClick={props.onClick}
    >
      <b>{props.text}</b>
    </button>
  );
}
export default Button;
