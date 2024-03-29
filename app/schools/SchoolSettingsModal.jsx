import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import DaltonSettings from "schools/dalton/DaltonSettings.jsx";
import MITSettings from "schools/mit/MITSettings.jsx";
import CornellSettings from "schools/cornell/CornellSettings.jsx";
import ColumbiaSettings from "schools/columbia/ColumbiaSettings.jsx";
import BarnardSettings from "schools/barnard/BarnardSettings.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

var settingsComponents = {
	dalton: DaltonSettings,
	mit: MITSettings,
	cornell: CornellSettings,
	columbia: ColumbiaSettings,
	barnard: BarnardSettings
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
		this.loadDetails();
	}

	loadDetails(callback) {
		this.setState({
			loading: true
		}, () => {
			api.get("schools/settings/get", {
				school: this.props.modalState.school.schoolID
			}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						currentSettings: data.settings
					}, () => {
						if (callback) {
							callback();
						}
					});
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	closeModal() {
		this.props.openModal("");
		if (this.props.modalState.onSuccess) {
			this.props.modalState.onSuccess();
		}
	}

	render(props, state) {
		var school = props.modalState.school;
		var title = "Settings for " + school.displayName;

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

		var settingComponent = settingsComponents[school.schoolID];

		return <Modal title={title} openModal={props.openModal} noClose class="schoolSettingsModal">
			{h(settingComponent, {
				currentSettings: state.currentSettings,

				loadDetails: this.loadDetails.bind(this),

				closeModal: this.closeModal.bind(this)
			})}
		</Modal>;
	}
};