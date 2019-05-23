import "settings/PrefixList.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";
import prefixes from "prefixes.js";

import HomeworkName from "ui/HomeworkName.jsx";

import AddPrefix from "settings/AddPrefix.jsx";

class PrefixList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hideGroups: []
		};
	}

	deleteGroup(id) {
		var that = this;
		api.post("prefixes/delete", { id: id }, function(data) {
			if (data.status == "ok") {
				that.setState({
					hideGroups: that.state.hideGroups.concat([id])
				});
			} else {
				that.setState({
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
		var that = this;
		var groups = prefixes.list.map(function(group) {
			if (group.words.indexOf("Hex") > -1 || state.hideGroups.indexOf(group.id) > -1) {
				// shhhhh
				return;
			}

			var words = group.words.map(function(word) {
				return <HomeworkName name={word} />;
			});

			return <div class="prefixListGroup">
				{words}
				{group.id != -1 && <button class="btn btn-xs btn-danger" onClick={that.deleteGroup.bind(that, group.id)}><i class="fa fa-trash-o" /></button>}
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
}

export default PrefixList;