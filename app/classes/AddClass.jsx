import "classes/AddClass.styl";

import { h, Component } from "preact";

class AddClass extends Component {
	constructor() {
		super();
	}

	handleClick() {
		this.props.openModal("class", {});
	}

	render(props, state) {
		return <div class="addClass" onClick={this.handleClick.bind(this)}><i class="fa fa-plus-square-o" aria-hidden="true"></i> Add class</div>;
	}
}

export default AddClass;