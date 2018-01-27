import "ui/Picker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

class Picker extends Component {
	constructor(props) {
		super(props);
		this._bodyClick = this.onBodyClick.bind(this);
		this.state = {};
	}

	componentWillMount() {
		document.body.addEventListener("click", this._bodyClick);
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this._bodyClick);
	}

	onBodyClick(e) {
		if (this.props.open && this._pickerContents) {
			// loop through the parents to see if we're one
			var targetIsChild = false;
			var currentElement = e.target;
			while (true) {
				if (currentElement == this._pickerContents) {
					// found it, so stop
					targetIsChild = true;
					break;
				}
				var parent = currentElement.parentNode;
				if (parent == document) {
					// reached the top, stop now
					break;
				} else {
					// continue searching
					currentElement = parent;
				}
			}
			if (!targetIsChild) {
				this.props.setOpen(false);
			}
		}
	}

	toggle(e) {
		this.props.setOpen(!this.props.open);
	}

	render(props, state) {
		var format = props.format || "ddd, MMMM Do, YYYY";
		return <div class="pickerContainer">
			<div class={`picker ${props.class || ""}`} onClick={this.toggle.bind(this)}>
				<div class="pickerOutput">{props.display}</div>
				<div class="pickerAction"><i class={props.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="pickerClear"></div>
			</div>
			{props.open && <div class="pickerContents" ref={ (pickerContents) => {
				this._pickerContents = pickerContents;	
			}}>
				{props.children}
			</div>}
		</div>;
	}
}

export default Picker;