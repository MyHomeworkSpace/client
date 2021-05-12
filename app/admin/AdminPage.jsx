import { h, Component } from "preact";

import HomePane from "admin/panes/home/HomePane.jsx";
import FeedbackPane from "admin/panes/feedback/FeedbackPane.jsx";
import UsersPane from "admin/panes/users/UsersPane.jsx";
import AnnouncementsPane from "admin/panes/announcements/AnnouncementsPane.jsx";


export default class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pane: "home"
		};
	}

	setPane(pane) {
		this.setState({
			pane: pane
		});
	}

	// Borrow a bit of CSS from the settings panel
	render(props, state) {
		let panes = {
			home: { icon: "home", name: "Home", component: HomePane },
			feedback: { icon: "comments-o", name: "Feedback", component: FeedbackPane },
			users: { icon: "user", name: "Users", component: UsersPane },
			announcements: { icon: "bell", name: "Announcements", component: AnnouncementsPane }
		};

		let currentPane = panes[state.pane];

		// we're going to borrow some CSS from the settings page because... uhhh... i'm lazy
		return <div class="settingsPage">
			<h2>Admin</h2>
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