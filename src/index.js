import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "./style.css";
import App from "./App";
// import Test from "./Test";
import TestApp from "./TestApp";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>
  // <Test/>

  // <TestApp />
);
