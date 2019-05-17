import "ui/PrefixedEdit.styl";

import { h, Component } from "preact";

import prefixes from "prefixes.js";

export default class PrefixedEdit extends Component {
	componentDidMount() {
		var textElement = document.querySelector(".prefixedEditText");
		var style = window.getComputedStyle(textElement, null);
		this._computedStyle = style;
	}

	getComputedStyle() {
		return this._computedStyle || {};
	}

	render(props, state) {
		var value = props.value || "";

		var prefix = value.split(" ")[0] || "";
		var prefixInfo = prefixes.matchPrefix(prefix);

		var showPrefix = (value.trim() != "");

		var textComputedStyle = this.getComputedStyle();

		var top = 0;
		var left = 0;

		var topProperties = [ "margin-top", "padding-top", "border-top-width" ];
		var leftProperties = [ "margin-left", "padding-left", "border-left-width" ];

		topProperties.forEach(function(property) {
			var propertyValue = parseInt((textComputedStyle[property] || "").replace("px", "")) || 0;
			top += propertyValue;
		});

		leftProperties.forEach(function(property) {
			var propertyValue = parseInt((textComputedStyle[property] || "").replace("px", "")) || 0;
			left += propertyValue;
		});

		var positionStyle = `top:${top}px;left:${left}px;`;		

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

				placeholder={props.placeholder || ""}
				value={value}

				onKeyUp={props.onKeyUp}
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