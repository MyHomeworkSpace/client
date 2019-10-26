export function closestByClass(element, className) {
	while (!element.classList || !element.classList.contains(className)) {
		element = element.parentNode;
		if (!element) {
			return null;
		}
	}

	return element;
};