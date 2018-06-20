import "classes/ClassSwapModal.styl";

import { h, Component } from "preact";

import api from "api.js";

import ClassName from "ui/ClassName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

class ClassSwapModal extends Component {
	close() {
		this.props.openModal("");
	}

	swap(otherClass) {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.post("classes/swap", {
				id1: this.props.modalState.id,
				id2: otherClass.id
			}, function(response) {
				that.props.refreshClasses(function() {
					that.close.call(that);
				});
			});
		});
	}

	render(props, state) {
		var that = this;
		var title = "Swap '" + props.modalState.name + "'";

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
				{props.classes.map(function(classItem) {
					if (classItem.id == props.modalState.id) {
						// don't show the current class as an option
						return null;
					}
					return <div class="classSwapOption" onClick={that.swap.bind(that, classItem)}>
						<ClassName classObject={classItem} />
					</div>;
				})}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
}

export default ClassSwapModal;