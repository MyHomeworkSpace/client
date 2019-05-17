import "planner/PlannerHomeworkItem.styl";

import { h, Component } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";

export default class PlannerHomeworkItem extends Component {
	toggle() {
		this.props.setDone(this.props.homeworkItem.id, !(this.props.homeworkItem.complete == 1));
	}

	edit() {
		this.props.openModal("homework", this.props.homeworkItem);
	}

	render(props, state) {
		var done = (props.homeworkItem.complete == 1);
		return <div class={`plannerHomeworkItem ${done ? "done": ""}`}>
			<HomeworkName name={props.homeworkItem.name} />
			<div class="plannerHomeworkActions">
				<i class={`fa ${done ? "fa-check-circle-o" : "fa-circle-o"}`} onClick={this.toggle.bind(this)} />
				<i class="fa fa-edit" onClick={this.edit.bind(this)} />
			</div>
		</div>;
	}
};