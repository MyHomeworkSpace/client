import { h, Component } from "preact";

import ColumbiaEnroll from "schools/columbia/ColumbiaEnroll.jsx";

export default class BarnardEnroll extends Component {
	render(props, state) {
		return <ColumbiaEnroll
			barnard={true}

			email={props.email}

			reenroll={props.reenroll}

			prev={props.prev}
			next={props.next}
		/>;
	}
};