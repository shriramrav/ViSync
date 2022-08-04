import React from "react";
import Input from "./Input";
import { server } from "../modules/messages";
import { requestResponseSendMessage } from "../modules/requestResponse";

function Connected(props) {
  return (
    <Input
      text="You have successfully joined a room! To add others, share the following key."
      inputProps={{ defaultValue: props.keyValue }}
      buttonProps={{
        text: "Disconnect",
        onClick: () => {

          console.log('clicked');


          chrome.runtime.sendMessage(server.destroy, () => {
            // console.log('operation complete');
            window.close();
          });

        },
      }}
    />
  );
}

export default Connected;
