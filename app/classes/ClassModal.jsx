import "classes/ClassModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import consts from "consts.js";

import ClassColorPicker from "classes/ClassColorPicker.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

class ClassModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			name: (isNew ? "" : props.modalState.name),
			teacher: (isNew ? "" : props.modalState.teacher),
			color: (isNew ? consts.classColors[Math.floor(Math.random() * consts.classColors.length)] : props.modalState.color)
		};
	}

	save() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			var classInfo = {
				name: this.state.name,
				teacher: this.state.teacher,
				color: this.state.color
			};
			if (!that.state.isNew) {
				classInfo.id = this.props.modalState.id;
			}
			api.post((that.state.isNew ? "classes/add" : "classes/edit"), classInfo, function(xhr) {
				that.props.refreshClasses(function() {
					that.props.openModal("");
				});
			});
		});
	}

	delete() {
		var that = this;
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, function() {
				api.get("classes/hwInfo/" + that.props.modalState.id, {}, function(xhr) {
					var hwItems = xhr.responseJSON.hwItems;
					if (hwItems > 0) {
						if (!confirm("This will ALSO delete the " + hwItems + " homework item(s) associated with this class. Are you *sure*?")) {
							that.props.openModal("");
							return;
						}
					}
					api.post("classes/delete", {
						id: that.props.modalState.id
					}, function() {
						that.props.refreshClasses(function() {
							that.props.openModal("");
						});
					});
				});
			});
		}
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.save();
		}
	}

	changeColor(color) {
		this.setState({
			color: color
		});
	}

	render(props, state) {
		if (state.loading) {
			return <Modal title={(state.isNew ? "Add class" : "Edit class")} openModal={props.openModal} noClose class="classModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		return <Modal title={(state.isNew ? "Add class" : "Edit class")} openModal={props.openModal} class="classModal">
			<div class="modal-body">
				<input type="text" placeholder="Name" class="classModalName form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} value={this.state.name} />
				<input type="text" placeholder="Teacher" class="classModalTeacher form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "teacher")} value={this.state.teacher} />
				<ClassColorPicker onChange={this.changeColor.bind(this)} value={this.state.color} />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
}

export default ClassModal;