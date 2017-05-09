import "calendar/EventModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

class AddEventModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			name: (isNew ? "" : props.modalState.name),
			teacher: (isNew ? "" : props.modalState.teacher)
		};
	}

	save() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var eventInfo = {
				name: this.state.name,
				teacher: this.state.teacher,
			};
			if (!that.state.isNew) {
				eventInfo.id = this.props.modalState.id;
			}
			api.post((that.state.isNew ? "calendar/events/add" : "calendar/events/edit"), eventInfo, function(xhr) {
				that.props.openModal("");
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
				<input type="text" class="form-control" placeholder="Name" />

				<div>Start</div>
				<DatePicker />

				<div>End</div>
				<DatePicker />

				<textarea class="form-control" placeholder="Description" />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
}

export default AddEventModal;