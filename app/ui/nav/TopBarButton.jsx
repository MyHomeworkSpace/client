import "ui/nav/TopBarButton.styl";

import { h, Component } from "preact";

export default class TopBarButton extends Component {
	render(props, state) {
		return <div class={`topBarButton ${props.selected ? "selected": ""}`} onClick={props.onClick}>
			<span class="topBarButtonText">
				<i class={`fa fa-fw fa-${props.icon}`} />
				<span class="topBarButtonLabel">{props.children}</span>
			</span>
		</div>;
	}
}