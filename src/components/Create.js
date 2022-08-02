import React from "react";
import Input from "./Input";
import buttonProps from "../modules/disconnectButtonProps";

// Change name to connected

function Create(props) {
  return (
    <Input
      text="You have successfully joined a room! To add others, share the following key."
      inputProps={{ defaultValue: props.keyValue }}
      buttonProps={buttonProps}
    />
  );
}

export default Create;
