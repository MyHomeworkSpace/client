import { h, Component } from "preact";
import "ui/NotificationPopup.styl";

class NotificationPopup extends Component {
	render(props, state) {
		if (!props.open) return null
		if (props.notifications.length < 1) {
			return (
				<div class="notificationPopup">
					<div class="notificationPopupHeading">Notifications</div>
					<span class="emptyText">There are no notifications.</span>
				</div>
			)
		}
		return (
			<div class="notificationPopup">
				<div class="notificationPopupHeading">Notifications</div>
				<ul>
					{props.notifications.map((notification, index) => {
						return (<li list_key={index}>
							{notification.content}
						</li>)
					})}
				</ul>
			</div>
		)
	}
}

export default NotificationPopup;