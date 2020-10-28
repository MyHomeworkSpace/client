import "homework/CalendarRow.styl";

import { h, Component } from "preact";

import moment from "moment";

import api from "api.js";
import errors from "errors.js";

import CalendarEvent from "calendar/CalendarEvent.jsx";

export default class CalendarRow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: "",
			data: {},
			timer: null,
			time: moment().valueOf()
		};
	}

	load() {
		api.get("calendar/getView", {
			start: moment().format("YYYY-MM-DD"),
			end: moment().add(1, "day").format("YYYY-MM-DD")
		}, (data) => {
			if (data.status == "ok") {
				this.setState({
					loading: false,
					data: data
				});
			} else {
				this.setState({
					loading: false,
					error: errors.getFriendlyString(data.error)
				});
			}
		});
	}

	componentDidMount() {
		this.setState({
			timer: setInterval(() => this.setState({ time: moment().valueOf() }), 1000),
		});

		this.load();
	}

	componentWillUnmount() {
		clearInterval(this.state.timer);
	}

	render(props, state) {
		if (state.loading) {
			return <div class="calendarRow">
				<div class="calendarRowTitle">Events today</div>
				<div class="calendarRowEvents">
					Loading...
				</div>
			</div>;
		}

		if (state.error) {
			return <div class="calendarRow">
				<div class="calendarRowTitle">Events today</div>
				<div class="calendarRowEvents">
					<div class="alert alert-danger">{state.error}</div>
				</div>
			</div>;
		}

		const dayData = state.data.view.days[0];
		const now = moment(state.time);
		const nowTimestamp = now.unix();

		if (dayData.events.length == 0) {
			return <div class="calendarRow">
				<div class="calendarRowTitle">Events today</div>
				<div class="noEvents">There's nothing scheduled for today.</div>
			</div>;
		}

		const events = dayData.events
			.sort((a, b) => {
				if (a.start == b.start) {
					if (a.uniqueId < b.uniqueId) {
						return -1;
					}
					if (a.uniqueId > b.uniqueId) {
						return 1;
					}

					return 0;
				}

				return a.start - b.start;
			})
			.filter((event) => nowTimestamp < event.end)
			.map((event, i) => <CalendarEvent relativeTime key={i} type={event.type} item={event} groupIndex={0} groupLength={1} time={state.time} />);

		return <div class="calendarRow">
			<div class="calendarRowTitle">Events today</div>
			<div class="calendarRowEvents">
				{events}
				<div class="noEvents">That's it for today!</div>
			</div>
		</div>;
	}
};