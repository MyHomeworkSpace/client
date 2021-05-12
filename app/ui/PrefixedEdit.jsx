import "ui/PrefixedEdit.styl";

import { h, Component } from "preact";

import prefixes from "prefixes.js";

export default class PrefixedEdit extends Component {
	componentDidMount() {
		let textElement = document.querySelector(".prefixedEditText");
		let style = window.getComputedStyle(textElement, null);
		this.setState({
			computedStyle: style
		});
	}

	render(props, state) {
		let value = props.value || "";

		let prefix = value.split(" ")[0] || "";
		let prefixInfo = prefixes.matchPrefix(prefix);

		let showPrefix = (value.trim() != "");

		let textComputedStyle = state.computedStyle || {};

		let top = 0;
		let left = 0;
		let bottom = 0;

		let topProperties = [ "margin-top", "padding-top", "border-top-width" ];
		let leftProperties = [ "margin-left", "padding-left", "border-left-width" ];
		let bottomProperties = [ "margin-bottom", "padding-bottom", "border-bottom-width" ];
		let cloneProperties = [ "font-size" ];

		topProperties.forEach(function(property) {
			let propertyValue = parseInt((textComputedStyle[property] || "").replace("px", "")) || 0;
			top += propertyValue;
		});

		leftProperties.forEach(function(property) {
			let propertyValue = parseInt((textComputedStyle[property] || "").replace("px", "")) || 0;
			left += propertyValue;
		});

		bottomProperties.forEach(function(property) {
			let propertyValue = parseInt((textComputedStyle[property] || "").replace("px", "")) || 0;
			bottom += propertyValue;
		});

		let computedHeight = parseInt((textComputedStyle["height"] || "").replace("px", "")) || 0;

		let positionStyle = `top:${top}px;left:${left}px;height:${computedHeight - top - bottom}px;`;

		cloneProperties.forEach(function(property) {
			let propertyValue = (textComputedStyle[property] || "");
			positionStyle += property + ":" + propertyValue + ";";
		});

		return <div class={`prefixedEdit ${props.class || ""}`}>
			{showPrefix && <div
				class="prefixedEditPrefix prefixedEditPrefixBackground"
				style={`background-color:#${prefixInfo.background};` + positionStyle}
			>
				{prefix}
			</div>}
			<input
				type="text"
				class="prefixedEditText form-control"
				autoComplete="nope"

				placeholder={props.placeholder || ""}
				value={value}

				onKeyDown={props.onKeyDown}
				onChange={props.onChange}
				onInput={props.onInput}
			/>
			{showPrefix && <div
				class="prefixedEditPrefix prefixedEditPrefixText"
				style={`color:#${prefixInfo.color};` + positionStyle}
			>
				{prefix}
			</div>}
		</div>;
	}
};