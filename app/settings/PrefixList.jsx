import "settings/PrefixList.styl";

import { h, Component } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";
import AddPrefix from "settings/AddPrefix.jsx";

import prefixes from "prefixes.js";
import api from "api.js";

class PrefixList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: null,
			hideGroups: [],
		}
	}

	deleteGroup(id) {
		let that = this;
		api.post("prefixes/delete", { id: id }, (response) => {
			if (response.status == "ok") {
				this.setState({
					status: {
						type: "success",
						message: "Successfully deleted. Refresh the page to update."
					},
					hideGroups: that.state.hideGroups.concat([id])
				})
			} else {
				this.setState({
					status: {
						type: "danger",
						message: "An internal server error occured."
					}
				})
			}
		})
	}

	handleAddPrefix(details) {
		let that = this;
		api.post("prefixes/add", details, (response) => {
			if (response.status == "ok") {
				this.setState({
					status: {
						type: "success",
						message: "Successfully added. Refresh the page to update."
					},
				})
			} else {
				this.setState({
					status: {
						type: "danger",
						message: "An internal server error occured."
					}
				})
			}
		})
	}

	render(props, state) {
		let that = this;
		var groups = prefixes.list.map(function (group) {
			if (group.words.indexOf("Hex") > -1 || that.state.hideGroups.indexOf(that.state.id) > -1) {
				// shhhhh
				return;
			}
			var words = group.words.map(function (word) {
				return <HomeworkName name={word} />;
			});
			return <div class="prefixListGroup">
				{words}
				{group.id > 0
					? <button class="btn btn-xs btn-default" onclick={() => that.deleteGroup(group.id)}><i class="fa fa-trash-o"></i></button>
					: null}
			</div>;
		});
		return <div class="prefixList">
			{that.state.status
				? <div class={"alert alert-" + that.state.status.type} role="alert">{that.state.status.message}</div> : null}
			{groups}
			<h4>Add Tag</h4>
			<AddPrefix onAddPrefix={this.handleAddPrefix.bind(this)}/>
		</div>;
	}
}

export default PrefixList;