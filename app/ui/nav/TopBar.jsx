import "ui/nav/TopBar.styl";

import { h, Component } from "preact";
import Mousetrap from "mousetrap";


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
		if (this.state.open) {
			this.setState({
				open: false
			});
		}

		if (this.props.page != page) {
			// open the new page
			this.props.openPage(page);
		} else {
			// already on this page, so just hide it
			this.props.openPage("");
		}
	}

	toggleOpen() {
		this.setState({
			open: !this.state.open
		});
	}

	enableShortcuts() {
		Mousetrap.bind("d", this.openPage.bind(this, "homework"));
		Mousetrap.bind("p", this.openPage.bind(this, "planner"));
		Mousetrap.bind("c", this.openPage.bind(this, "calendar"));
		Mousetrap.bind("?", () => {
			this.props.openModal("shortcut");
		});
		Mousetrap.bind("l", this.openPage.bind(this, "classes"));
		Mousetrap.bind(["s", "ctrl+,", "command+,"], this.openPage.bind(this, "settings"));
	}

	showImageInfo() {
		this.props.openModal("imageInfo", { imageInfo: this.props.daltonTabBackgroundDetails });
	}

	render(props, state) {
		var tabs = {
			"homework": { icon: "tachometer", name: "Dashboard" },
			"planner": { icon: "book", name: "Planner" },
			"calendar": { icon: "calendar", name: "Calendar" }
		};

		var renderedTabs = [
			Object.keys(tabs).map((tabKey) => {
				var tab = tabs[tabKey];
				return <TopBarButton icon={tab.icon} selected={props.page == tabKey} onClick={this.openPage.bind(this, tabKey)}>{tab.name}</TopBarButton>;
			}),
			<TopBarDropdown me={props.me} mainTabs={tabs} tabs={props.tabs} page={props.page} openPage={props.openPage} />
		];

		return <div class={`topBar ${props.inverted ? "inverted" : ""} ${props.dimmed ? "dimmed" : ""} ${state.open ? "open" : ""}`}>
			<div class="topBarGroup">
				<NavLogo />

				{renderedTabs}
			</div>
			<AddAction page={props.page} openModal={props.openModal} />
			<div class="topBarGroup">
				<div class="topBarToggle topBarAction" onClick={this.toggleOpen.bind(this)}>
					<i class="fa fa-fw fa-bars" />
				</div>
				<NotificationControl />
				{props.currentBackground == "img:-1" && <TopBarButton icon="camera" selected={state.open} onClick={this.showImageInfo.bind(this)}>
					{props.daltonTabBackgroundDetails.description ? props.daltonTabBackgroundDetails.description : "About image"}
				</TopBarButton>}
				<FeedbackControl />
				<div class="topBarLogout topBarAction" onClick={this.logout.bind(this)}><i class="fa fa-sign-out"></i></div>
				<div class="topBarName">{props.me && props.me.name}</div>
			</div>
			<div class="topBarToggleContainer">
				{renderedTabs}

				<div class="topBarName">{props.me && props.me.name}</div>
				<div class="topBarLogout topBarAction" onClick={this.logout.bind(this)}><i class="fa fa-sign-out"></i> Log out</div>
			</div>
		</div>;
	}
};