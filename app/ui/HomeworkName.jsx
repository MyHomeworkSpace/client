import { h } from "preact";

import prefixes from "prefixes.js";

export default function HomeworkName(props) {
	var nameParts = props.name.split(" ");
	var tag = nameParts[0];
	var remain = nameParts.slice(1).join(" ");
	var color = prefixes.matchPrefix(tag);
	var background = "#" + color.background;
	if (tag.toLowerCase() == "none") {
		background = "transparent";
	}
	return <span><span style={`background-color:${background};color:#${color.color};padding:2px;`}>{tag}</span> {remain}</span>;
};