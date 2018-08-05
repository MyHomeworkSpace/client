import "ui/nav/NavLogo.styl";

import { h, Component } from "preact";

class NavLogo extends Component {
	render(props, state) {
		return <div class="navLogo">
			<img src="/img/icon128.png" />
		</div>;
	}
}

export default NavLogo;