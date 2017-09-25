import "ui/AddActionHomeworkInfo.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import quickAdd from "quickAdd.js";

import AddActionInfo from "ui/AddActionInfo.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

class AddActionHomeworkInfo extends Component {
	render(props, state) {
		if (props.text.trim() == "") {
			return <AddActionInfo>
				<p>Type your homework in the textbox above.</p>
			</AddActionInfo>;
		}
		var info = quickAdd.parseText(props.text);
		return <AddActionInfo class="addActionHomeworkInfo">
			<div class="addActionHomeworkInfoName"><HomeworkName name={info.tag + " " + info.name} /></div>
			<div>Class: <strong>{info.class || "unknown"}</strong></div>
			<div>Due: <strong>{info.due || "unknown"}</strong></div>
		</AddActionInfo>;
	}
}

export default AddActionHomeworkInfo;