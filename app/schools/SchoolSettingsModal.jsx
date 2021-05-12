import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import DaltonSettings from "schools/dalton/DaltonSettings.jsx";
import MITSettings from "schools/mit/MITSettings.jsx";
import CornellSettings from "schools/cornell/CornellSettings.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

let settingsComponents = {
	dalton: DaltonSettings,
	mit: MITSettings,
	cornell: CornellSettings
};

export default class SchoolSettingsModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: "",

			currentSettings: null
		};
	}

	componentDidMount() {
		api.get("schools/settings/get", {
			school: this.props.modalState.school.schoolID
		}, (data) => {
			if (data.status == "ok") {
				this.setState({
					loading: false,
					currentSettings: data.settings
				});
			} else {
				this.setState({
					loading: false,
					error: errors.getFriendlyString(data.error)
				});
			}
		});
	}

	closeModal() {
		this.props.openModal("");
		if (this.props.modalState.onSuccess) {
			this.props.modalState.onSuccess();
		}
	}

	render(props, state) {
		let school = props.modalState.school;
		let title = "Settings for " + school.displayName;

		if (state.loading) {
			return <Modal title={title} openModal={props.openModal} noClose class="schoolSettingsModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		if (state.error) {
			return <Modal title={title} openModal={props.openModal} noClose class="schoolSettingsModal">
				<div class="modal-body">
					<div class="alert alert-danger">{state.error}</div>
				</div>
			</Modal>;
		}

		let settingComponent = settingsComponents[school.schoolID];

		return <Modal title={title} openModal={props.openModal} noClose class="schoolSettingsModal">
			{h(settingComponent, {
				currentSettings: state.currentSettings,

				closeModal: this.closeModal.bind(this)
			})}
		</Modal>;
	}
};