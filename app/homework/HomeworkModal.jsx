import "homework/HomeworkModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import api from "api.js";
import errors from "errors.js";

import ClassPicker from "ui/ClassPicker.jsx";
import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";
import PrefixedEdit from "ui/PrefixedEdit.jsx";

export default class HomeworkModal extends Component {
	constructor(props) {
		super(props);
		
		this._bodyKeyUp = this.keyup.bind(this);
		
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
		var that = this;
		setTimeout(function() {
			document.body.addEventListener("keyup", that._bodyKeyUp);
		}, 10);
	}

	componentWillUnmount() {
		document.body.removeEventListener("keyup", this._bodyKeyUp);
	}

	save() {
		var that = this;

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
		}, function() {
			var homeworkInfo = {
				name: this.state.name,
				due: this.state.due.format("YYYY-MM-DD"),
				desc: this.state.desc,
				complete: (this.state.complete ? "1" : "0"),
				classId: this.state.classId
			};
			if (!that.state.isNew) {
				homeworkInfo.id = this.props.modalState.id;
			}

			api.post((that.state.isNew ? "homework/add" : "homework/edit"), homeworkInfo, function(data) {
				if (data.status == "ok") {
					that.props.openModal("");
					MyHomeworkSpace.Pages.homework.handleNew();
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	delete() {
		var that = this;
		if (confirm("Are you sure you want to delete this?")) {
			this.setState({
				loading: true
			}, function() {
				api.post("homework/delete", {
					id: that.props.modalState.id
				}, function() {
					that.props.openModal("");
					MyHomeworkSpace.Pages.homework.handleNew();
				});
			});
		}
	}

	keyup(e) {
		if (e.keyCode == 13 && !this.state.loading) {
			this.save();
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

				<PrefixedEdit class="homeworkModalName" placeholder="Name" value={state.name} onKeyUp={this.keyup.bind(this)} onInput={linkState(this, "name")} />
				<DatePicker value={state.due} change={this.changeDue.bind(this)} />
				<ClassPicker value={state.classId} change={this.changeClass.bind(this)} classes={props.classes} />
				<label>
					<input type="checkbox" checked={state.complete} onChange={linkState(this, "complete")} /> Done?
				</label>
				<textarea class="form-control homeworkModalDesc" placeholder="Description" onChange={linkState(this, "desc")} value={state.desc}></textarea>
			</div>
			<div class="modal-footer">
				{!state.isNew && <button type="button" class="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>}
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save changes</button>
			</div>
		</Modal>;
	}
};