import React from "react";
import { createOrderedCalls } from "../modules/utility";

function Button(props) {
  return (
    <button className={`button ${props.addClass}`} {...props}>
      <b>{props.text}</b>
    </button>
  );
}

export function addLoadingAnimation(textHandler, addClassHandler) {
  const setStates = createOrderedCalls(textHandler, addClassHandler);

  const loadingText = "Loading...";

  let chars = [];

  for (let i = 0; i < loadingText.length; i++) {
    chars.push(<span key={i}>{loadingText[i]}</span>);
  }

  setStates(chars, "loading-anim");
}

export function addErrorAnimation(texts, textHandler, addClassHandler) {
  let { errorText, defaultText } = texts;

  const setStates = createOrderedCalls(textHandler, addClassHandler);
  const resetDelay = 500;

  setStates(errorText, "error");
  setTimeout(() => setStates(defaultText, ""), resetDelay);
}

export default Button;
