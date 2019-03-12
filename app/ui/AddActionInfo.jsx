import "ui/AddActionInfo.styl";

import { h, Component } from "preact";

class AddActionInfo extends Component {
	render(props, state) {
		return <div class={`addActionInfo ${props.class || ""}`}>
			{props.children}
		</div>;
	}
}

export default AddActionInfo;