import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import PrefCheckbox from "settings/PrefCheckbox.jsx";
import ClassName from "ui/ClassName.jsx";
import ClassPicker from "ui/ClassPicker.jsx";

import "settings/panes/dashboard/DashboardPane.styl";


export default class DashboardPane extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			classPrompt: false
		};
	}

	componentDidMount() {
		this.refresh();
	}

	refresh() {
		this.setState({
			loading: true,
			classPrompt: false
		}, () => {
			api.get("prefs/get/homeworkHiddenClasses", {}, (data) => {
				if (data.status == "ok") {
					// found a preference, read it
					this.setState({
						loading: false,
						hiddenClasses: JSON.parse(data.pref.value)
					});
				} else {
					// it's not set, so default to empty
					this.setState({
						loading: false,
						hiddenClasses: []
					});
				}
			});
		});
	}

	getAvailableClasses() {
		var availableClasses = [];
		this.props.classes.forEach((classObject) => {
			if (this.state.hiddenClasses.indexOf(classObject.id) == -1) {
				availableClasses.push(classObject);
			}
		});
		return availableClasses;
	}

	cancelAddClass() {
		this.setState({
			classPrompt: false
		});
	}

	addClass() {
		if (!this.state.classPrompt) {
			this.setState({
				classPrompt: true,
				selectedClass: this.getAvailableClasses()[0].id
			});
		} else {
			this.setState({
				loading: true
			}, () => {
				var hiddenClasses = this.state.hiddenClasses;
				hiddenClasses.push(parseInt(this.state.selectedClass));
				api.post("prefs/set", {
					key: "homeworkHiddenClasses",
					value: JSON.stringify(hiddenClasses)
				}, () => {
					this.refresh();
				});
			});
		}
	}

	removeClass(classId) {
		if (!confirm("Unhide this class?")) {
			return;
		}

		this.setState({
			loading: true
		}, () => {
			var hiddenClasses = this.state.hiddenClasses;
			hiddenClasses.splice(hiddenClasses.indexOf(classId), 1);
			api.post("prefs/set", {
				key: "homeworkHiddenClasses",
				value: JSON.stringify(hiddenClasses)
			}, () => {
				this.refresh();
			});
		});
	}

	render(props, state) {
		var availableClasses;
		if (!state.loading) {
			availableClasses = this.getAvailableClasses();
		}

		return <div class="dashboardPane">
			<h4>Calendar summary</h4>
			<p>Dashboard gives you the option of having a summary of the day's calendar events at the top of the screen.</p>
			<PrefCheckbox pref="hideCalendarFromDashboard" label="Hide calendar summary from Dashboard" />

			<h4>Hidden classes</h4>
			<p class="homeworkSettingsDescription">You can hide certain classes from Dashboard. If you hide a class, its homework will still appear in Planner and Calendar, but will not be displayed in any Dashboard columns.</p>

			{state.loading ? <p>Loading...</p> : <div>
				<div class="homeworkPaneClassesAdd">
					{state.classPrompt && <ClassPicker value={state.selectedClass} change={linkState(this, "selectedClass")} classes={availableClasses} />}
					{!state.classPrompt && <button class="btn btn-primary actionBtn" onClick={this.addClass.bind(this)}>
						<i class="fa fa-fw fa-plus-circle" /> Add a hidden class
					</button>}
					{state.classPrompt && <button class="btn btn-primary" onClick={this.addClass.bind(this)}><i class="fa fa-fw fa-check" /></button>}
					{state.classPrompt && <button class="btn btn-danger" onClick={this.cancelAddClass.bind(this)}><i class="fa fa-fw fa-times" /></button>}
				</div>

				<div class="homeworkSettingsClassList">
					{state.hiddenClasses.length == 0 && <p>You haven't hidden any classes.</p>}
					{state.hiddenClasses.map((classId) => {
						var classObject;
						props.classes.forEach((potentialClass) => {
							if (potentialClass.id == classId) {
								classObject = potentialClass;
								return false;
							}
						});

						if (!classObject) {
							// it no longer exists, ignore it
							return;
						}

						return <div class="homeworkSettingsClass">
							<ClassName classObject={classObject} />
							<div class="homeworkSettingsClassRemove" onClick={this.removeClass.bind(this, classObject.id)}>
								<i class="fa fa-trash" />
							</div>
						</div>;
					})}
				</div>
			</div>}
		</div>;
	}
};