import "calendar/EventModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import HomeworkPicker from "ui/HomeworkPicker.jsx";
import Modal from "ui/Modal.jsx";
import TimePicker from "ui/TimePicker.jsx";

class EventModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			type: props.modalState.type || "event",

			name: (isNew ? "" : props.modalState.name),
			description: (isNew ? "" : props.modalState.desc),

			homework: props.modalState.homework,

			startDate: (isNew ? moment().second(0) : moment.unix(props.modalState.start)),
			startTime: (isNew ? moment().second(0) : moment.unix(props.modalState.start)),
			endDate: (isNew ? moment().second(0) : moment.unix(props.modalState.end)),
			endTime: (isNew ? moment().second(0) : moment.unix(props.modalState.end))
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
		var that = this;

		if (this.state.type == "homework") {
			if (!this.state.homework.id) {
				this.setState({
					error: "You must select a homework item.",
				});
				return;
			}
		}

		this.setState({
			error: "",
			loading: true
		}, function() {
			var start = this.combinedMoment("start");
			var end = this.combinedMoment("end");

			var eventInfo = {
				name: this.state.name,
				start: start.unix(),
				end: end.unix(),
				desc: this.state.description
			};
			if (!that.state.isNew) {
				eventInfo.id = this.props.modalState.id;
			}
			if (this.state.type == "homework") {
				eventInfo["homeworkId"] = this.state.homework.id;
			}

			var endpointType = (this.state.type == "homework" ? "hwEvents" : "events");

			api.post((that.state.isNew ? `calendar/${endpointType}/add` : `calendar/${endpointType}/edit`), eventInfo, function(xhr) {
				if (xhr.responseJSON.status == "ok") {
					that.props.openModal("");
					// TODO: this is an incredibly ugly hack that works until more of the app is using preact
					document.querySelector(".calendarHeaderControlsRefresh").click();
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(xhr.responseJSON.error)
					});
				}
			});
		});
	}

	delete() {
		var that = this;
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, function() {
				var endpointType = (this.state.type == "homework" ? "hwEvents" : "events");
				api.post(`calendar/${endpointType}/delete`, {
					id: that.props.modalState.id
				}, function() {
					that.props.openModal("");
					// TODO: this is an incredibly ugly hack that works until more of the app is using preact
					document.querySelector(".calendarHeaderControlsRefresh").click();
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

		// have we changed the start time?
		if (type == "startTime") {
			var oldStart = this.combinedMoment("start", this.state);
			var oldEnd = this.combinedMoment("end", this.state);
			var differenceToOld = oldEnd.diff(oldStart, "minutes");
			var newEnd = moment(date).add(differenceToOld, "minutes");
			newState["endTime"] = newEnd;
			mergedState["endTime"] = newEnd;
		}

		// check if we've tried to set an end date before the start date
		if (this.combinedMoment("end", mergedState).isBefore(this.combinedMoment("start", mergedState))) {
			// if so, reset the end date to the start date
			newState.endDate = moment(mergedState.startDate);
			newState.endTime = moment(mergedState.startTime);
		}

		this.setState(newState);
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

				{state.type == "event" && <input type="text" class="form-control eventModalName" placeholder="Name" value={state.name} onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} />}

				{state.type == "homework" && <HomeworkPicker value={state.homework} change={this.pickerChange.bind(this, "homework")} />}

				<div class="row">
					<div class="col-md-1 eventModalLabel">Start</div>
					<div class="col-md-9 eventModalData">
						<DatePicker value={state.startDate} change={this.pickerChange.bind(this, "startDate")} />
						<TimePicker value={state.startTime} change={this.pickerChange.bind(this, "startTime")} />
					</div>
				</div>

				<div class="row">
					<div class="col-md-1 eventModalLabel">End</div>
					<div class="col-md-9 eventModalData">
						<DatePicker value={state.endDate} change={this.pickerChange.bind(this, "endDate")} />
						<TimePicker value={state.endTime} change={this.pickerChange.bind(this, "endTime")} />
					</div>
				</div>

				{state.type == "event" && <textarea class="form-control" placeholder="Description" value={state.description} onChange={linkState(this, "description")} />}
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
}

export default EventModal;