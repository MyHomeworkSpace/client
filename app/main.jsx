if (!PRODUCTION) {
	require("preact/debug");
}

import { h, render } from "preact";
import App from "App.jsx";

render(<App />, document.querySelector("#app"));