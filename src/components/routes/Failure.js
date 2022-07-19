import React from "react";
import { useNavigate } from "react-router";
import inject from "../../modules/inject";
import { video } from "../../modules/messages";
import Button from '../utility/Button';

function Failure(props) {
  let navigate = useNavigate();

  inject(video).then((resolve) => (resolve ? navigate("/main") : null));

  return (
    <>
      <div className="centered container">
        <p>For this extension to work, the current website must contain a supported video player.</p>
      </div>
      <Button
        text="Close"
        onClick={() => {window.close()}}
      />
    </>
  );
}

export default Failure;
