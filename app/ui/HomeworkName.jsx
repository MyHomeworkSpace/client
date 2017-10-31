import { h, Component } from "preact";

import prefixes from "prefixes.js";

class HomeworkName extends Component {
	render(props, state) {
		var nameParts = props.name.split(" ");
		var tag = nameParts[0];
		var remain = nameParts.slice(1).join(" ");
		var color = prefixes.matchPrefix(tag);
		var background = "#" + color.background;
		if (tag.toLowerCase() == "none") {
			background = "transparent";
		}
		return <span><span style={`background-color:${background};color:#${color.color};padding:2px;`}>{tag}</span> {remain}</span>;
	}
}

export default HomeworkName;