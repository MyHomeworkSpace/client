import "calendar/CalendarPage.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import CalendarWeek from "calendar/CalendarWeek.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class CalendarPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	componentWillMount() {
		var that = this;
		api.get("calendar/getStatus", {}, function(xhr) {
			if (xhr.responseJSON.status == 1) {
				that.setState({
					loading: false,
					enabled: true,
					askingPassword: false
				});
			} else {
				that.loadSchedule.bind(that)();
			}
		});
	}

	loadSchedule() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.get("calendar/getSchedule", {}, function(xhr) {
				that.setState({
					loading: false,
					enabled: true,
					terms: xhr.responseJSON.terms,
					items: xhr.responseJSON.items
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
			}, function(xhr) {
				if (xhr.responseJSON.status == "ok") {
					that.loadSchedule.bind(that)();
				} else {
					that.setState({
						askingPasswordLoading: false,
						error: errors.getFriendlyString(xhr.responseJSON.error)
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

		/*[
			[],
			[ { name: "Some class", instructor: "Some teacher", start: "09:00:00", end: "09:45:00", term: "Semester 1", period: "D" } ],
			[ { name: "Some class", instructor: "Some teacher", start: "13:05:00", end: "13:50:00", term: "Semester 1", period: "D" } ],
			[ { name: "Some class", instructor: "Some teacher", start: "10:10:00", end: "10:55:00", term: "Semester 1", period: "D" }, { name: "Some class", instructor: "Some teacher", start: "11:00:00", end: "11:45:00", term: "Semester 1", period: "C" } ],
			[],
			[ { name: "Some class", instructor: "Some teacher", start: "09:00:00", end: "09:45:00", term: "Semester 1", period: "D" } ],
			[],
			[]
		]*/

		var currentTermId = state.terms[0].termId;
		var schedule = {};
		state.items.filter(function(item) {
			return item.termId == currentTermId;
		}).forEach(function(item) {
			if (!schedule[item.dayNumber]) {
				schedule[item.dayNumber] = [];
			}
			schedule[item.dayNumber].push(item);
		});

		console.log(schedule);

		return <div style="height: 100%">
			<CalendarWeek schedule={schedule} />
		</div>;
	}
}

export default CalendarPage;