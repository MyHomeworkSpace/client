import "calendar/CalendarNowLine.styl";

import { h, Component } from "preact";

class CalendarNowLine extends Component {
	constructor(props) {
		super(props);
		this.timer = null;
		this.state = { time: moment().unix() };
	}

	componentDidMount() {
		var that = this;
		this.timer = setInterval(function() {
			that.setState({
				time: moment().unix()
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	}

	render(props, state) {
		return <div class="calendarNowLine" style={`top: ${Math.floor((state.time - moment("00:00:00", "HH:mm:ss").unix()) / 60)}px;`}></div>;
	}
}

export default CalendarNowLine;