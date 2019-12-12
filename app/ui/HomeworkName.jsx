import { h, Component } from "preact";

import prefixes from "prefixes.js";

export default class HomeworkName extends Component {
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
};


// Maybe put this somewhere at some point, but there's no good place right now
// import PrefixList from "ui/PrefixList.jsx";
// import Collapse from "ui/Collapse.jsx";
// <Collapse title="See all Tags">
// 	<PrefixList />
// </Collapse>