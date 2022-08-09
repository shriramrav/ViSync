import React from "react";
import Input from "./Input";
import { server } from "../modules/messages";

function Connected(props) {
	return (
		<Input
			text="You have successfully joined a room! To add others, share the following key."
			inputProps={{ defaultValue: props.keyValue, disabled: true }}
			buttonProps={{
				text: "Disconnect",
				onClick: () => {
					// console.log("clicked");

					let message = server.destroy;
					message.tabId = props.tabId;

					chrome.runtime.sendMessage(message, () => window.close());
				},
			}}
		/>
	);
}

export default Connected;
