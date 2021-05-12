import "calendar/EventProvidedModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import api from "api.js";
import consts from "consts.js";
import errors from "errors.js";

import HomeworkName from "ui/HomeworkName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

export default class EventProvidedModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: "",

			cancel: false
		};
	}

	componentDidMount() {
		api.get("calendar/eventChanges/get", {
			eventID: this.props.modalState.event.uniqueId
		}, (data) => {
			if (data.status == "ok") {
				if (data.eventChange) {
					this.setState({
						loading: false,
						cancel: data.eventChange.cancel
					});
				} else {
					this.setState({
						loading: false
					});
				}
			} else {
				this.setState({
					loading: false,
					error: errors.getFriendlyString(data.error)
				});
			}
		});
	}

	save() {
		this.setState({
			error: "",
			loading: true
		}, () => {
			api.post("calendar/eventChanges/set", {
				eventID: this.props.modalState.event.uniqueId,
				cancel: this.state.cancel
			}, (data) => {
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

	render(props, state) {
		let event = this.props.modalState.event;

		if (state.loading) {
			return <Modal title="Edit event" openModal={props.openModal} noClose class="eventProvidedModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		let start = moment.unix(event.start);
		let end = moment.unix(event.end);

		let startDisplay = start.format("h:mm a");
		let endDisplay = end.format("h:mm a");

		return <Modal title="Edit event" openModal={props.openModal} class="eventProvidedModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<div class="eventProvidedModalName">{event.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={event.tags[consts.EVENT_TAG_HOMEWORK].name} /> : event.name}</div>
				<div class="eventProvidedModalTime">{startDisplay} to {endDisplay}</div>
				{(event.tags[consts.EVENT_TAG_BUILDING_NAME] || event.tags[consts.EVENT_TAG_ROOM_NUMBER]) && <div class="eventProvidedModalLocation">{event.tags[consts.EVENT_TAG_BUILDING_NAME]} {(event.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Library" && event.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Cafeteria" && event.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Theater") ? "Room " : ""}{event.tags[consts.EVENT_TAG_ROOM_NUMBER]}</div>}
				{event.tags[consts.EVENT_TAG_LOCATION] && <div class="eventProvidedModalLocation">{event.tags[consts.EVENT_TAG_LOCATION]}</div>}
				{event.tags[consts.EVENT_TAG_BLOCK] && <div class="eventProvidedModalPeriod">{event.tags[consts.EVENT_TAG_BLOCK]} Period</div>}

				<label>
					<input type="checkbox" checked={state.cancel} onChange={linkState(this, "cancel")} /> Cancel this event
				</label>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
};