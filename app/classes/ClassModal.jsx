import "classes/ClassModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

class ClassModal extends Component {
	constructor(props) {
		super(props);
		var isNew = (props.modalState.id ? false : true);
		this.state = {
			isNew: isNew,
			name: (isNew ? "" : props.modalState.name),
			teacher: (isNew ? "" : props.modalState.teacher)
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
		this.setState({
			loading: true
		}, function() {

		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.save();
		}
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
				<input type="text" placeholder="Name" class="className form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} value={this.state.name} />
				<input type="text" placeholder="Teacher" class="classTeacher form-control" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "teacher")} value={this.state.teacher} />
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
}

export default ClassModal;