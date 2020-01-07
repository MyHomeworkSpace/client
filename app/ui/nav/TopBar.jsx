import "ui/nav/TopBar.styl";

import { h, Component } from "preact";

import api from "api.js";

import AddAction from "ui/AddAction.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";
import NotificationControl from "ui/NotificationControl.jsx";

import NavLogo from "ui/nav/NavLogo.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";
import TopBarDropdown from "ui/nav/TopBarDropdown.jsx";

export default class TopBar extends Component {
	componentDidMount() {
		if (this.props.me && Object.keys(this.props.me).length > 0) {
			this.enableShortcuts();
		}
	}

	componentWillReceiveProps(nextProps) {
		if ((!this.props.me || Object.keys(this.props.me).length == 0) && nextProps.me && Object.keys(nextProps.me).length > 0) {
			this.enableShortcuts();
		}
	}

	logout() {
		api.get("auth/logout", {}, function() {
			window.location.hash = "!login";
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

	enableShortcuts() {
		Mousetrap.bind("h", this.openPage.bind(this, "homework"));
		Mousetrap.bind("p", this.openPage.bind(this, "planner"));
		Mousetrap.bind("c", this.openPage.bind(this, "calendar"));
		Mousetrap.bind("?", this.openPage.bind(this, "help"));
		Mousetrap.bind("l", this.openPage.bind(this, "classes"));
		Mousetrap.bind(["ctrl+,", "command+,"], this.openPage.bind(this, "settings"));
	}

	render(props, state) {
		var tabs = {
			"homework": { icon: "file-o", name: "Homework" },
			"planner": { icon: "book", name: "Planner" },
			"calendar": { icon: "calendar", name: "Calendar" }
		};

		return <div class={`topBar ${props.inverted ? "inverted" : ""} ${props.dimmed ? "dimmed" : ""}`}>
			<div>
				<NavLogo />

				{Object.keys(tabs).map((tabKey) => {
					var tab = tabs[tabKey];
					return <TopBarButton icon={tab.icon} selected={props.page == tabKey} onClick={this.openPage.bind(this, tabKey)}>{tab.name}</TopBarButton>;
				})}
				<TopBarDropdown me={props.me} mainTabs={tabs} tabs={props.tabs} page={props.page} openPage={props.openPage} />
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
};