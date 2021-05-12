import { h } from "preact";

import prefixes from "prefixes.js";

export default function HomeworkName(props) {
	let nameParts = props.name.split(" ");
	let tag = nameParts[0];
	let remain = nameParts.slice(1).join(" ");
	let color = prefixes.matchPrefix(tag);
	let background = "#" + color.background;
	if (tag.toLowerCase() == "none") {
		background = "transparent";
	}
	return <span><span style={`background-color:${background};color:#${color.color};padding:2px;`}>{tag}</span> {remain}</span>;
};