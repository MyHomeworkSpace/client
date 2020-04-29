import "homework/CalendarRow.styl";

import { h, Component } from "preact";

import api from "api.js";
import moment from "moment";
import CalendarEvent from "calendar/CalendarEvent.jsx";


export default class HomeworkColumn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoaded: false,
			data: {},
			timer: null,
			time: moment().valueOf()
		};

		this.load();
	}

	load() {
		api.get("calendar/getView", {
			start: moment().format("YYYY-MM-DD"),
			end: moment().add(1, "day").format("YYYY-MM-DD")
		}, (data) => {
			this.setState({
				data: data,
				isLoaded: true
			});
		});
	}

	componentDidMount() {
		this.setState({
			timer: setInterval(() => this.setState({ time: moment().valueOf() }), 1000),
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.timer);
	}

	render(props, state) {
		let now = moment(state.time);

		if (!this.state.isLoaded) {
			return <div className="calendarRow">
				<div class="calendarRowTitle">Events today</div>
				<div class="calendarRowEvents">
					Loading...
				</div>
			</div>;
		} else if (state.data.view.days[0].events.length == 0) {
			return <div className="calendarRow">
				<div class="calendarRowTitle">Events today</div>
				<div class="noEvents">There's nothing scheduled for today.</div>
			</div>;
		}

		const events = state.data.view.days[0].events.sort((a, b) => moment.unix(a.start).isAfter(moment.unix(b.start)))
			.filter((event) => now.isBefore(moment.unix(event.end)))
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