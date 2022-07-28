import React from "react";
import Button from "./Button";

function Page(props) {
  return (
    <div className="centered container">
      <p>{props.text}</p>
      {props.children}
      <Button {...props.buttonProps} />
      {props.footer}
    </div>
  );
}

export default Page;
