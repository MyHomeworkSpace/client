import "ui/Modal.styl";

import { h, Component } from "preact";

export default class Modal extends Component {
	close() {
		this.props.openModal("", {});
	}

	render(props, state) {
		return <div class={`modal modal-preact ${!props.noClose && "noClose"} ${props.class ? props.class : ""}`} style="display: block; padding-left: 0px">
			<div class="modal-dialog" role="document">
				<div class="modal-content modal-animation">
					<div class="modal-header">
						{!props.noClose && <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.close.bind(this)}><span aria-hidden="true">&times;</span></button>}
						<h4 class="modal-title">{props.title}</h4>
					</div>
					{props.children}
				</div>
			</div>
		</div>;
	}
};