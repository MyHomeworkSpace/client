import "settings/panes/account/AccountPane.styl";

import { h, Component } from "preact";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class UsersPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			users: null,
		};
	}

	componentDidMount() {
		this.load();
	}

	load() {
		this.setState({
			loading: true,
			users: null,
		}, () => {
			api.get("admin/getUserCount", {}, (data) => {
				this.setState({
					userCount: data.count,
					loading: false
				});
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="usersPane">
				<LoadingIndicator />
			</div>;
		}

		return <div class="usersPane">
			<p>There {state.userCount != 1 ? "are" : "is"} {state.userCount} user{state.userCount > 1 ? "s" : ""}.</p>
		</div>;
	}
};