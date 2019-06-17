import { h, Component } from "preact";

import PrefCheckbox from "settings/PrefCheckbox.jsx";

export default class QuickAddPane extends Component {
	render(props, state) {
		return <div>
			<p>Quick Add lets you add homework to your planner by typing in information about it. Examples:</p>
			<ul>
				<li>read chapter 3 for English tomorrow</li>
				<li>take test on unit 4 in Science next Tuesday</li>
				<li>next Friday, I have to write an essay about the revolution for History</li>
			</ul>
			<p>You can access Quick Add from the "<i class="fa fa-plus-square"></i> Add homework" button above, or with the Control-Space keyboard shortcut.</p>

			<PrefCheckbox pref="disableQuickAdd" inverted label="Enable Quick Add" />
		</div>;
	}
};