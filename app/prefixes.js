import api from "api.js";

var prefixes = [];
var fallback = {};

export default {
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
		var chkPrefix = prefix.toLowerCase();
		for (var prefixIndex in prefixes) {
			for (var wordIndex in prefixes[prefixIndex].words) {
				if (prefixes[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
					return prefixes[prefixIndex];
				}
			}
		}
		return fallback;
	}
};