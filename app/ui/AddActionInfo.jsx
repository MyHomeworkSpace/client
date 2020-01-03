import "ui/AddActionInfo.styl";

import { h, Component } from "preact";

export default class AddActionInfo extends Component {
	render(props, state) {
		return <div class={`addActionInfo ${props.class || ""}`}>
			{props.children}
		</div>;
	}
};