import "classes/ClassModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import consts from "consts.js";

import ColorPicker from "ui/ColorPicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

export default class ClassModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			name: (isNew ? "" : props.modalState.name),
			teacher: (isNew ? "" : props.modalState.teacher),
			color: (isNew ? consts.colors[Math.floor(Math.random() * consts.colors.length)] : props.modalState.color)
		};
	}

	save() {
		this.setState({
			loading: true
		}, () => {
			var classInfo = {
				name: this.state.name,
				teacher: this.state.teacher,
				color: this.state.color
			};
			if (!this.state.isNew) {
				classInfo.id = this.props.modalState.id;
			}
			api.post((this.state.isNew ? "classes/add" : "classes/edit"), classInfo, () => {
				this.props.refreshClasses(() => {
					this.props.openModal("");
				});
			});
		});
	}

	delete() {
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, () => {
				api.get("classes/hwInfo/" + this.props.modalState.id, {}, (data) => {
					var hwItems = data.hwItems;
					if (hwItems > 0) {
						if (!confirm("This will ALSO delete the " + hwItems + " homework item(s) associated with this class. Are you *sure*?")) {
							this.props.openModal("");
							return;
						}
					}
					api.post("classes/delete", {
						id: this.props.modalState.id
					}, () => {
						this.props.refreshClasses(() => {
							this.props.openModal("");
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
				<ColorPicker onChange={this.changeColor.bind(this)} value={this.state.color} />
				<input type="text" placeholder="Name" class="classModalName form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} value={this.state.name} />

				<div class="classColorClear" />

				<input type="text" placeholder="Teacher" class="classModalTeacher form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "teacher")} value={this.state.teacher} />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
};