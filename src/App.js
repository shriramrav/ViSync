import React from "react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/routes/Main";
import Create from './components/routes/Create';


function App(props) {

  console.log("render ran");
  return (
    <MemoryRouter>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/create" element={<Create/>}/>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
