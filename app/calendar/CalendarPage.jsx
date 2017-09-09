import "calendar/CalendarPage.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import CalendarHeader from "calendar/CalendarHeader.jsx";
import CalendarWeek from "calendar/CalendarWeek.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class CalendarPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			announcements: [],
			currentTerm: null,
			events: [],
			hwEvents: [],
			scheduleEvents: null,
			terms: []
		};
	}

	componentWillMount() {
		var that = this;
		api.get("calendar/getStatus", {}, function(xhr) {
			if (xhr.responseJSON.statusNum == 1) {
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
			loadingWeek: true,
			announcements: [],
			currentTerm: null,
			events: [],
			hwEvents: [],
			scheduleEvents: null,
			monday: monday
		}, function() {
			api.get("calendar/events/getWeek/" + monday.format("YYYY-MM-DD"), {}, function(xhr) {
				that.setState({
					loadingWeek: false,
					announcements: xhr.responseJSON.announcements,
					currentTerm: xhr.responseJSON.currentTerm,
					events: xhr.responseJSON.events,
					hwEvents: xhr.responseJSON.hwEvents,
					scheduleEvents: xhr.responseJSON.scheduleEvents,
					friday: xhr.responseJSON.friday.index == -1 ? null : xhr.responseJSON.friday
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

		var emptySchedule =  [[], [], [], [], []];
		var schedule = [[], [], [], [], []];

		var schoolInSession = (state.currentTerm != null);

		if (schoolInSession && state.scheduleEvents) {
			schedule = state.scheduleEvents;
		}

		return <div style="height: 100%">
			<CalendarHeader openModal={props.openModal} announcements={state.announcements} events={state.events} hwEvents={state.hwEvents} monday={state.monday} friday={state.friday} loadWeek={this.loadWeek.bind(this)} loadingWeek={state.loadingWeek} />
			<CalendarWeek openModal={props.openModal} announcements={state.announcements} events={state.events} hwEvents={state.hwEvents} monday={state.monday} friday={state.friday} schedule={state.loadingWeek ? emptySchedule : schedule} />
		</div>;
	}
}

export default CalendarPage;