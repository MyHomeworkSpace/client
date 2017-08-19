import "ui/nav/SidebarToggleButton.styl";

import { h, Component } from "preact";

class SidebarToggleButton extends Component {
	render(props, state) {
		return <div class="sidebarToggleButton">
			<i class="fa fa-bars" />
		</div>;
	}
}

export default SidebarToggleButton;