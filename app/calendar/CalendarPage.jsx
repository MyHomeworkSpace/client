import "calendar/CalendarPage.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

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
		// TODO: query server for schedule state when api is implemented
		this.setState({
			loading: false,
			enabled: true,
			askingPassword: false,
			schedule: [
				[],
				[ { name: "Some class", instructor: "Some teacher", start: "09:00:00", end: "09:45:00", term: "Semester 1", period: "D" } ],
				[ { name: "Some class", instructor: "Some teacher", start: "13:05:00", end: "13:50:00", term: "Semester 1", period: "D" } ],
				[ { name: "Some class", instructor: "Some teacher", start: "10:10:00", end: "10:55:00", term: "Semester 1", period: "D" }, { name: "Some class", instructor: "Some teacher", start: "11:00:00", end: "11:45:00", term: "Semester 1", period: "C" } ],
				[],
				[ { name: "Some class", instructor: "Some teacher", start: "09:00:00", end: "09:45:00", term: "Semester 1", period: "D" } ],
				[],
				[]
			]
		});
	}

	getStarted() {
		this.setState({
			askingPassword: true
		}, function() {
			document.querySelector(".calendarPageWelcome .form-control").focus();
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
						<h4>To get your schedule, please enter your Dalton account password.</h4>
						<input type="password" class="form-control" placeholder="Password" />
						<button class="btn btn-primary btn-lg" onClick={this.getStarted.bind(this)}>Get schedule <i class="fa fa-arrow-right"></i></button>
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

		return <div style="height: 100%">
			<CalendarWeek schedule={state.schedule} />
		</div>;
	}
}

export default CalendarPage;