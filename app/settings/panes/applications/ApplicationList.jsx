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

	componentWillMount() {
		this.refresh();
	}

	refresh() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.get("application/getAuthorizations", {}, function(data) {
				that.setState({
					loading: false,
					authorizations: data.authorizations
				});
			});
		});
	}

	render(props, state) {
		var that = this;

		if (state.loading) {
			return <div class="applicationList loading"><i class="fa fa-refresh fa-spin"></i> Loading, please wait...</div>;
		}
		if (state.authorizations.length == 0) {
			return <div class="applicationList empty">You have not given any applications permission to access your account.</div>;
		}

		var authorizations = state.authorizations.map(function(authorization) {
			return <ApplicationListItem authorization={authorization} refresh={that.refresh.bind(that)} />;
		});
		return <div class="applicationList">{authorizations}</div>;
	}
};