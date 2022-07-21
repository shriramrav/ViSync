import React from "react";
import Button from './Button';
import "../style.css";


function Page(props) {
  return (
    <>
      <div className="centered container">
        <p>{props.text}</p>
      </div>
      {props.children}
      <Button
        text={props.buttonProps.text}
        onClick={props.buttonProps.onClick}
        addClass={props.buttonProps.addClass}
      />
      {props.footer}
    </>
  );
}

export default Page;
