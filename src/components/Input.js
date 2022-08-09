import React, { useEffect, useRef } from "react";
import Page from "./Page";

function Input(props) {
	const ref = useRef(null);

	const defaultInputProps = {
		className: "input",
		type: "text",
		defaultValue: props.defaultValue,
		maxLength: 15,
		spellCheck: "false",
		ref: ref,
		onClick: (e) => e.target.select(),
	};

	useEffect(() => ref.current.focus(), []);

	return (
		<Page text={props.text} buttonProps={props.buttonProps}>
			<input {...Object.assign(defaultInputProps, props.inputProps)} />
		</Page>
	);
}

export default Input;
