import { h, Component } from "preact";

import api from "api.js";

export default class PrefCheckbox extends Component {
	setValue(e) {
		var newVal = e.target.checked;
		if (this.props.inverted) {
			newVal = !newVal;
		}

		MyHomeworkSpace.Pages.settings.cache[this.props.pref] = newVal;
		api.post("prefs/set", {
			key: this.props.pref,
			value: newVal
		}, (data) => {
			if (this.props.onChange) {
				this.props.onChange(newVal);
			}
		});
	}

	render(props, state) {
		var checked = MyHomeworkSpace.Pages.settings.cache[props.pref] || false;

		if (props.inverted) {
			checked = !checked;
		}

		return <label>
			<input type="checkbox" checked={checked} onChange={this.setValue.bind(this)} /> {props.label}
		</label>;
	}
};