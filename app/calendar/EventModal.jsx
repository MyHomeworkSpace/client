import "calendar/EventModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import api from "api.js";
import consts from "consts.js";
import errors from "errors.js";

import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import HomeworkPicker from "ui/HomeworkPicker.jsx";
import Modal from "ui/Modal.jsx";
import TimePicker from "ui/TimePicker.jsx";

export default class EventModal extends Component {
	constructor(props) {
		super(props);

		if (props.modalState.tags) {
			if (props.modalState.tags[consts.EVENT_TAG_ORIGINAL_START]) {
				props.modalState.start = props.modalState.tags[consts.EVENT_TAG_ORIGINAL_START];
			}
			if (props.modalState.tags[consts.EVENT_TAG_ORIGINAL_END]) {
				props.modalState.end = props.modalState.tags[consts.EVENT_TAG_ORIGINAL_END];
			}
		}

		var isNew = (props.modalState.id ? false : true);
		var startTime = (isNew ? moment().second(0) : moment.unix(props.modalState.start));
		var endTime = (isNew ? moment().second(0).add(30, "minutes") : moment.unix(props.modalState.end));

		if (isNew) {
			// round the time to a 15-minute interval
			while (startTime.minute() % 15 != 0) {
				startTime.add(1, "minute");
			}
			endTime = moment(startTime).add(30, "minutes");
		}

		var recurRule = props.modalState.recurRule;
		var recurUntil = null;
		if (recurRule) {
			if (recurRule.until != "") {
				recurUntil = moment(recurRule.until, "YYYY-MM-DD");
			}
		}

		var type = props.modalState.type;

		if (!type) {
			type = consts.EVENT_TYPE_PLAIN;

			if (props.modalState.tags[consts.EVENT_TAG_HOMEWORK]) {
				type = consts.EVENT_TYPE_HOMEWORK;
			} else if (props.modalState.tags[consts.EVENT_TAG_CLASS_ID]) {
				type = consts.EVENT_TYPE_SCHEDULE;
			}
		}

		var descriptionMinHeight = null;
		if (!isNew && props.modalState.tags[consts.EVENT_TAG_DESCRIPTION]) {
			var lineCount = props.modalState.tags[consts.EVENT_TAG_DESCRIPTION].split("\n").length;
			// set a min height for the description textbox
			if (lineCount > 3) {
				descriptionMinHeight = (lineCount * 14 * 1.5) + 14;
			}
		}

		this.state = {
			isNew: isNew,
			type: type,

			name: (isNew ? "" : props.modalState.name),
			location: ((isNew || !props.modalState.tags[consts.EVENT_TAG_LOCATION]) ? "" : props.modalState.tags[consts.EVENT_TAG_LOCATION]),
			description: ((isNew || !props.modalState.tags[consts.EVENT_TAG_DESCRIPTION]) ? "" : props.modalState.tags[consts.EVENT_TAG_DESCRIPTION]),

			homework: (props.modalState.tags && props.modalState.tags[consts.EVENT_TAG_HOMEWORK]) || null,

			recurRule: recurRule,
			recurUntil: recurUntil,
			recur: !!recurRule,

			startDate: (isNew ? moment().second(0) : moment.unix(props.modalState.start)),
			startTime: startTime,
			endDate: (isNew ? moment().second(0).add(30, "minutes") : moment.unix(props.modalState.end)),
			endTime: endTime,

			descriptionMinHeight: descriptionMinHeight
		};
	}

	combinedMoment(type, state) {
		var stateToTest = state || this.state;

		var date = stateToTest[type + "Date"];
		var time = stateToTest[type + "Time"];

		var combined = moment(date);
		combined = combined.minute(time.minute()).hour(time.hour());

		return combined;
	}

