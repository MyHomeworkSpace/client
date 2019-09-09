import "calendar/CalendarPage.styl";

import { h, Component } from "preact";

import moment from "moment";

import api from "api.js";

import CalendarMonth from "calendar/CalendarMonth.jsx";
import CalendarWeek from "calendar/CalendarWeek.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import DateHeader from "ui/DateHeader.jsx";

class CalendarPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			type: "week"
		};
	}

	componentWillMount() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var mondayDate = moment();
			while (mondayDate.day() != 1) {
				mondayDate.subtract(1, "day");
			}
			that.setState({
				loading: false,
				monday: mondayDate
			}, function() {
				that.loadWeek.bind(that, mondayDate)();
			});
		});
	}

	loadWeek(monday) {
		var that = this;
		this.setState({
			loadingEvents: true,
			type: "week",
			view: null,
			start: monday
		}, function() {
			api.get("calendar/getView", {
				start: monday.format("YYYY-MM-DD"),
				end: moment(monday).add(7, "days").format("YYYY-MM-DD")
			}, function(data) {
				that.setState({
					loadingEvents: false,
					view: data.view
				});
			});
		});
	}

	loadMonth(start) {
		var that = this;
		this.setState({
			loadingEvents: true,
			type: "month",
			view: null,
			start: start
		}, function() {
			api.get("calendar/getView", {
				start: moment(start).subtract(7, "days").format("YYYY-MM-DD"),
				end: moment(start).add(1, "month").add(7, "days").format("YYYY-MM-DD")
			}, function(data) {
				that.setState({
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
		var that = this;

		if (state.loading) {
			return <div><LoadingIndicator type="inline" /> Loading, please wait...</div>;
		}

		return <div class="calendarPage">
			<DateHeader showTypeSwitcher switchType={this.switchType.bind(this)} type={state.type} start={state.start} loadMonth={this.loadMonth.bind(this)} loadWeek={this.loadWeek.bind(this)} loadingEvents={state.loadingEvents} />
			{state.view && state.view.schoolsToUpdate.map(function(schoolToUpdate) {
				return <div class="calendarPageAlert alert alert-warning">
					Your schedule data for <strong>{schoolToUpdate.displayName}</strong> needs to be updated. <button class="btn btn-primary" onClick={that.updateSchool.bind(that, schoolToUpdate)}>Update</button>
				</div>;
			})}
			{state.type == "week" && <CalendarWeek openModal={props.openModal} view={state.view} monday={state.start} />}
			{state.type == "month" && <CalendarMonth openModal={props.openModal} view={state.view} start={state.start} />}
		</div>;
	}
}

export default CalendarPage;