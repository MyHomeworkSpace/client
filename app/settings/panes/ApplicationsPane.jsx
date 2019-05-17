import { h, Component } from "preact";

import ApplicationList from "settings/ApplicationList.jsx";

export default class ApplicationsPane extends Component {
	render(props, state) {
		return <div>
			<p>Manage other applications you've given access to your account.</p>
			<ApplicationList />
		</div>;
	}
};