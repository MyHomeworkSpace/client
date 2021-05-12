import "settings/SettingsPage.styl";

import { h, Component } from "preact";

import AccountPane from "settings/panes/account/AccountPane.jsx";
import ApplicationsPane from "settings/panes/applications/ApplicationsPane.jsx";
import CalendarPane from "settings/panes/calendar/CalendarPane.jsx";
import TagsPane from "settings/panes/tags/TagsPane.jsx";
import MorePane from "settings/panes/more/MorePane.jsx";
import PlannerPane from "settings/panes/planner/PlannerPane.jsx";
import QuickAddPane from "settings/panes/quickAdd/QuickAddPane.jsx";
import DashboardPane from "settings/panes/dashboard/DashboardPane.jsx";

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
		let panes = {
			account: { icon: "user", name: "Account", component: AccountPane },
			quickAdd: { icon: "plus", name: "Quick Add", component: QuickAddPane },
			dashboard: { icon: "tachometer", name: "Dashboard", component: DashboardPane },
			planner: { icon: "book", name: "Planner", component: PlannerPane },
			calendar: { icon: "calendar", name: "Calendar", component: CalendarPane },
			homework: { icon: "tags", name: "Tags", component: TagsPane },
			applications: { icon: "link", name: "Applications", component: ApplicationsPane },
			more: { icon: "external-link", name: "More projects", component: MorePane },
		};

		let currentPane = panes[state.pane];

		return <div class="settingsPage">
			<h2>Settings</h2>
			<div class="settingsPaneContainer">
				<div class="settingsPaneSelect">
					{Object.keys(panes).map((paneID) => {
						let pane = panes[paneID];
						return <div class={`settingsPaneOption ${paneID == state.pane ? "settingsPaneOptionSelected" : ""}`} onClick={this.setPane.bind(this, paneID)}>
							<i class={`fa fa-fw fa-${pane.icon}`} /> {pane.name}
						</div>;
					})}
				</div>
				<div class="settingsPane">
					{h(currentPane.component, {
						classes: props.classes,
						me: props.me,

						openModal: props.openModal,
						refreshContext: props.refreshContext
					})}
				</div>
			</div>
		</div>;
	}
};