import React from "react";
import Page from "./Page";

function Failure(props) {
  return (
    <Page
      text="For this extension to work, the current website must contain a supported video player."
      buttonProps={{
        text: "Close",
        onClick: () => window.close(),
      }}
    />
  );
}

export default Failure;
