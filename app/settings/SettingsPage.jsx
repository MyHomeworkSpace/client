import "settings/SettingsPage.styl";

import { h, Component } from "preact";

import AccountPane from "settings/panes/AccountPane.jsx";
import ApplicationsPane from "settings/panes/ApplicationsPane.jsx";
import CalendarPane from "settings/panes/CalendarPane.jsx";
import HomeworkPane from "settings/panes/HomeworkPane.jsx";
import MorePane from "settings/panes/MorePane.jsx";
import PlannerPane from "settings/panes/PlannerPane.jsx";
import QuickAddPane from "settings/panes/QuickAddPane.jsx";

export default class SettingsPage extends Component {
	constructor() {
		super();
		this.state = {
			pane: "account"
		};
	}

	setPane(pane) {
		this.setState({
			pane: pane
		});
	}

	render(props, state) {
		var that = this;

		var panes = {
			account: { icon: "user", name: "Account", component: AccountPane },
			quickAdd: { icon: "plus", name: "Quick Add", component: QuickAddPane },
			applications: { icon: "link", name: "Applications", component: ApplicationsPane },
			homework: { icon: "file-o", name: "Homework", component: HomeworkPane },
			planner: { icon: "book", name: "Planner", component: PlannerPane },
			calendar: { icon: "calendar", name: "Calendar", component: CalendarPane },
			more: { icon: "external-link", name: "More projects", component: MorePane },
		};

		var currentPane = panes[state.pane];

		return <div class="settingsPage">
			<h2>Settings</h2>
			<div class="settingsPaneContainer">
				<div class="settingsPaneSelect">
					{Object.keys(panes).map(function(paneID) {
						var pane = panes[paneID];
						return <div class={`settingsPaneOption ${paneID == state.pane ? "settingsPaneOptionSelected" : ""}`} onClick={that.setPane.bind(that, paneID)}>
							<i class={`fa fa-fw fa-${pane.icon}`} /> {pane.name}
						</div>;
					})}
				</div>
				<div class="settingsPane">
					{h(currentPane.component, {
						classes: props.classes,
						me: props.me,
						openModal: props.openModal
					})}
				</div>
			</div>
		</div>;
	}
};