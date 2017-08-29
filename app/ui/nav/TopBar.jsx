import "ui/nav/TopBar.styl";

import { h, Component } from "preact";

import api from "api.js";

import AddAction from "ui/AddAction.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";

import NavLogo from "ui/nav/NavLogo.jsx";
import SidebarToggleButton from "ui/nav/SidebarToggleButton.jsx";

class TopBar extends Component {
	logout() {
		api.get("auth/logout", {}, function(xhr) {
			window.location.reload();
		});
	}

	render(props, state) {
		return <div class={`topBar ${props.inverted ? "inverted": ""}`}>
			<div>
				<SidebarToggleButton toggleSidebar={props.toggleSidebar} />
				<NavLogo />
			</div>
			<AddAction page={props.page} openModal={props.openModal} />
			<div>
				<FeedbackControl />
				<div class="logout" onClick={this.logout.bind(this)}><i class="fa fa-sign-out"></i></div>
				<div class="topName">{props.me && props.me.name}</div>
			</div>
		</div>;
	}
}

export default TopBar;