import { h, Component } from "preact";
import "auth/PasswordSecurityCheck.styl";

// Checks to see if a password meets the requirements. Returns an int array of the rules that it fails
export function checkPassword(password) {
	let failed = [];

	for (var rule in passwordRules) {
		if (!passwordRules[rule].check(password)) {
			failed.push(parseInt(rule));
		}
	}

	return failed;
}

export const passwordRules = [
	{
		name: "Must have at least 8 characters",
		check: function(password) {
			return (password.length >= 8);
		}
	},
	{
		name: "Must contain a number",
		check: function(password) {
			return /[0-9]/.test(password);
		}
	},
	{
		name: "Must contain a letter",
		check: function(password) {
			return /[A-z]/.test(password);
		}
	}
];

export class PasswordSecurityCheck extends Component {
	render(props, state) {
		var failed = checkPassword(props.password);
		var items = passwordRules.map((rule, i) => {
			return <li>
				<i class={`fa-li fa fa-${failed.includes(i) ? "times" : "check"}-circle ${failed.includes(i) ? "red" : "green"}`}></i> {rule.name}
			</li>;
		});

		return <div class="passwordSecurityCheck">
			<ul class="fa-ul">
				{items}
			</ul>
		</div>;
	}
}