import "ui/NotificationPopup.styl";

import { h, Component } from "preact";

class NotificationPopup extends Component {
	render(props, state) {
		if (!props.open) {
			return null;
		}
		if (props.notifications.length < 1) {
			return <div class="notificationPopup">
				<div class="notificationPopupHeading">Notifications</div>
				<span class="emptyText">There are no notifications.</span>
			</div>;
		}
		return <div class="notificationPopup">
			<div class="notificationPopupHeading">Notifications</div>
			<ul>
				{/* Yes, you read that correctly. It does say "dangerouslySetInnerHTML", but it is safe to
					set HTML in that method IN THIS CASE ONLY, because the HTML received from the server is
					KNOWN TO BE SAFE, is it was set by admins, whom we know we can trust.*/}
				{props.notifications.map((notification, index) => {
					return (<li list_key={index} dangerouslySetInnerHTML={{__html: notification.content}}/>)
				})}
			</ul>
		</div>;
	}
}

export default NotificationPopup;