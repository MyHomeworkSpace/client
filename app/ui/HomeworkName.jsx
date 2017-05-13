import { h, Component } from "preact";

class HomeworkName extends Component {
	render(props, state) {
		var nameParts = props.name.split(" ");
		var tag = nameParts[0];
		var remain = nameParts.slice(1).join(" ");
		var color = MyHomeworkSpace.Prefixes.matchPrefix(tag);
		return <span><span style={`background-color:${color.background};color:${color.color};`}>{tag}</span> {remain}</span>;
	}
}

export default HomeworkName;