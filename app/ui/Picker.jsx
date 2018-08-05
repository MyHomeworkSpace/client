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
		if (this.props.open && this._pickerContainer) {
			// loop through the parents to see if we're one
			var targetIsChild = false;
			var currentElement = e.target;
			while (true) {
				if (currentElement == this._pickerContainer) {
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

	onFocus(e) {
		if (this.props.editable) {
			this.props.setOpen(true);
		}
	}

	toggle(e) {
		if (this.props.editable) {
			return;
		}
		this.props.setOpen(!this.props.open);
	}

	onChange(e) {
		this.props.onTextChange(e.target.value);
	}

	render(props, state) {
		var format = props.format || "ddd, MMMM Do, YYYY";
		return <div class={`pickerContainer ${props.containerClass || ""}`} ref={ (pickerContainer) => {
			this._pickerContainer = pickerContainer;
		}}>
			<div class={`picker ${props.editable ? "editable" : ""} ${props.open && props.editable ? "focus" : ""} ${props.class || ""}`} onClick={this.toggle.bind(this)}>
				{props.editable && <input type="text" value={props.display} onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} ref={ (pickerText) => {
					this._pickerText = pickerText;
				}}/>}
				{!props.editable && <div class="pickerOutput">{props.display}</div>}
				<div class="pickerAction">{props.action ? props.action : <i class={props.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} />}</div>
				<div class="pickerClear"></div>
			</div>
			{props.open && <div class="pickerContents">
				{props.children}
			</div>}
		</div>;
	}
}

export default Picker;