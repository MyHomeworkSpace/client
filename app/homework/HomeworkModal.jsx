import "homework/HomeworkModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import api from "api.js";
import errors from "errors.js";
import { handleNew } from "homework.js";

import ClassPicker from "ui/ClassPicker.jsx";
import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";
import PrefixedEdit from "ui/PrefixedEdit.jsx";

export default class HomeworkModal extends Component {
	constructor(props) {
		super(props);
		
		this._bodyKeyDown = this.keydown.bind(this);
		this._descriptionTextarea = null;
		
		var isNew = !props.modalState.id;

		this.state = {
			isNew: isNew,

			name: props.modalState.name || "",
			due: (props.modalState.due ? moment(props.modalState.due, "YYYY-MM-DD") : moment()),
			classId: props.modalState.classId || -1,
			complete: (isNew ? 0 : props.modalState.complete),
			desc: (isNew ? "" : props.modalState.desc)
		};
	}

	componentDidMount() {
		setTimeout(() => {
			document.body.addEventListener("keydown", this._bodyKeyDown);
		}, 10);

		if (this.props.modalState.direct) {
			this.save();
		}
	}

	componentWillUnmount() {
		document.body.removeEventListener("keydown", this._bodyKeyDown);
	}

	save() {
		if (this.state.name == "") {
			this.setState({
				error: "You must enter a name."
			});
			return;
		}
		if (this.state.classId == -1) {
			this.setState({
				error: "You must select a class."
			});
			return;
		}

		this.setState({
			error: "",
			loading: true
		}, () => {
			var homeworkInfo = {
				name: this.state.name,
				due: this.state.due.format("YYYY-MM-DD"),
				desc: this.state.desc,
				complete: (this.state.complete ? "1" : "0"),
				classId: this.state.classId
			};
			if (!this.state.isNew) {
				homeworkInfo.id = this.props.modalState.id;
			}

			api.post((this.state.isNew ? "homework/add" : "homework/edit"), homeworkInfo, (data) => {
				if (data.status == "ok") {
					this.props.openModal("");
					handleNew();
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	delete() {
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, () => {
				api.post("homework/delete", {
					id: this.props.modalState.id
				}, () => {
					this.props.openModal("");
					handleNew();
				});
			});
		}
	}

	keypress(e) {
		if (e.shiftKey && e.keyCode == 13) {
			// this is a shift+enter, we don't want to actually insert it
			e.preventDefault();
			return false;
		}
	}

	keydown(e) {
		if (e.keyCode == 13 && !this.state.loading) {
			// we either need to not be focused on the description, or have the shift key down
			if (document.activeElement != this._descriptionTextarea || e.shiftKey) {
				this.save();
				e.preventDefault();
				return false;
			}
		}
	}

	changeDue(due) {
		this.setState({
			due: due
		});
	}

	changeClass(classId) {
		this.setState({
			classId: classId
		});
	}

	render(props, state) {
		if (state.loading) {
			return <Modal title={(state.isNew ? "Add homework" : "Edit homework")} openModal={props.openModal} noClose class="homeworkModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		return <Modal title={(state.isNew ? "Add homework" : "Edit homework")} openModal={props.openModal} class="homeworkModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<PrefixedEdit class="homeworkModalName" placeholder="Name" value={state.name} onKeyDown={this.keydown.bind(this)} onInput={linkState(this, "name")} />
				<DatePicker value={state.due} change={this.changeDue.bind(this)} />
				<ClassPicker value={state.classId} change={this.changeClass.bind(this)} classes={props.classes} />
				<label>
					<input type="checkbox" checked={state.complete} onChange={linkState(this, "complete")} /> Done?
				</label>
				<textarea class="form-control homeworkModalDesc" placeholder="Description" onInput={linkState(this, "desc")} onKeyPress={this.keypress.bind(this)} onKeyDown={this.keydown.bind(this)} value={state.desc} ref={ (textarea) => {
					this._descriptionTextarea = textarea;
				}}></textarea>
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
};