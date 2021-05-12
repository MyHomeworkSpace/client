import "settings/panes/applications/ApplicationList.styl";

import { h, Component } from "preact";

import api from "api.js";

import ApplicationListItem from "settings/panes/applications/ApplicationListItem.jsx";

export default class ApplicationList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.refresh();
	}

	refresh() {
		this.setState({
			loading: true
		}, () => {
			api.get("application/getAuthorizations", {}, (data) => {
				this.setState({
					loading: false,
					authorizations: data.authorizations
				});
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="applicationList loading"><i class="fa fa-refresh fa-spin"></i> Loading, please wait...</div>;
		}
		if (state.authorizations.length == 0) {
			return <div class="applicationList empty">You have not given any applications permission to access your account.</div>;
		}

		let authorizations = state.authorizations.map((authorization) => {
			return <ApplicationListItem authorization={authorization} refresh={this.refresh.bind(this)} />;
		});
		return <div class="applicationList">{authorizations}</div>;
	}
};