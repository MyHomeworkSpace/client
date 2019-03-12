import "ui/nav/TopBar.styl";

import { h, Component } from "preact";

import api from "api.js";

import AddAction from "ui/AddAction.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";
import NotificationControl from "ui/NotificationControl.jsx";

import NavLogo from "ui/nav/NavLogo.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";
import TopBarDropdown from "ui/nav/TopBarDropdown.jsx";

class TopBar extends Component {
	logout() {
		api.get("auth/logout", {}, function() {
			window.location.reload();
		});
	}

	openPage(page) {
		if (this.props.page != page) {
			// open the new page
			this.props.openPage(page);
		} else {
			// already on this page, so just hide it
			this.props.openPage("");
		}
	}

	componentDidMount() {
		Mousetrap.bind("h", () => this.openPage("homework"));
		Mousetrap.bind("p", () => this.openPage("planner"));
		Mousetrap.bind("c", () => this.openPage("calendar"));
		Mousetrap.bind("?", () => this.openPage("help"));
		Mousetrap.bind("l", () => this.openPage("classes"));
		Mousetrap.bind(["ctrl+,", "command+,"], () => this.openPage("settings"));
	}

	render(props, state) {
		var that = this;
		var tabs = {
			"homework": { icon: "file-o", name: "Homework" },
			"planner": { icon: "book", name: "Planner" },
			"calendar": { icon: "calendar", name: "Calendar" }
		};

		return <div class={`topBar ${props.inverted ? "inverted": ""} ${props.dimmed ? "dimmed": ""}`}>
			<div>
				<NavLogo />

				{Object.keys(tabs).map(function(tabKey) {
					var tab = tabs[tabKey];
					return <TopBarButton icon={tab.icon} selected={props.page == tabKey} onClick={that.openPage.bind(that, tabKey)}>{tab.name}</TopBarButton>;
				})}
				<TopBarDropdown me={props.me} tabs={props.tabs} page={props.page} openPage={props.openPage} />
			</div>
			<AddAction page={props.page} openModal={props.openModal} />
			<div>
				<NotificationControl />
				<FeedbackControl />
				<div class="logout" onClick={this.logout.bind(this)}><i class="fa fa-sign-out"></i></div>
				<div class="topName">{props.me && props.me.name}</div>
			</div>
		</div>;
	}
}

export default TopBar;