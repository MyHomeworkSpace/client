import "ui/HomeworkItem.styl";

import { h, Component } from "preact";

import prefixes from "prefixes.js";

import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

class HomeworkItem extends Component {
	constructor() {
		super();
		this.state = {
			complete: false,
			expanded: false
		};
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props);
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
		var dueText = due.calendar().split(" at ")[0];
		var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);

		if (dueText.indexOf(' ') > -1) {
			dueText = dueText[0].toLowerCase() + dueText.substr(1);
		}

		if (daysTo >= 7 && daysTo < 14) {
			dueText = "next " + due.format("dddd");
		}

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

		return <div class={`hwItem ${props.isOverdue ? "hwLate": ""} ${state.complete == "1" ? "done": ""}`} style={`border-left-color: #${prefixInfo.background}`} data-hwId={props.homework.id}>
			<div class="hwOptions">
				<i class={`fa ${state.complete ? "fa-check-circle-o" : "fa-circle-o"} toggleable-check`} onClick={this.toggleComplete.bind(this)}></i>
				<i class="fa fa-edit" onClick={this.edit.bind(this)}></i>
			</div>
			<div class="hwName">
				<HomeworkName name={props.homework.name} />
			</div>
			<div class="hwDetails">
				{!hideDue && <div><i class="fa fa-calendar-o" /> {dueText} {props.isOverdue && " (late)"}</div>}
				<div><ClassName classObject={classObject} /></div>
			</div>
			{props.homework.desc.trim() != "" && <i class={state.expanded ? "hwDescIcon fa fa-arrow-circle-up" : "hwDescIcon fa fa-arrow-circle-down"} onClick={this.toggleDescription.bind(this)} data-toggle="tooltip" data-placement="left" title="Toggle description"></i>}
			{state.expanded && <div>
				{props.homework.desc.split("\n").map(function(line) {
					return <div>{line}</div>;
				})}
			</div>}
		</div>;
	}
}

export default HomeworkItem;