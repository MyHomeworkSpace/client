import "settings/HomeworkSettings.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import ClassName from "ui/ClassName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import PrefixList from "settings/PrefixList.jsx";

class HomeworkSettings extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			classPrompt: false
		};
	}

	componentWillMount() {
		this.refresh();
	}

	refresh() {
		var that = this;
		this.setState({
			loading: true,
			classPrompt: false
		}, function() {
			api.get("prefs/get/homeworkHiddenClasses", {}, function(data) {
				if (data.status == "ok") {
					// found a preference, read it
					that.setState({
						loading: false,
						hiddenClasses: JSON.parse(data.pref.value)
					});
				} else {
					// it's not set, so default to empty
					that.setState({
						loading: false,
						hiddenClasses: []
					});
				}
			});
		});
	}

	getAvailableClasses() {
		var that = this;
		var availableClasses = [];
		this.props.classes.forEach(function(classObject) {
			if (that.state.hiddenClasses.indexOf(classObject.id) == -1) {
				availableClasses.push(classObject);
			}
		});
		return availableClasses;
	}

	addClass() {
		var that = this;
		if (!this.state.classPrompt) {
			this.setState({
				classPrompt: true,
				selectedClass: this.getAvailableClasses()[0].id
			});
		} else {
			this.setState({
				loading: true
			}, function() {
				var hiddenClasses = this.state.hiddenClasses;
				hiddenClasses.push(parseInt(this.state.selectedClass));
				api.post("prefs/set", {
					key: "homeworkHiddenClasses",
					value: JSON.stringify(hiddenClasses)
				}, function(data) {
					that.refresh.call(that);
				});
			});
		}
	}

	removeClass(classId) {
		if (!confirm("Unhide this class?")) {
			return;
		}
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var hiddenClasses = that.state.hiddenClasses;
			hiddenClasses.splice(hiddenClasses.indexOf(classId), 1);
			api.post("prefs/set", {
				key: "homeworkHiddenClasses",
				value: JSON.stringify(hiddenClasses)
			}, function(data) {
				that.refresh.call(that);
			});
		});
	}

	render(props, state) {
		var that = this;

		if (state.loading) {
			return <div><LoadingIndicator /> Loading, please wait...</div>;
		}

		var availableClasses = this.getAvailableClasses();
		
		return <div class="homeworkSettings">
			<h4>Tags</h4>
			<p class="homeworkSettingsDescription">You add custom tags to be used on MyHomeworkSpace.</p>
			<PrefixList />

			<h4>Hidden classes</h4>
			<p class="homeworkSettingsDescription">You can hide certain classes from Homework view. If you hide a class, its homework will still appear in Planner and Calendar, but will not be displayed in any Homework columns.</p>
			
			{state.classPrompt && <select onChange={linkState(this, "selectedClass")}>
				{availableClasses.map(function(classObject) {
					return <option value={classObject.id}>{classObject.name}</option>;
				})}
			</select>}
			<button class="btn btn-default btn-sm" onClick={this.addClass.bind(this)}>
				<i class="fa fa-plus-circle" /> add
			</button>

			<div class="homeworkSettingsClassList">
				{state.hiddenClasses.length == 0 && <p>You haven't hidden any classes.</p>}
				{state.hiddenClasses.map(function(classId) {
					var classObject;
					props.classes.forEach(function(potentialClass) {
						if (potentialClass.id == classId) {
							classObject = potentialClass;
							return false;
						}
					});

					return <div class="homeworkSettingsClass">
						<ClassName classObject={classObject} />
						<div class="homeworkSettingsClassRemove" onClick={that.removeClass.bind(that, classObject.id)}>
							<i class="fa fa-trash" />
						</div>
					</div>;
				})}
			</div>
		</div>;
	}
}

export default HomeworkSettings;