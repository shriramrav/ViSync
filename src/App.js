import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/Main";
import Create from "./components/Create";
import Failure from "./components/Failure";
import { requestResponseSendMessage } from "./modules/requestResponse";
import { getExtensionInfo } from "./modules/messages";

function App(props) {
  let navigate = useNavigate();

  useEffect(() => {
    requestResponseSendMessage(getExtensionInfo).then((result) =>
      navigate(`/${result.page}`)
    );
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<></>} />
      <Route exact path="/failure" element={<Failure />} />
      <Route exact path="/main" element={<Main />} />
      <Route exact path="/create" element={<Create />} />
    </Routes>
  );
}

export default App;
