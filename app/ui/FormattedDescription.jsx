import "ui/FormattedDescription.styl";

import { h, Component } from "preact";

export default function FormattedDescription(props) {
	const parseMarkup = (line) => {
		// there's definitley a more efficient way to do this lol. This is a tiny bit too much recursion for my liking.
		const markups = [
			{
				// Bold
				regex: /(.*)\*(.*)\*(.*)/ig,
				markup: (match) => [parseMarkup(match[1]), <strong>{parseMarkup(match[2])}</strong>, parseMarkup(match[3])]
			},
			{
				// Italics
				regex: /(.*)_(.*)_(.*)/ig,
				markup: (match) => [parseMarkup(match[1]), <em>{parseMarkup(match[2])}</em>, parseMarkup(match[3])]
			},
			{
				// Strikethrough
				regex: /(.*)~(.*)~(.*)/ig,
				markup: (match) => [parseMarkup(match[1]), <strike>{parseMarkup(match[2])}</strike>, parseMarkup(match[3])]
			},
			{
				// Links
				// These have to be last because they don't have insides, so otherwise nesting breaks.
				regex: /(.*)(http[s]*:\/\/.*?)($|\s)(.*)/ig,
				markup: (match) => [parseMarkup(match[1]), <a href={match[2]}>{match[2]}</a>, parseMarkup(match[3] + match[4])]
			},

		];

		for (const markupKey in markups) {
			if (Object.hasOwnProperty.call(markups, markupKey)) {
				const markup = markups[markupKey];
				const matches = markup.regex.exec(line);
				if (matches) {
					return markup.markup(matches);
				}
			}
		}
		return line;
	};

	return <div class="formattedDescription">
		{props.text.split("\n").map((line) => {
			return <div>{parseMarkup(line)}</div>;
		})}
	</div>;
};