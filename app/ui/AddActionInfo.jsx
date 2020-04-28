import "ui/AddActionInfo.styl";

import { h } from "preact";

export default function AddActionInfo(props) {
	return <div class={`addActionInfo ${props.class || ""}`}>
		{props.children}
	</div>;
};