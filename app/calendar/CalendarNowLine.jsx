import "calendar/CalendarNowLine.styl";

import { h, Component } from "preact";

import moment from "moment";

export default class CalendarNowLine extends Component {
	constructor(props) {
		super(props);
		this.timer = null;
	}

	render(props, state) {
		return <div class="calendarNowLine" style={`top: ${Math.floor((props.time - moment("00:00:00", "HH:mm:ss").unix()) / 60)}px;`}></div>;
	}
};