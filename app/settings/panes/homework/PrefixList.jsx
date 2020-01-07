import "settings/panes/homework/PrefixList.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";
import prefixes from "prefixes.js";

import HomeworkName from "ui/HomeworkName.jsx";

import AddPrefix from "settings/panes/homework/AddPrefix.jsx";

export default class PrefixList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hideGroups: []
		};
	}

	deleteGroup(id) {
		api.post("prefixes/delete", { id: id }, (data) => {
			if (data.status == "ok") {
				this.setState({
					hideGroups: this.state.hideGroups.concat([id])
				});
			} else {
				this.setState({
					error: errors.getFriendlyString(data.error)
				});
			}
		});
	}

	addPrefix() {
		this.setState({
			addPrefix: true
		});
	}

	cancelAddPrefix() {
		this.setState({
			addPrefix: false
		});
	}

	render(props, state) {
		var groups = prefixes.list.map((group) => {
			if (group.words.indexOf("Hex") > -1 || state.hideGroups.indexOf(group.id) > -1) {
				// shhhhh
				return;
			}

			var words = group.words.map(function(word) {
				return <HomeworkName name={word} />;
			});

			return <div class="prefixListGroup">
				{words}
				{group.id != -1 && <button class="btn btn-xs btn-danger" onClick={this.deleteGroup.bind(this, group.id)}><i class="fa fa-trash-o" /></button>}
			</div>;
		});

		return <div class="prefixList">
			{state.error && <div class="alert alert-danger">{state.error}</div>}

			{groups}

			{state.addPrefix ? <div>
				<h4>Add custom tag <small>(separate multiple with spaces)</small></h4>
				<AddPrefix cancelAddPrefix={this.cancelAddPrefix.bind(this)} />
			</div> : <button class="btn btn-primary actionBtn" onClick={this.addPrefix.bind(this)}>
				<i class="fa fa-fw fa-plus-circle" /> Add a custom tag
			</button>}
		</div>;
	}
};