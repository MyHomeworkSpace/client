import { h, Component } from "preact";

class HomeworkName extends Component {
	render(props, state) {
		var nameParts = props.name.split(" ");
		var tag = nameParts[0];
		var remain = nameParts.slice(1).join(" ");
		return <span><span class={MyHomeworkSpace.Prefixes.matchClass(tag)}>{tag}</span> {remain}</span>;
	}
}

export default HomeworkName;