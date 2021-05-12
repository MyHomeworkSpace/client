import "ui/FormattedDescription.styl";

import { h, Component } from "preact";

export default class FormattedDescription extends Component {
	render(props, state) {
		return <div class="formattedDescription">
			{props.text.split("\n").map((line) => {
				const linkRegex = /(http[s]*:\/\/.*?)($|\s)/ig;

				const parts = [];
				let index = 0;

				while (true) {
					const part = linkRegex.exec(line);

					if (!part) {
						// we're done
						parts.push(<span>{line.substring(index)}</span>);
						break;
					}

					// add the part from before this match up to this match
					parts.push(<span>{line.substring(index, part.index)}</span>);

					// add the link
					const url = part[1];
					parts.push(<a href={url} target="_blank" rel="noopener noreferrer">{url}</a>);

					// continue
					index = part.index + url.length;
				}

				return <div>{parts}</div>;
			})}
		</div>;
	}
};