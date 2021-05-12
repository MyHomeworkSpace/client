import "classes/ClassDetails.styl";

import { h, Component } from "preact";

import moment from "moment";

import api from "api.js";
import { edit, markComplete } from "homework.js";

import HomeworkItem from "ui/HomeworkItem.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class ClassDetails extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps() {
		this.load();
	}

	load() {
		this.setState({
			loading: true
		}, () => {
			api.get(`homework/getForClass/${this.props.classObject.id}`, {}, (data) => {
				this.setState({
					loading: false,
					homework: data.homework
				});
			});
		});
	}

	editClass() {
		this.props.openModal("class", this.props.classObject);
	}

	swapClass() {
		this.props.openModal("classSwap", this.props.classObject);
	}

	render(props, state) {
		let filteredHomework;
		if (!state.loading) {
			filteredHomework = state.homework.filter(function(item) {
				if (item.name.toLowerCase().startsWith("none") || item.name.toLowerCase().startsWith("nohw")) {
					return false;
				} else if ((moment(item.due).unix() < moment().unix()) && item.complete != 0) {
					return false;
				}
				return true;
			});
		}
		return <div class="classDetails">
			<h1 class="classDetailsName">
				{props.classObject.name}
				{props.classObject.teacher && <span class="lead classTeacher">{props.classObject.teacher}</span>}
			</h1>
			<div class="btn-group classActions" role="group">
				<button class="btn btn-default" onClick={this.editClass.bind(this, props.classObject)}><i class="fa fa-pencil-square"></i> Edit class</button>
				<button class="btn btn-default" onClick={this.swapClass.bind(this, props.classObject)}><i class="fa fa-arrows-v"></i> Swap class</button>
			</div>

			<div>
				{state.loading && <LoadingIndicator />}
				{!state.loading && filteredHomework.map(function(item) {
					return <HomeworkItem
						homework={item}
						classes={MyHomeworkSpace.Classes.list}
						isOverdue={moment(item.due).isBefore(moment(), "day")}
						edit={function(id) {
							edit(id);
						}}
						setComplete={function(id, complete) {
							markComplete(id, (complete ? "1" : "0"));
						}}
					/>;
				})}
				{!state.loading && filteredHomework.length == 0 && <p>You have no upcoming homework in this class.</p>}
			</div>
		</div>;
	}
};