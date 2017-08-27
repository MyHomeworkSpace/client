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

	change(type, e) {
		var formatString = (type == "hour" ? "h" : "mm");
		var newThing = parseInt(e.target.value);
		var changedSomething = false;
		var time = moment(this.props.time);
		if (
			!(isNaN(newThing)) &&
			!(newThing < 1) &&
			!(newThing > 12 && type == "hour") &&
			!(newThing > 60 && type == "minute")
		) {
			if (type == "hour") {
				time.hour((time.hour() > 12 ? newThing + 12 : newThing));
				changedSomething = true;
			} else {
				time.minute(newThing);
				changedSomething = true;
			}
		}
		if (changedSomething) {
			this.props.selectTime(time);
		} else {
			// reset the textbox
			e.target.value = this.props.time.format(formatString);
		}
	}

	render(props, state) {
		return <div class="timePickerPopup">
			<div class="row">
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "hour", 1)}><i class="fa fa-chevron-circle-up" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "minute", 1)}><i class="fa fa-chevron-circle-up" /></button>
				</div>
				<div class="col-md-4"></div>
			</div>

			<div class="row timePickerPopupNumberRow">
				<div class="col-md-4">
					<input type="text" class="form-control timePickerPopupNumberInput" value={props.time.format("h")} onChange={this.change.bind(this, "hour")} />
				</div>
				<div class="col-md-4">
					<input type="text" class="form-control timePickerPopupNumberInput" value={props.time.format("mm")} onChange={this.change.bind(this, "minute")} />
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.toggleAMPM.bind(this)}>{props.time.format("a")}</button>
				</div>
			</div>

			<div class="row">
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "hour", -1)}><i class="fa fa-chevron-circle-down" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.action.bind(this, "minute", -1)}><i class="fa fa-chevron-circle-down" /></button>
				</div>
				<div class="col-md-4">
					<button class="btn btn-sm btn-default" onClick={this.now.bind(this)}><i class="fa fa-clock-o" /></button>
				</div>
			</div>
		</div>;
	}
}

export default TimePickerPopup;