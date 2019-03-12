import { h, Component } from "preact";

class SwapClassButton extends Component {
	handleClick() {
		this.props.openModal("classSwap", this.props.classItem);
	}

	render(props, state) {
		return <button class="btn btn-default" onClick={this.handleClick.bind(this)}><i class="fa fa-arrows-v" aria-hidden="true"></i> Swap class</button>;
	}
}

export default SwapClassButton;