import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Create from './components/Create';
import Failure from "./components/Failure";

function App(props) {
  return (
    <MemoryRouter>
      <Routes>
        <Route exact path="/" element={<Failure />} />
        <Route exact path="/main" element={<Main />} />
        <Route exact path="/create" element={<Create/>}/>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
