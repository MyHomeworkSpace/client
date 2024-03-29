import "ui/HomeworkItem.styl";

import { h, Component } from "preact";

import moment from "moment";

import prefixes from "prefixes.js";
import { relativeDate } from "utils.js";

import ClassName from "ui/ClassName.jsx";
import FormattedDescription from "ui/FormattedDescription.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default class HomeworkItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			complete: props.homework.complete,
			expanded: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			complete: nextProps.homework.complete
		});
	}

	edit() {
		this.props.edit(this.props.homework.id);
	}

	toggleComplete() {
		var newComplete = !this.state.complete;
		this.setState({
			complete: newComplete
		}, function() {
			this.props.setComplete(this.props.homework.id, newComplete);
		});
	}

	toggleDescription() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	render(props, state) {
		var prefix = props.homework.name.split(" ")[0];
		var prefixInfo = prefixes.matchPrefix(prefix);

		var due = moment(props.homework.due);
		var dueText = relativeDate(due);

		var keyword = "due ";
		if (prefix.toLowerCase() == "test" || prefix.toLowerCase() == "exam" || prefix.toLowerCase() == "midterm" || prefix.toLowerCase() == "quiz" || prefix.toLowerCase() == "ica" || prefix.toLowerCase() == "lab") {
			keyword = "on ";
		}

		if (keyword == "on " && (dueText.toLowerCase() == "tomorrow" || dueText.substr(0, 4) == "last" || dueText.substr(0, 4) == "next")) {
			keyword = "";
		}

		var classObject;
		for (var classIndex in props.classes) {
			if (props.classes[classIndex].id == props.homework.classId) {
				classObject = props.classes[classIndex];
			}
		}

		var hideDue = props.hideDue;
		if (due.day() == 0 || due.day() == 6) {
			// it's due on Saturday or Sunday, meaning that we should always show its due date
			// this forces weekend homework items to have a due date, even when they're in the Monday column
			hideDue = false;
		}

		return <div class={`homeworkItem ${props.isOverdue ? "late" : ""} ${state.complete == "1" ? "done" : ""}`} style={`border-left-color: #${prefixInfo.background}`}>
			<div class="homeworkItemOptions">
				<i class={`fa ${state.complete ? "fa-check-circle-o" : "fa-circle-o"}`} onClick={this.toggleComplete.bind(this)}></i>
				<i class="fa fa-edit" onClick={this.edit.bind(this)}></i>
			</div>
			<div class="homeworkItemName">
				<HomeworkName name={props.homework.name} />
			</div>
			<div class="homeworkItemDetails">
				{!hideDue && <div title={due.format("MMMM Do, YYYY")}><i class="fa fa-calendar-o" /> {dueText} {props.isOverdue && " (late)"}</div>}
				<div><ClassName classObject={classObject} /></div>
				{props.homework.desc.trim() != "" && <i class={`homeworkItemDescriptionIcon fa fa-${state.expanded ? "arrow-circle-up" : "arrow-circle-down"}`} onClick={this.toggleDescription.bind(this)}></i>}
			</div>
			{state.expanded && <div>
				<FormattedDescription text={props.homework.desc} />
			</div>}
		</div>;
	}
};