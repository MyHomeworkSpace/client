import { h, Component } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";

class HomeworkItem extends Component {
	constructor() {
		super();
		this.state = {
			complete: false
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

	render(props, state) {
		var prefix = props.homework.name.split(" ")[0];
		var prefixInfo = MyHomeworkSpace.Prefixes.matchPrefix(prefix);

		var due = moment(props.homework.due);
		var dueText = due.calendar().split(" at ")[0];
		var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);
		var late = (daysTo < 1);

		if (dueText.indexOf(' ') > -1) {
			dueText = dueText[0].toLowerCase() + dueText.substr(1);
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

		return <div class={`hwItem ${late ? "hwLate": ""} ${state.complete == "1" ? "done": ""}`} data-hwId={props.homework.id}>
			<div class="hwOptions">
				<i class={`fa ${state.complete ? "fa-check-circle-o" : "fa-circle-o"} toggleable-check`} onClick={this.toggleComplete.bind(this)}></i>
				<i class="fa fa-edit" onClick={this.edit.bind(this)}></i>
			</div>
			<div class="hwName">
				<HomeworkName name={props.homework.name} />
				{late && " (late)"}
			</div>
			<div class="hwSubText">
				{keyword}{dueText} in {classObject.name}
			</div>
			{props.homework.desc.trim() != "" && <i class="hwDescIcon fa fa-align-left" title="This homework has a description"></i>}
		</div>;
	}
}

export default HomeworkItem;