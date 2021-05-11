import { h } from "preact";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default function SecurityKeyPrompt() {
	return <div class="text-center">
		<LoadingIndicator type="large" />
		<h1>Authenticate now</h1>
		<p>Insert and touch your security key to authenticate.</p>
	</div>;
}