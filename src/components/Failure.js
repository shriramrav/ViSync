import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import {requestResponse} from "../modules/requestResponse";
import { video } from "../modules/messages";
import Page from "./Page";

function Failure(props) {
  let navigate = useNavigate();

  useEffect(() => {
    console.log('thisu ran');

    requestResponse(video).then((resolve) => (resolve ? navigate("/main") : null));
  }, []);

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
