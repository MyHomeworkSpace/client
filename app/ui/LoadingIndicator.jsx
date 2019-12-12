import { h, Component } from "preact";

export default class LoadingIndicator extends Component {
	render(props, state) {
		return <i class="fa fa-refresh fa-spin" />;
	}
};