import "ui/TimePickerPopup.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

class TimePickerPopup extends Component {
	constructor(props) {
		super(props);
	}

	action(thing, amount) {
		var newTime = moment(this.props.time);
		newTime.add(amount, thing);
		this.props.selectTime(newTime);
	}

	toggleAMPM(thing, amount) {
		var newTime = moment(this.props.time);
		if (newTime.hour() >= 12) {
			newTime.hour(newTime.hour() - 12);
		} else {
			newTime.hour(newTime.hour() + 12);
		}
		this.props.selectTime(newTime);
	}

	now() {
		this.props.selectTime(moment());
	}

	render(props, state) {
		return <div class="timePickerPopup">
			<div class="row">
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "hour", 1)}><i class="fa fa-chevron-up" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "minute", 1)}><i class="fa fa-chevron-up" /></button>
				</div>
				<div class="col-md-4"></div>
			</div>

			<div class="row timePickerPopupNumberRow">
				<div class="col-md-4">
					{props.time.format("h")}
				</div>
				<div class="col-md-4">
					{props.time.format("mm")}
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.toggleAMPM.bind(this)}>{props.time.format("a")}</button>
				</div>
			</div>

			<div class="row">
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "hour", -1)}><i class="fa fa-chevron-down" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "minute", -1)}><i class="fa fa-chevron-down" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.now.bind(this)}><i class="fa fa-clock-o" /></button>
				</div>
			</div>
		</div>;
	}
}

export default TimePickerPopup;