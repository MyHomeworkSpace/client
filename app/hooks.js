import { useState } from "preact/hooks";

export const useInput = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	return [
		value,
		setValue,
		{
			value: value,
			onInput: (e) => {
				setValue(e.target.value);
			}
		}
	];
};