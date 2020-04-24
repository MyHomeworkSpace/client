import "ui/AddActionHomeworkInfo.styl";

import { h, Component } from "preact";

import quickAdd from "quickAdd.js";

import AddActionInfo from "ui/AddActionInfo.jsx";
import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default class AddActionHomeworkInfo extends Component {
	render(props, state) {
		if (props.text.trim() == "") {
			return <AddActionInfo class="addActionHomeworkInfoBlank">
				<div class="addActionHomeworkInfoExamples">
					<span>for example&hellip;</span>
					<div><i class="fa fa-angle-right" /> read poem for English for tomorrow</div>
					<div><i class="fa fa-angle-right" /> take test on molecules in Science on next Tuesday</div>
					<div><i class="fa fa-angle-right" /> for next Friday, write an essay about the revolution in History class</div>
				</div>
			</AddActionInfo>;
		}
		var info = quickAdd.parseText(props.text);
		return <AddActionInfo class="addActionHomeworkInfo">
			<div class="addActionHomeworkInfoName"><HomeworkName name={info.tag + " " + info.name} /></div>
			<div class={`addActionHomeworkInfoDetails ${!info.due ? "addActionHomeworkInfoDetailsUnknown" : ""}`}>
				<i class="fa fa-calendar-o"></i> {info.due || "unknown due date"}
			</div>
			<div class={`addActionHomeworkInfoDetails ${!info.class ? "addActionHomeworkInfoDetailsUnknown" : ""}`}>
				<ClassName classObject={info.class ? info.class : {
					color: "aaaaaa",
					name: "unknown class"
				}} />
			</div>
		</AddActionInfo>;
	}
};