import "ui/NotificationControl.styl"

import { h, Component } from "preact";

import api from "api.js";

import TopBarButton from "ui/nav/TopBarButton.jsx";
import NotificationPopup from "ui/NotificationPopup.jsx"

class NotificationControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}
	
	componentDidMount() {
		this.load();
	}

	load() {
		let that = this;
		api.get("notifications/get", {}, function(notifications) {
			that.setState({
				notifications: notifications.notifications,
			});
		});
	}

	onBodyClick(e) {
		var $target = $(e.target);
		if (!$target.hasClass("notificationPopup") && $target.closest(".notificationControlContainer").length == 0) {
			this.toggle();
		}
	}

	toggle() {
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("body").bind("click", this.state.bodyClick);
			} else {
				$("body").unbind("click", this.state.bodyClick);
			}
		});
	}

	//TODO: Fix popup dismiss on body click

	render(props, state) {
		return <span class="notificationControlContainer">
			<TopBarButton icon="bell-o" selected={state.open} onClick={this.toggle.bind(this)}>
				Notifications
				{this.state.notifications
				? this.state.notifications.length > 0
					? <span class="label label-danger">{this.state.notifications.length}</span>
					: null
				: null}
			</TopBarButton>
			<NotificationPopup notifications={this.state.notifications} open={this.state.open}/>
		</span>;
	}
}

export default NotificationControl;