import "homework/HomeworkModal.styl";

import { h } from "preact";
import { useState, useEffect, useCallback, useRef } from "preact/hooks";

import moment from "moment";

import api from "api.js";
import errors from "errors.js";
import { handleNew } from "homework.js";

import ClassPicker from "ui/ClassPicker.jsx";
import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";
import PrefixedEdit from "ui/PrefixedEdit.jsx";

export default function HomeworkModal(props) {
	const isNew = !props.modalState.id;
	const [name, setName] = useState(props.modalState.name || "");
	const [due, setDue] = useState((props.modalState.due ? moment(props.modalState.due, "YYYY-MM-DD") : moment()));
	const [classId, setClassId] = useState(props.modalState.classId || -1);
	const [isComplete, setIsComplete] = useState(isNew ? 0 : props.modalState.complete);
	const [desc, setDesc] = useState(isNew ? "" : props.modalState.desc);
	const [err, setErr] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const nameInputRef = useRef();

	const save = useCallback(function() {
		if (name == "") {
			setErr("You must enter a name.");
			return;
		}
		if (classId == -1) {
			setErr("You must select a class.");
			return;
		}

		setIsLoading(true);

		const homeworkInfo = {
			name,
			desc,
			classId,
			due: due.format("YYYY-MM-DD"),
			complete: (isComplete ? "1" : "0"),
		};

		if (!isNew) {
			homeworkInfo.id = props.modalState.id;
		}

		api.post((isNew ? "homework/add" : "homework/edit"), homeworkInfo, (data) => {
			if (data.status == "ok") {
				props.openModal("");
				handleNew();
			} else {
				setIsLoading(false);
				setErr(errors.getFriendlyString(data.error));
			}
		});
	}, [classId, desc, due, isComplete, isNew, name, props]);

	const del = function() {
		if (confirm("Are you sure you want to delete this?")) {
			setIsLoading(true);

			api.post("homework/delete", {
				id: props.modalState.id
			}, (data) => {
				if (data.status == "ok") {
					props.openModal("");
					handleNew();
				} else {
					setIsLoading(false);
					setErr(errors.getFriendlyString(data.error));
				}
			});
		}
	};

	useEffect(() => {
		if (props.modalState.direct) {
			save();
		}
	}, [props.modalState.direct, save]);

	useEffect(() => {
		nameInputRef.current.focus();
	}, []);

	if (isLoading) {
		return <Modal title={(isNew ? "Add homework" : "Edit homework")} openModal={props.openModal} noClose class="homeworkModal">
			<div class="modal-body">
				<LoadingIndicator type="inline" /> Loading, please wait...
			</div>
		</Modal>;
	}

	const keydown = (e) => {
		if (e.keyCode == 13) {
			save();
			e.preventDefault();
			return false;
		}
	};

	const descriptionKeydown = (e) => {
		if (e.keyCode == 13 && (e.shiftKey || e.ctrlKey)) {
			save();
			e.preventDefault();
			return false;
		}
	};

	return <Modal title={(isNew ? "Add homework" : "Edit homework")} openModal={props.openModal} class="homeworkModal">
		<div class="modal-body">
			{err && <div class="alert alert-danger">{err}</div>}

			<div class="homeworkModalBody">

				<div class="homeworkModalNameWrapper">
					<PrefixedEdit class="homeworkModalName" placeholder="Name" inputRef={nameInputRef} value={name} onKeyDown={keydown} onInput={(e) => setName(e.target.value)} />
				</div>

				<div class="doneCheckbox">
					<label>
						<input type="checkbox" checked={isComplete} onChange={(e) => setIsComplete(e.target.checked)} />&nbsp;Done
					</label>
				</div>
				<div class="datePicker">
					<DatePicker value={due} change={setDue} />
				</div>
				<div class="classPicker">
					<ClassPicker value={classId} change={setClassId} classes={props.classes} />
				</div>

				<textarea class="form-control homeworkModalDesc" placeholder="Description" onInput={(e) => setDesc(e.target.value)} onKeyDown={descriptionKeydown} value={desc}></textarea>
			</div>
		</div>
		<div class="modal-footer">
			{!isNew && <button type="button" class="btn btn-danger" onClick={del}>Delete</button>}
			<button type="button" class="btn btn-primary" onClick={save}>{isNew ? "Add homework" : "Save changes"}</button>
		</div>
	</Modal>;
}