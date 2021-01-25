import { h, Component } from "preact";

import ApplicationList from "settings/panes/applications/ApplicationList.jsx";
import MyApplications from "settings/panes/applications/MyApplications.jsx";

export default class ApplicationsPane extends Component {
	render(props, state) {
		return <div>
			<p>Manage other applications you've given access to your account.</p>
			<ApplicationList />
			<hr />
			<p>If you're a developer, you can integrate MyHomeworkSpace with your application. Take a look at our <a href="https://support.myhomework.space/docs/get-started-api" target="_blank" rel="noopener noreferrer">API Documentation</a> for more information.</p>
			<p>If you'd like to change the publisher name on an application, contact us at <a href="mailto:hello@myhomework.space">hello@myhomwork.space</a>, and we'll be more than happy to help.</p>
			<MyApplications openModal={props.openModal} />
		</div>;
	}
};