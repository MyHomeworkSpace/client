import "ui/NotificationControl.styl";

import { h, Component } from "preact";

import api from "api.js";

import NotificationPopup from "ui/NotificationPopup.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";

class NotificationControl extends Component {
	constructor(props) {
		super(props);
		this._bodyClick = this.onBodyClick.bind(this);
		this.state = {
			open: false
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
				document.body.addEventListener("click", this._bodyClick);
			} else {
				document.body.removeEventListener("click", this._bodyClick);
			}
		});
	}

	render(props, state) {
		if (!state.notifications || state.notifications.length == 0) {
			return null;
		}

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