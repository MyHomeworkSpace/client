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
							<td><kbd>d</kbd></td>
							<td>Opens Dashboard</td>
						</tr>
						<tr>
							<td><kbd>p</kbd></td>
							<td>Opens Planner</td>
						</tr>
						<tr>
							<td><kbd>c</kbd></td>
							<td>Opens Calendar</td>
						</tr>
						<tr>
							<td><kbd>l</kbd></td>
							<td>Opens the Classes page</td>
						</tr>
						<tr>
							<td>
								<div><kbd>s</kbd></div>
								<div><kbd>control</kbd>+<kbd>,</kbd></div>
							</td>
							<td>Opens the Settings page</td>
						</tr>
						<tr>
							<td>
								<div><kbd>q</kbd></div>
								<div><kbd>control</kbd>+<kbd>space</kbd></div>
							</td>
							<td>Opens Quick Add</td>
						</tr>
						<tr>
							<td><kbd>?</kbd></td>
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