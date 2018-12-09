import 'settings/AddPrefix.styl'

import { h, Component } from 'preact'

import ColorPicker from 'ui/ColorPicker.jsx';

class AddPrefix extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prefixItem: {
				background: "ff4086",
				color: this.calculateTextColor("ff4086"),
				words: [],
				timedEvent: 0,
			},
			words: "",
		}
		
		console.log(this.state.prefixItem)
	}

	handleChange(event) {
		this.setState({
			prefixItem: {
				words: event.target.value,
				background: this.state.prefixItem.background,
				color: this.state.prefixItem.color,
				timedEvent: this.state.prefixItem.timedEvent,
			},
			words: event.target.value
		})
	}

	handleTimedEventChange(event) {
		this.setState({
			prefixItem: {
				words: this.state.prefixItem.words,
				background: this.state.prefixItem.background,
				color: this.state.prefixItem.color,
				timedEvent: (event.target.value == "on" ? 1 : 0),
			}
		})
	}

	changeBackgroundColor(color) {
		this.setState({
			prefixItem: {
				words: this.state.prefixItem.words,
				background: color,
				color: this.calculateTextColor(color),
				timedEvent: this.state.timedEvent,
			},
		})
	}

	calculateTextColor(color) {
		const rgb = this.hexToRgb(color);
		const r = rgb.r * 255;
		const g = rgb.g * 255;
		const b = rgb.b * 255;
		const l = (r * 299 + g * 587 + b * 114) / 1000;
		return (l >= 128) ? '000000' : 'ffffff';
	}

	hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	render(props, state) {
		return (<div class="addPrefix">
			<ColorPicker onChange={this.changeBackgroundColor.bind(this)} value={this.state.prefixItem.background} />
			<input type="text" placeholder="Tags" class="addPrefixWords form-control" id="prefixEntry" onChange={this.handleChange.bind(this)} value={this.state.words} />
			<button class="btn btn-default" onClick={() => this.props.onAddPrefix(this.state.prefixItem)}>Add</button><br></br>
			<small>Seperate words by spaces.</small><br />
		<input type="checkbox" onChange={this.handleTimedEventChange.bind(this)}/><small>Use "on" instead of "due"</small>
		</div>)
	}
}

export default AddPrefix;