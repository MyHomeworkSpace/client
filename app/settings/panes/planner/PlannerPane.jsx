import { h, Component } from "preact";

import PrefCheckbox from "settings/PrefCheckbox.jsx";

export default class PlannerPane extends Component {
	render(props, state) {
		return <div>
			<PrefCheckbox pref="darkenDoneBoxes" label="Darken boxes with all work completed" />
		</div>;
	}
};