import "ui/Picker.styl";

import { h, Component } from "preact";

export default class Picker extends Component {
	constructor(props) {
		super(props);
		this._bodyClick = this.onBodyClick.bind(this);
		this.state = {
			focus: false
		};
	}

	componentDidMount() {
		document.body.addEventListener("click", this._bodyClick);
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this._bodyClick);
	}

	onBodyClick(e) {
		if (this.props.open && this._pickerContainer) {
			// loop through the parents to see if we're one
			let targetIsChild = false;
			let currentElement = e.target;
			while (true) {
				if (currentElement == this._pickerContainer) {
					// found it, so stop
					targetIsChild = true;
					break;
				}
				let parent = currentElement.parentNode;
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

	onFocusOrBlur(focus) {
		if (!this.props.editable) {
			return;
		}
		this.props.setOpen(focus);
		this.setState({ focus: focus });
	}

	toggle() {
		if (this.props.editable) {
			return;
		}
		this.props.setOpen(!this.props.open);
	}

	onChange(e) {
		this.props.onTextChange(e.target.value);
	}

	render(props, state) {
		return <div class={`pickerContainer ${props.containerClass || ""}`} ref={(pickerContainer) => {
			this._pickerContainer = pickerContainer;
		}}>
			<div
				class={`picker ${props.editable ? "editable" : ""} ${state.focus ? "focus" : ""} ${props.class || ""}`}
				onClick={this.toggle.bind(this)}
				tabIndex={props.editable ? "-1" : "0"}
				onFocus={this.onFocusOrBlur.bind(this, true)}
				onBlur={this.onFocusOrBlur.bind(this, false)}>

				{props.editable && <input type="text" value={props.display} onChange={this.onChange.bind(this)} onFocus={this.onFocusOrBlur.bind(this, true)} onBlur={this.onFocusOrBlur.bind(this, false)} ref={ (pickerText) => {
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
};