import "schools/mit/MITSettings.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import MITClassSections from "schools/mit/settings/MITClassSections.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class MITSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			registration: props.currentSettings.registration,
			peInfo: props.currentSettings.peInfo,
			showPE: props.currentSettings.showPE
		};
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
		var settings = {
			sections: {},
			showPE: this.state.showPE
		};

		for (var i in this.state.registration) {
			settings.sections[this.state.registration[i].subjectID] = this.state.registration[i].selectedSections;
		}

		this.setState({
			loading: true
		}, () => {
			api.post("schools/settings/set", {
				school: "mit",
				settings: JSON.stringify(settings)
			}, (data) => {
				if (data.status == "ok") {
					this.props.closeModal();
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
		if (state.loading) {
			return <div>
				<div class="modal-body">
					<LoadingIndicator /> Loading, please wait...
				</div>
			</div>;
		}

		return <div>
			<div class="modal-body mitSettings">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				{state.registration.map((registeredClass) => {
					return <MITClassSections registeredClass={registeredClass} setSectionForSubject={this.setSectionForSubject.bind(this)} />;
				})}

				<div>
					<h4 class="mitSettingsInfoTitle">PE registration</h4>
					{state.peInfo && <div>
						<strong>{state.peInfo.sectionID} {state.peInfo.activity} - {state.peInfo.courseTitle}</strong>
						<div>{state.peInfo.rawSchedule}</div>
						<div>{state.peInfo.rawCalendarNotes}</div>
						<label>
							<input type="checkbox" checked={state.showPE} onChange={linkState(this, "showPE")} /> Show this on my schedule
						</label>
					</div>}
					{!state.peInfo && <div>
						It looks like you haven't registered for a PE class this quarter.
						If you think this isn't correct, contact us at <a href="mailto:hello@myhomework.space">hello@myhomework.space</a>.
					</div>}
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={props.closeModal}>Close without saving</button>
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
			</div>
		</div>;
	}
};