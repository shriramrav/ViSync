import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import { useStateCallback } from "use"

import Main from "./components/Main";
import Create from "./components/Create";
import Failure from "./components/Failure";
import Join from "./components/Join";

import { requestResponseSendMessage } from "./modules/requestResponse";
import { getExtensionInfo } from "./modules/messages";

function App(props) {
  const [key, setKey] = useState("");

  let navigate = useNavigate();
  let keyHandler = (newkey) => setKey(newkey);

  useEffect(() => {
    requestResponseSendMessage(getExtensionInfo).then((result) => {
      setKey(result.key);
      navigate(`/${result.page}`);
    });

    // navigate("/create");
    // navigate("/main");
  }, []);

  // useEffect(() => window.postMessage('asdfasdfasd'), []);

  return (
    <Routes>
      <Route exact path="/" element={<></>} />
      <Route exact path="/failure" element={<Failure />} />
      <Route exact path="/main" element={<Main keyHandler={keyHandler} />} />
      <Route exact path="/create" element={<Create keyValue={key} />} />
      <Route exact path="/join" element={<Join keyHandler={keyHandler} />} />
    </Routes>
  );
}

export default App;
