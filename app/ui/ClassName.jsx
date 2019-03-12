import { h, Component } from "preact";

class ClassName extends Component {
	render(props, state) {
		return <span class="className"><span style={`display:inline-block;width:12px;height:12px;border-radius:100%;margin-right:2px;background-color:#${props.classObject.color}`} /> {props.classObject.name}</span>;
	}
}

export default ClassName;