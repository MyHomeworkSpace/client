import "ui/nav/TopBar.styl";

import { h, Component } from "preact";

import api from "api.js";

import AddAction from "ui/AddAction.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";

import NavLogo from "ui/nav/NavLogo.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";
import TopBarDropdown from "ui/nav/TopBarDropdown.jsx";

class TopBar extends Component {
	logout() {
		api.get("auth/logout", {}, function(data) {
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
				<TopBarDropdown tabs={props.tabs} page={props.page} openPage={props.openPage} />
			</div>
			<AddAction page={props.page} openModal={props.openModal} />
			<div>
				<FeedbackControl />
				<div class="logout" onClick={this.logout.bind(this)}><i class="fa fa-sign-out"></i></div>
			<div class="topName">{props.me && props.me.name}{props.me.level > 0 && <span> <span class="label label-primary">Admin</span></span>}</div>
			</div>
		</div>;
	}
}

export default TopBar;