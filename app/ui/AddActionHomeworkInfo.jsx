import "ui/AddActionHomeworkInfo.styl";

import { h } from "preact";

import moment from "moment";

import quickAdd from "quickAdd.js";
import { relativeDate } from "utils.js";

import AddActionInfo from "ui/AddActionInfo.jsx";
import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default function AddActionHomeworkInfo(props) {
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

	let info = quickAdd.parseText(props.text)[0];
	let dueDate = info.due || undefined;
	let dueDateDisplay = (dueDate ? relativeDate(moment(dueDate, "YYYY-MM-DD")) : null);
	return <AddActionInfo class="addActionHomeworkInfo">
		<div class="addActionHomeworkInfoName"><HomeworkName name={info.tag + " " + info.name} /></div>
		<div class={`addActionHomeworkInfoDetails ${!dueDateDisplay ? "addActionHomeworkInfoDetailsUnknown" : ""}`}>
			<i class="fa fa-calendar-o"></i> {dueDateDisplay || "unknown due date"}
		</div>
		<div class={`addActionHomeworkInfoDetails ${!info.class ? "addActionHomeworkInfoDetailsUnknown" : ""}`}>
			<ClassName classObject={info.class ? info.class : {
				color: "aaaaaa",
				name: "unknown class"
			}} />
		</div>
	</AddActionInfo>;
};