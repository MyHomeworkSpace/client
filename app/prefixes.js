let prefixes = [];
let fallback = {};

module.exports = {
	list: null,

	initWithContext: function(context) {
		prefixes = context.prefixes;
		fallback = {
			background: context.prefixFallbackBackground,
			color: context.prefixFallbackColor
		};

		MyHomeworkSpace.Prefixes.list = prefixes;
	},
	matchPrefix: function(prefix) {
		let chkPrefix = prefix.toLowerCase();
		for (let prefixIndex in prefixes) {
			for (let wordIndex in prefixes[prefixIndex].words) {
				if (prefixes[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
					return prefixes[prefixIndex];
				}
			}
		}
		return fallback;
	}
};