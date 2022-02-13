import "settings/panes/dashboard/DashboardPane.styl";

import { h, Component } from "preact";

import HiddenClassList from "settings/HiddenClassList.jsx";
import PrefCheckbox from "settings/PrefCheckbox.jsx";

export default class DashboardPane extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			classPrompt: false
		};
	}

	render(props, state) {
		return <div class="dashboardPane">
			<h4>Calendar summary</h4>
			<p>Dashboard gives you the option of having a summary of the day's calendar events at the top of the screen.</p>
			<PrefCheckbox pref="hideCalendarFromDashboard" label="Hide calendar summary from Dashboard" />

			<h4>Hidden classes</h4>
			<p class="homeworkSettingsDescription">You can hide certain classes from Dashboard. If you hide a class, its homework will still appear in Planner and Calendar, but will not be displayed in any Dashboard columns.</p>
			<HiddenClassList classes={props.classes} />
		</div>;
	}
};