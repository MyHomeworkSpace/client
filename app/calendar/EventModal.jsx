import "calendar/EventModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";
import TimePicker from "ui/TimePicker.jsx";

class EventModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			name: (isNew ? "" : props.modalState.name),

			startDate: (isNew ? moment().second(0) : moment.unix(props.modalState.start)),
			startTime: (isNew ? moment().second(0) : moment.unix(props.modalState.start)),
			endDate: (isNew ? moment().second(0) : moment.unix(props.modalState.end)),
			endTime: (isNew ? moment().second(0) : moment.unix(props.modalState.end)),

			description: (isNew ? "" : props.modalState.desc)
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
			api.post((that.state.isNew ? "calendar/events/add" : "calendar/events/edit"), eventInfo, function(xhr) {
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
				api.post("calendar/events/delete", {
					id: that.props.modalState.id
				}, function() {
					that.props.openModal("");
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
		var mergedState = this.state;
		newState[type] = date;
		mergedState[type] = date;

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

				<input type="text" class="form-control eventModalName" placeholder="Name" value={state.name} onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} />

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

				<textarea class="form-control" placeholder="Description" value={state.description} onChange={linkState(this, "description")} />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
}

export default EventModal;