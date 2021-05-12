import "classes/ClassSwapModal.styl";

import { h, Component } from "preact";

import api from "api.js";

import ClassName from "ui/ClassName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

export default class ClassSwapModal extends Component {
	close() {
		this.props.openModal("");
	}

	swap(otherClass) {
		this.setState({
			loading: true
		}, () => {
			api.post("classes/swap", {
				id1: this.props.modalState.id,
				id2: otherClass.id
			}, () => {
				this.props.refreshContext(() => {
					this.close();
				});
			});
		});
	}

	render(props, state) {
		let title = "Swap '" + props.modalState.name + "'";

		if (state.loading) {
			return <Modal title={title} noClose openModal={props.openModal} class="classSwapModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		return <Modal title={title} openModal={props.openModal} class="classSwapModal">
			<div class="modal-body">
				<p>Select a class to swap '{props.modalState.name}' with.</p>
				{props.classes.map((classItem) => {
					if (classItem.id == props.modalState.id) {
						// don't show the current class as an option
						return null;
					}
					return <div class="classSwapOption" onClick={this.swap.bind(this, classItem)}>
						<ClassName classObject={classItem} />
					</div>;
				})}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};