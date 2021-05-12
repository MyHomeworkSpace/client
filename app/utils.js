import moment from "moment";

export function closestByClass(element, className) {
	while (!element.classList || !element.classList.contains(className)) {
		element = element.parentNode;
		if (!element) {
			return null;
		}
	}

	return element;
};

export function relativeDate(due) {
	let dueText = due.calendar().split(" at ")[0];
	let daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);

	if (dueText.indexOf(" ") > -1) {
		dueText = dueText[0].toLowerCase() + dueText.substr(1);
	}

	if (daysTo > 8 && daysTo < 14) {
		dueText = "a week from " + due.format("dddd");
	} else if (daysTo == 8) {
		dueText = "a week from tomorrow";
	} else if (daysTo == 7) {
		dueText = "a week from today";
	}

	return dueText;
};