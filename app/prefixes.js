import api from "api.js";

var prefixes = [];
var fallback = {};

export default {
	list: null,

	init: function(callback) {
		api.get("prefixes/getList", {}, function(data) {
			prefixes = data.prefixes;
			fallback = {
				background: data.fallbackBackground,
				color: data.fallbackColor
			};

			MyHomeworkSpace.Prefixes.list = prefixes;

			callback();
		});
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