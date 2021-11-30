import { h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

export default function Redirect(props) {
	useEffect(() => {
		route(this.props.to, true);
	});

	return null;
}