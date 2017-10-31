import { h, Component } from "preact";

import prefixes from "prefixes.js";

class ClassName extends Component {
	render(props, state) {
		return <span><span style={`display:inline-block;width:12px;height:12px;border-radius:100%;margin-right:2px;background-color:#${props.classObject.color}`} /> {props.classObject.name}</span>;
	}
}

export default ClassName;