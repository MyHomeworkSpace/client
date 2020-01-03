import "ui/AddActionHomeworkInfo.styl";

import { h, Component } from "preact";

import quickAdd from "quickAdd.js";

import AddActionInfo from "ui/AddActionInfo.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default class AddActionHomeworkInfo extends Component {
	render(props, state) {
		if (props.text.trim() == "") {
			return <AddActionInfo class="addActionHomeworkInfoBlank">
				<p>Type your homework in the textbox above.</p>
				<div class="addActionHomeworkInfoExamples">
					<span>for example</span>
					<ul>
						<li>read poem for English for tomorrow</li>
						<li>take test on molecules in Science on next Tuesday</li>
						<li>for next Friday, write an essay about the revolution in History class</li>
					</ul>
				</div>
			</AddActionInfo>;
		}
		var info = quickAdd.parseText(props.text);
		return <AddActionInfo class="addActionHomeworkInfo">
			<div class="addActionHomeworkInfoName"><HomeworkName name={info.tag + " " + info.name} /></div>
			<div>Class: <strong>{info.class ? info.class.name : "unknown"}</strong></div>
			<div>Due: <strong>{info.due || "unknown"}</strong></div>
		</AddActionInfo>;
	}
};