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
			loading: false,
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
			loading: true,
			error: ""
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

	addCustomClass() {
		const subjectNumber = prompt("What is the number of the class you want to add? (8.02, 18.01, etc.)");
		if (!subjectNumber) {
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("schools/settings/callMethod", {
				school: "mit",
				methodName: "addCustomClass",
				methodParams: JSON.stringify({
					subjectNumber: subjectNumber
				})
			}, (data) => {
				if (data.status == "ok") {
					this.props.loadDetails(() => {
						this.setState({
							loading: false
						});
					});
				} else if (data.error == "invalid_params") {
					this.setState({
						loading: false,
						error: "We couldn't find the class with that subject number. Make sure it's spelled as it appears in the Course Catalog.\n\nFor help, email hello@myhomework.space."
					});
				} else if (data.error == "already_enrolled") {
					this.setState({
						loading: false,
						error: "You already have that class in your registration."
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

	removeCustomClass(registeredClass) {
		if (!confirm("Remove " + registeredClass.subjectID + " " + registeredClass.title + "?")) {
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("schools/settings/callMethod", {
				school: "mit",
				methodName: "removeCustomClass",
				methodParams: JSON.stringify({
					subjectNumber: registeredClass.subjectID
				})
			}, (data) => {
				if (data.status == "ok") {
					this.props.loadDetails(() => {
						this.setState({
							loading: false
						});
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

				{state.registration.length == 0 && <div>
					<p>We couldn't find any classes in your registration for this term. Check your <a href="https://student.mit.edu/cgi-bin/shrwssor.sh" target="_blank" rel="noopener noreferrer">official Status of Registration</a>&mdash;if you've recently made changes, it may take up to 24 hours for them to take effect.</p>
					<p>If you believe you're receiving this message in error, please contact us at <a href="mailto:hello@myhomework.space">hello@myhomework.space</a>.</p>
				</div>}
				{state.registration.map((registeredClass) => {
					return <MITClassSections
						registeredClass={registeredClass}
						setSectionForSubject={this.setSectionForSubject.bind(this)}
						isCustom={registeredClass.custom}
						removeCustomClass={this.removeCustomClass.bind(this)}
					/>;
				})}
				<button class="btn btn-default" onClick={this.addCustomClass.bind(this)}>
					<i class="fa fa-fw fa-plus-circle" /> Add another class
				</button>

				<div>
					<h4 class="mitSettingsInfoTitle">PE registration</h4>
					{state.peInfo && <div>
						<strong>{state.peInfo.sectionID} {state.peInfo.activity} - {state.peInfo.courseTitle}</strong>
						<div>
							{state.peInfo.rawSchedule.split("\n").map((line) => {
								return <div>{line}</div>;
							})}
						</div>
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