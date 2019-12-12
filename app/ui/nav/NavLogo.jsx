import "ui/nav/NavLogo.styl";

import { h, Component } from "preact";

export default class NavLogo extends Component {
	render(props, state) {
		return <div class="navLogo">
			<a href="/">
				<img src="/img/icon128.png" />
			</a>
		</div>;
	}
};