import "calendar/CalendarPage.styl";

import { h, Component } from "preact";

import moment from "moment";

import api from "api.js";

import CalendarMonth from "calendar/CalendarMonth.jsx";
import CalendarWeek from "calendar/CalendarWeek.jsx";

import DateHeader from "ui/DateHeader.jsx";

export default class CalendarPage extends Component {
	constructor(props) {
		super(props);
		this.blankView = {
			providers: [],
			schoolsToUpdate: [],
			days: []
		};
		for (var i = 0; i < 35; i++) {
			this.blankView.days.push({
				day: "",
				announcements: [],
				events: []
			});
		}

		this.state = {
			type: "week"
		};
	}

	componentDidMount() {
		var mondayDate = moment();
		while (mondayDate.day() != 1) {
			mondayDate.subtract(1, "day");
		}

		this.loadWeek(mondayDate);
	}

	loadWeek(monday) {
		this.setState({
			loadingEvents: true,
			type: "week",
			view: this.blankView,
			start: monday
		}, () => {
			api.get("calendar/getView", {
				start: monday.format("YYYY-MM-DD"),
				end: moment(monday).add(7, "days").format("YYYY-MM-DD")
			}, (data) => {
				this.setState({
					loadingEvents: false,
					view: data.view
				});
			});
		});
	}

	loadMonth(start) {
		this.setState({
			loadingEvents: true,
			type: "month",
			view: this.blankView,
			start: start
		}, () => {
			api.get("calendar/getView", {
				start: moment(start).subtract(7, "days").format("YYYY-MM-DD"),
				end: moment(start).add(1, "month").add(7, "days").format("YYYY-MM-DD")
			}, (data) => {
				this.setState({
					loadingEvents: false,
					view: data.view
				});
			});
		});
	}

	switchType(type) {
		if (type == "month") {
			this.loadMonth(moment(this.state.start).date(1));
		} else if (type == "week") {
			var mondayOfWeek = moment(this.state.start);
			while (mondayOfWeek.day() != 1) {
				mondayOfWeek.subtract(1, "day");
			}
			this.loadWeek(mondayOfWeek);
		}
	}

	updateSchool(school) {
		this.props.openModal("enroll", {
			email: school.emailAddress,
			reenroll: true
		});
	}

	render(props, state) {
		return <div class="calendarPage">
			{state.start && <DateHeader showTypeSwitcher switchType={this.switchType.bind(this)} type={state.type} start={state.start} loadMonth={this.loadMonth.bind(this)} loadWeek={this.loadWeek.bind(this)} loadingEvents={state.loadingEvents} />}
			{state.view && state.view.schoolsToUpdate.map((schoolToUpdate) => {
				return <div class="calendarPageAlert alert alert-warning">
					Your schedule data for <strong>{schoolToUpdate.displayName}</strong> needs to be updated. <button class="btn btn-primary" onClick={this.updateSchool.bind(this, schoolToUpdate)}>Update</button>
				</div>;
			})}
			{state.start && state.type == "week" && <CalendarWeek openModal={props.openModal} view={state.view} monday={state.start} />}
			{state.start && state.type == "month" && <CalendarMonth openModal={props.openModal} view={state.view} start={state.start} />}
		</div>;
	}
};