import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Main from "./components/Main";
import Connected from "./components/Connected";
import Failure from "./components/Failure";
import Join from "./components/Join";

import { requestResponseSendMessage } from "./modules/requestResponse";
import { getExtensionInfo, injectContent } from "./modules/messages";

function App(props) {
  const [key, setKey] = useState("");

  let navigate = useNavigate();
  let keyHandler = (newkey) => setKey(newkey);

  useEffect(() => {
    requestResponseSendMessage(getExtensionInfo).then((result) => {
      console.log('afsdfasdfas');
      setKey(result.key);
      navigate(`/${result.page}`);

      if (result.initialized != undefined) {
        chrome.runtime.sendMessage(injectContent);
      }
    });
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<></>} />
      <Route exact path="/failure" element={<Failure />} />
      <Route exact path="/main" element={<Main keyHandler={keyHandler} />} />
      <Route exact path="/connected" element={<Connected keyValue={key} />} />
      <Route exact path="/join" element={<Join keyHandler={keyHandler} />} />
    </Routes>
  );
}

export default App;
