import { h, Component } from "preact";

import Modal from "ui/Modal.jsx";

export default class ShortcutModal extends Component {
	close() {
		this.props.openModal("");
	}

	render(props, state) {
		return <Modal title="Keyboard shortcuts" openModal={props.openModal}>
			<div class="modal-body">
				<p>Keyboard shortcuts can help make MyHomeworkSpace even faster and easier to use.</p>
				<p>Here's a list of available keyboard shortcuts:</p>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Shortcut</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>h</td>
							<td>Opens Homework view</td>
						</tr>
						<tr>
							<td>p</td>
							<td>Opens Planner view</td>
						</tr>
						<tr>
							<td>c</td>
							<td>Opens Calendar view</td>
						</tr>
						<tr>
							<td>l</td>
							<td>Opens the Classes page</td>
						</tr>
						<tr>
							<td>
								<div>q</div>
								<div>control+space</div>
							</td>
							<td>Opens Quick Add</td>
						</tr>
						<tr>
							<td>?</td>
							<td>Opens this help page</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};