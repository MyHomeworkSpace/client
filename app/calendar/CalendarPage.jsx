import "calendar/CalendarPage.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import CalendarMonth from "calendar/CalendarMonth.jsx";
import CalendarWeek from "calendar/CalendarWeek.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import DateHeader from "ui/DateHeader.jsx";

class CalendarPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			terms: [],
			type: "week"
		};
	}

	componentWillMount() {
		var that = this;
		api.get("calendar/getStatus", {}, function(data) {
			if (data.statusNum == 1) {
				that.loadSchedule.bind(that)();
			} else {
				that.setState({
					loading: false,
					enabled: false,
					askingPassword: false
				});
			}
		});
	}

	loadSchedule() {
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
				enabled: true,
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

	getStarted() {
		this.setState({
			askingPassword: true,
			password: ""
		}, function() {
			document.querySelector(".calendarPageWelcome .form-control").focus();
		});
	}

	confirmPassword() {
		var that = this;
		this.setState({
			askingPasswordLoading: true,
			error: ""
		}, function() {
			api.post("calendar/import", {
				password: that.state.password
			}, function(data) {
				if (data.status == "ok") {
					that.loadSchedule.bind(that)();
				} else {
					that.setState({
						askingPasswordLoading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			}, 100);
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.confirmPassword();
		}
	}

	switchType(type) {
		this.setState({
			type: type
		}, function() {
			if (type == "month") {
				this.loadMonth(moment(this.state.start).date(1));
			} else if (type == "week") {
				var mondayOfWeek = moment(this.state.start);
				while (mondayOfWeek.day() != 1) {
					mondayOfWeek.subtract(1, "day");
				}
				this.loadWeek(this.mondayOfWeek);
			}
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div><LoadingIndicator type="inline" /> Loading, please wait...</div>;
		}
		if (!state.enabled) {
			if (state.askingPassword) {
				return <div>
					<div class="calendarPageWelcome">
						<h2>Confirm Dalton password</h2>
						{state.error && <div class="alert alert-danger">{state.error}</div>}
						{state.askingPasswordLoading && <div><LoadingIndicator type="inline" /> Fetching schedule, please wait...</div>}
						{!state.askingPasswordLoading && <h4>To get your schedule, please enter your Dalton account password.</h4>}
						{!state.askingPasswordLoading && <input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} />}
						{!state.askingPasswordLoading && <button class="btn btn-primary btn-lg" onClick={this.confirmPassword.bind(this)}>Get schedule <i class="fa fa-arrow-right"></i></button>}
					</div>
				</div>;
			} else {
				return <div>
					<div class="calendarPageWelcome">
						<h2>Calendar</h2>
						<h4>The Calendar allows you to plan out when you will do your homework, tests, quizzes, and other events.</h4>
						<button class="btn btn-primary btn-lg" onClick={this.getStarted.bind(this)}>Get started <i class="fa fa-arrow-right"></i></button>
					</div>
				</div>;
			}
		}

		return <div class="calendarPage">
			<DateHeader showTypeSwitcher switchType={this.switchType.bind(this)} type={state.type} start={state.start} loadMonth={this.loadMonth.bind(this)} loadWeek={this.loadWeek.bind(this)} loadingEvents={state.loadingEvents} />
			{state.type == "week" && <CalendarWeek openModal={props.openModal} view={state.view} monday={state.start} />}
			{state.type == "month" && <CalendarMonth openModal={props.openModal} view={state.view} start={state.start} />}
		</div>;
	}
}

export default CalendarPage;