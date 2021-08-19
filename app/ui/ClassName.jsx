import { h } from "preact";

export default function ClassName(props) {
	var classObject = props.classObject || {
		color: "000000",
		name: "No class"
	};
	return <span class="className"><span style={`display:inline-block;width:12px;height:12px;border-radius:100%;margin-right:2px;background-color:#${classObject.color}`} /> {classObject.name}</span>;
};