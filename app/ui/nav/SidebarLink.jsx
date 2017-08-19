import "ui/nav/SidebarLink.styl";

import { h, Component } from "preact";

class SidebarLink extends Component {
	click() {
		if (this.props.currentPage != this.props.page) {
			// open the new page
			this.props.openPage(this.props.page);
		} else {
			// it's already open, so hide it
			this.props.openPage("");
		}		
	}

	render(props, state) {
		return <div onClick={this.click.bind(this)} class={`sidebarLink ${props.page == props.currentPage ? "selected": ""} ${props.tiny ? "tiny" : ""}`} onClick={this.click.bind(this)}>
			<i class={`fa fa-${props.icon} ${props.tiny ? "fa-fw" : ""}`} />
			{props.label}
		</div>;
	}
}

export default SidebarLink;