	save() {
		if (this.state.type == consts.EVENT_TYPE_HOMEWORK) {
			if (!this.state.homework.id) {
				this.setState({
					error: "You must select a homework item.",
				});
				return;
			}
		} else if (this.state.type == consts.EVENT_TYPE_PLAIN) {
			if (this.state.name == "") {
				this.setState({
					error: "You must give the event a name.",
				});
				return;
			}
		}

		this.setState({
			error: "",
			loading: true
		}, () => {
			var start = this.combinedMoment("start");
			var end = this.combinedMoment("end");

			var eventInfo = {
				name: this.state.name,
				start: start.unix(),
				end: end.unix(),
				location: this.state.location,
				desc: this.state.description
			};
			if (!this.state.isNew) {
				eventInfo.id = this.props.modalState.id;
			}
			if (this.state.type == consts.EVENT_TYPE_HOMEWORK) {
				eventInfo["homeworkId"] = this.state.homework.id;
			}

			eventInfo["recur"] = this.state.recur;

			if (this.state.recur) {
				var recurRule = this.state.recurRule;
				recurRule.until = moment(this.state.recurUntil).format("YYYY-MM-DD");

				eventInfo["recurFrequency"] = recurRule.frequency;
				eventInfo["recurInterval"] = recurRule.interval;
				if (this.state.recurUntil) {
					eventInfo["recurUntil"] = recurRule.until;
				}
			}

			var endpointType = (this.state.type == consts.EVENT_TYPE_HOMEWORK ? "hwEvents" : "events");

			api.post((this.state.isNew ? `calendar/${endpointType}/add` : `calendar/${endpointType}/edit`), eventInfo, (data) => {
				if (data.status == "ok") {
					this.props.openModal("");
					// TODO: this is an incredibly ugly hack that works until more of the app is using preact
					document.querySelector("#calendar .dateHeaderControlsRefresh").click();
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	delete() {
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, () => {
				var endpointType = (this.state.type == consts.EVENT_TYPE_HOMEWORK ? "hwEvents" : "events");
				api.post(`calendar/${endpointType}/delete`, {
					id: this.props.modalState.id
				}, () => {
					this.props.openModal("");
					// TODO: this is an incredibly ugly hack that works until more of the app is using preact
					document.querySelector("#calendar .dateHeaderControlsRefresh").click();
				});
			});
		}
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.save();
		}
	}

	pickerChange(type, date) {
		var newState = {};
		var mergedState = {};
		newState[type] = date;

		for (var key in this.state) {
			mergedState[key] = this.state[key];
		}

		mergedState[type] = date;

		// have we changed the start date/time?
		if (type == "startDate" || type == "startTime") {
			var oldStart = this.combinedMoment("start", this.state);
			var oldEnd = this.combinedMoment("end", this.state);
			var differenceToOld = oldEnd.diff(oldStart, "minutes");

			var newEndTime = moment(date).add(differenceToOld, "minutes");
			var newEndDate = moment(newEndTime).startOf("day");

			newState["endDate"] = newEndDate;
			mergedState["endDate"] = newEndDate;
			newState["endTime"] = newEndTime;
			mergedState["endTime"] = newEndTime;
		}

		// check if we've tried to set an end date before the start date
		if (this.combinedMoment("end", mergedState).isBefore(this.combinedMoment("start", mergedState))) {
			// if so, reset the end date to the start date
			newState.endDate = moment(mergedState.startDate);
			newState.endTime = moment(mergedState.startTime);
		}

		this.setState(newState);
	}

	onRecurChange(e) {
		if (e.target.checked) {
			// enable it
			var newRule = this.state.recurRule || {
				frequency: consts.RECUR_FREQUENCY_DAILY,
				interval: 1,
				until: null
			};
			this.setState({
				recur: true,
				recurRule: newRule,
				recurUntil: (newRule.until ? moment(newRule.until, "YYYY-MM-DD") : null)
			});
		} else {
			// disable it
			this.setState({
				recur: false
			});
		}
	}

	addRecurEnd() {
		var newRule = this.state.recurRule;
		newRule.until = moment(this.state.startDate).format("YYYY-MM-DD");
		this.setState({
			recurRule: newRule,
			recurUntil: moment(this.state.startDate)
		});
	}

	removeRecurEnd() {
		// hack: setTimeout because otherwise it triggers another click event for some dumb reason that I don't understand
		setTimeout(() => {
			var newRule = this.state.recurRule;
			newRule.until = null;
			this.setState({
				recurRule: newRule,
				recurUntil: null
			});
		}, 0);
	}

	render(props, state) {
		if (state.loading) {
			return <Modal title={(state.isNew ? "Add event" : "Edit event")} openModal={props.openModal} noClose class="eventModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		return <Modal title={(state.isNew ? "Add event" : "Edit event")} openModal={props.openModal} class="eventModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				{state.type == consts.EVENT_TYPE_PLAIN && <input type="text" class="form-control eventModalName" placeholder="Name" value={state.name} onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} />}

				{state.type == consts.EVENT_TYPE_HOMEWORK && <HomeworkPicker value={state.homework} change={this.pickerChange.bind(this, "homework")} />}

				<div class="row">
					<div class="col-md-1 eventModalLabel">Start</div>
					<div class="col-md-10 eventModalData">
						<DatePicker value={state.startDate} change={this.pickerChange.bind(this, "startDate")} />
						<TimePicker value={state.startTime} change={this.pickerChange.bind(this, "startTime")} />
					</div>
				</div>

				<div class="row">
					<div class="col-md-1 eventModalLabel">End</div>
					<div class="col-md-10 eventModalData">
						<DatePicker value={state.endDate} change={this.pickerChange.bind(this, "endDate")} />
						<TimePicker value={state.endTime} change={this.pickerChange.bind(this, "endTime")} suggestStart={state.startTime} />
					</div>
				</div>

				{state.type == consts.EVENT_TYPE_PLAIN && <div class="row">
					<div class="col-md-1 eventModalLabel">Repeat</div>
					<div class={`col-md-10 eventModalData eventModalRepeat ${state.recur ? "open" : ""}`}>
						<div class="row">
							<div class="col-md-1 eventModalRepeatCheckbox">
								<input type="checkbox" checked={state.recur} onChange={this.onRecurChange.bind(this)} />
							</div>
							{state.recur && <div class="col-md-11">
								<div>
									every
									<input type="number" value={state.recurRule.interval} min={1} onChange={linkState(this, "recurRule.interval")} />
									<select value={state.recurRule.frequency} onChange={linkState(this, "recurRule.frequency")}>
										{[
											["day", consts.RECUR_FREQUENCY_DAILY],
											["week", consts.RECUR_FREQUENCY_WEEKLY],
											["month", consts.RECUR_FREQUENCY_MONTHLY],
											["year", consts.RECUR_FREQUENCY_YEARLY]
										].map(function(pair) {
											var label = pair[0];
											var value = pair[1];
											return <option value={value}>{label}{state.recurRule.interval > 1 ? "s" : ""}</option>;
										})}
									</select>
								</div>
								<div>
									<div class="eventModalRepeatAlign">until</div>
									{!state.recurUntil && <div class="eventModalRepeatAction" onClick={this.addRecurEnd.bind(this)}>forever</div>}
									{state.recurUntil && <div class="eventModalRepeatUntil">
										<DatePicker value={state.recurUntil} change={this.pickerChange.bind(this, "recurUntil")} />
										<div class="eventModalRepeatAlign eventModalRepeatAction" onClick={this.removeRecurEnd.bind(this)}>remove end date</div>
									</div>}
								</div>
							</div>}
						</div>
					</div>
				</div>}

				<input type="text" class="form-control eventModalLocation" placeholder="Location" value={state.location} onKeyup={this.keyup.bind(this)} onChange={linkState(this, "location")} />

				<textarea class="form-control eventModalDescription" placeholder="Description" value={state.description} onChange={linkState(this, "description")} style={state.descriptionMinHeight ? `min-height: ${state.descriptionMinHeight}px;` : ""} />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
};