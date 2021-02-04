import { h, Component } from "preact";

import Modal from "ui/Modal.jsx";

export default class ImageInfoModal extends Component {
	close() {
		this.props.openModal("");
	}

	render(props, state) {
		return <Modal title="Image information" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body">
				<strong>{props.modalState.imageInfo.description}</strong>
				<p>By <a href={props.modalState.imageInfo.authorUrl}>{props.modalState.imageInfo.authorName}</a></p>
				<p><em>Image from <a href={props.modalState.imageInfo.siteUrl}>{props.modalState.imageInfo.siteName}</a></em></p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};