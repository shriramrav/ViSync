import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Failure from "./components/Failure";
// import { useStateCallback } from "use"

import Page from "./components/Page";

import TestFailure from "./components/TestFailure";
import { requestResponseSendMessage } from "./modules/requestResponse";

import * as m from "./modules/messages";
import TestMain from "./components/TestMain";

function TestApp(props) {


  const [text, setText] = useState("");
  const [buttonProps, setButtonProps] = useState({});
  const [path, setPath] = useState("/");

  const pageProps = {
    textHandler: (text) => setText(text),
    buttonPropsHandler: (props) => setButtonProps(props),
    pathHandler: (path) => setPath(path),
  };

  const paths = {
    "/": <></>,
    "/main": <TestMain {...pageProps} />,
    "/failure": <TestFailure {...pageProps} />
  };


  useEffect(() => {
    requestResponseSendMessage(m.getExtensionInfo).then((result) => {
      console.log(result.page);
      setPath(`/${result.page}`);
    })
    // setTimeout(()=> setPath())
  }, []);

  return (
    <Page text={text} buttonProps={buttonProps}>
      {paths[path]}
    </Page>
  );
}
export default TestApp;
