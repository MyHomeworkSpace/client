import { h, Component } from "preact";

class EditClassButton extends Component {
	handleClick() {
		this.props.openModal("class", this.props.classItem);
	}

	render(props, state) {
		return <button class="btn btn-default" onClick={this.handleClick.bind(this)}><i class="fa fa-pencil-square" aria-hidden="true"></i> Edit class</button>
	}
}

export default EditClassButton;