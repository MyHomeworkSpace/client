import "ui/TimePickerPopup.styl";

import { h, Component } from "preact";

import moment from "moment";

export default class TimePickerPopup extends Component {
	componentDidMount() {
		let showDuration = !!this.props.suggestStart;

		if (showDuration) {
			// we're an end time picker, so calculate 
			let offset = this.props.time.diff(this.props.suggestStart, "minutes") / 15;
			this._popup.scrollTop = Math.max(0, (offset * 24) - 45);
		} else {
			// we're a start time picker, so selected time is always in the center
			this._popup.scrollTop = Math.max(0, (this._popup.scrollHeight / 2) - 45);
		}
	}

	getSuggestionBase() {
		let suggestionBase;
		if (this.props.suggestStart) {
			suggestionBase = this.props.suggestStart;
		} else {
			suggestionBase = this.props.time;
		}
		return suggestionBase;
	}

	mouseDownSuggestion(e) {
		e.preventDefault();
		return false;
	}

	clickSuggestion(offset) {
		let selectedTime = moment(this.getSuggestionBase()).add(offset, "minutes");
		this.props.selectTime(selectedTime);
		this.props.setOpen(false);
	}

	render(props, state) {
		let suggestionBase = this.getSuggestionBase();
		let showDuration = !!props.suggestStart;

		let offsets = [];

		if (!showDuration) {
			offsets = offsets.concat([
				-120, -105, -90, -75,
				-60, -45, -30, -15,
				0
			]);
		}
		offsets = offsets.concat([
			15, 30, 45, 60,
			75, 90, 105, 120
		]);
		if (showDuration) {
			offsets = offsets.concat([
				135, 150, 165, 180,
				195, 210, 225, 240
			]);
		}

		return <div class="timePickerPopup" ref={ (popup) => {
			this._popup = popup;
		}}>
			{offsets.map((offset) => {
				let momentTime = moment(suggestionBase).add(offset, "minutes");

				let durationDisplay = "";
				if (showDuration) {
					let durationMinutes = momentTime.diff(suggestionBase, "minutes");

					let durationHoursDisplay = Math.floor(durationMinutes / 60);
					let durationMinutesDisplay = durationMinutes % 60;

					if (durationHoursDisplay != 0) {
						durationDisplay = durationHoursDisplay + " hr" + (durationHoursDisplay > 1 ? "s" : "") + (durationMinutesDisplay > 0 ? " " + durationMinutesDisplay + " min" : "");
					} else {
						durationDisplay = durationMinutesDisplay + " min";
					}
				}

				return <div class="timePickerPopupSuggestion" onMouseDown={this.mouseDownSuggestion.bind(this)} onClick={this.clickSuggestion.bind(this, offset)}>
					{momentTime.format("h:mm a")}
					{showDuration && <span class="timePickerPopupSuggestionDuration">
						({durationDisplay})
					</span>}
				</div>;
			})}
		</div>;
	}
};