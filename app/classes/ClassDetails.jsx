import "classes/ClassDetails.styl";

import { h, Component } from "preact";

import api from "api.js";

import EditClassButton from "classes/EditClassButton.jsx";
import SwapClassButton from "classes/SwapClassButton.jsx";

import HomeworkItem from "homework/HomeworkItem.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class ClassDetails extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.load();
	}

	load() {
		const that = this;
		this.setState({
			loading: true
		}, function () {
			api.get(`homework/getForClass/${this.props.classObject.id}`, null, function (data) {
				that.setState({
					loading: false,
					homework: data.homework
				});
			});
		});
	}

	render(props, state) {
		return <div class="classDetails">
			<h1>{props.classObject.name}</h1>
			{props.classObject.teacher && <p class="lead classTeacher">{props.classObject.teacher}</p>}
			<div class="btn-group classActions" role="group">
				<EditClassButton classItem={props.classObject} openModal={props.openModal} />
				<SwapClassButton classItem={props.classObject} openModal={props.openModal} />
			</div>

			<div>
				{state.loading && <LoadingIndicator />}
				{!state.loading && state.homework.map(function(item) {
					if (item.name.toLowerCase().startsWith("none") || item.name.toLowerCase().startsWith("nohw")) {
						return null;
					} else if ((moment(item.due).unix() < moment().unix()) && item.complete != 0) {
						return null;
					}
					return <HomeworkItem
						homework={item}
						classes={MyHomeworkSpace.Classes.list}
						isOverdue={(moment(item.due).unix() < moment().unix())}
						edit={function(id) {
							MyHomeworkSpace.Pages.homework.edit(id);
						}}
						setComplete={function(id, complete) {
							MyHomeworkSpace.Pages.homework.markComplete(id, (complete ? "1" : "0"));
						}}
					/>;
				})}
				{!state.loading && state.homework.length == 0 && <p>You have no upcoming homework in this class.</p>}
			</div>
		</div>;
	}
}

export default ClassDetails;