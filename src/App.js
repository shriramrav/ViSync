import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Main from "./components/Main";
import Connected from "./components/Connected";
import Failure from "./components/Failure";
import Join from "./components/Join";

import { requestResponseSendMessage } from "./modules/requestResponse";
import { getExtensionInfo } from "./modules/messages";

function App(props) {
  const [key, setKey] = useState("");
  const [tabId, setTabId] = useState(null);

  let navigate = useNavigate();
  let keyHandler = (newkey) => setKey(newkey);
  // let tabIdHandler = ()
  
  let childProps = {
    keyHandler: keyHandler,
    keyValue: key,
    tabId: tabId
  }

  useEffect(() => {
    requestResponseSendMessage(getExtensionInfo).then((result) => {
      // setTabId()
      console.log('request Response message');
      console.log(result);
      setTabId(result.tabId);
      setKey(result.key);
      navigate(`/${result.page}`);
    });
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<></>} />
      <Route exact path="/failure" element={<Failure />} />
      <Route exact path="/main" element={<Main {...childProps} />} />
      <Route exact path="/connected" element={<Connected {...childProps} />} />
      <Route exact path="/join" element={<Join {...childProps} />} />
    </Routes>
  );
}

export default App;
