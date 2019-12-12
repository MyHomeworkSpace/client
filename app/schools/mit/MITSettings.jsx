import "schools/mit/MITSettings.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import MITClassSections from "schools/mit/settings/MITClassSections.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class MITSettings extends Component {
	componentWillMount() {
		this.setState({
			registration: this.props.currentSettings.registration
		});
	}

	setSectionForSubject(subjectID, sectionCode) {
		var subjectIndex = -1;
		this.state.registration.forEach(function(registeredClass, i) {
			if (registeredClass.subjectID == subjectID) {
				subjectIndex = i;
			}
		});

		var sectionType = sectionCode[0];
		var selectedSections = this.state.registration[subjectIndex].selectedSections;
		var selectedSectionsList = (selectedSections == "" ? [] : selectedSections.split(","));

		for (var i = 0; i < selectedSectionsList.length; i++) {
			if (selectedSectionsList[i][0] == sectionType) {
				selectedSectionsList.splice(i, 1);
				i--;
			}
		}

		if (sectionCode != sectionType + "NONE") {
			selectedSectionsList.push(sectionCode);
		}

		var newSelectedSectionsText = selectedSectionsList.join(",");

		var newRegistration = this.state.registration;
		newRegistration[subjectIndex].selectedSections = newSelectedSectionsText;

		this.setState({
			registration: newRegistration
		});
	}

	save() {
		var that = this;

		var settings = {
			sections: {}
		};

		for (var i in this.state.registration) {
			settings.sections[this.state.registration[i].subjectID] = this.state.registration[i].selectedSections;
		}

		this.setState({
			loading: true
		}, function() {
			api.post("schools/settings/set", {
				school: "mit",
				settings: JSON.stringify(settings)
			}, function(data) {
				if (data.status == "ok") {
					that.props.closeModal();
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	render(props, state) {
		var that = this;

		if (state.loading) {
			return <div>
				<div class="modal-body">
					<LoadingIndicator /> Loading, please wait...
				</div>
			</div>;
		}

		return <div>
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				{state.registration.map(function(registeredClass) {
					return <MITClassSections registeredClass={registeredClass} setSectionForSubject={that.setSectionForSubject.bind(that)} />;
				})}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={props.closeModal}>Close without saving</button>
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
			</div>
		</div>;
	}
};