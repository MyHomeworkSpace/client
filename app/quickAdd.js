import moment from "moment";

import prefixes from "prefixes.js";

var classes = [];
var classIds = [];
var classSynonyms = [
	["science", "sci", "bio", "biology", "chem", "chemistry", "physics"],
	["math", "algebra", "calculus", "calc", "pre-calculus", "precalculus", "precalc", "geometry", "geo"],
	["computer science", "compsci", "cs"],
	["language", "french", "latin", "spanish", "span", "mandarin"],
	["history", "us history", "hist", "ush"],
	["english", "eng"]
];
var lexicon = {};

var normalizeName = function(name) {
	return name.replace(/ /g, "").replace(/\./g, "").toLowerCase();
};

var findClass = function(name) {
	var normalizedName = normalizeName(name);
	for (var classIndex in classes) {
		var classItem = classes[classIndex];
		var classNormalized = normalizeName(classItem.name);

		// check for exact match
		if (classNormalized == normalizedName) {
			// found it
			return classItem;
		}

		// check all synonyms
		for (var listIndex in classSynonyms) {
			var synonymList = classSynonyms[listIndex];

			var hasClassName = false;
			var hasSearchName = false;

			for (var synonymIndex in synonymList) {
				var synonym = synonymList[synonymIndex];
				var normalizedSynonym = normalizeName(synonym);

				if (normalizedSynonym == classNormalized){
					hasClassName = true;	
				} else if (normalizedSynonym == normalizedName) {
					hasSearchName = true;
				}
			}

			if (hasClassName && hasSearchName) {
				// this class and the target name are synonyms
				return classItem;
			}
		}
	}
	return null;
};

export default {
	init: function() {
		// reset state
		// (required because init can be called multiple times on a page load if the class list changes)
		classes = [];
		classIds = [];
		lexicon = {
			// these things aren't descriptive enough to be useful dates, so remove them from the lexicon
			"day": undefined,
			"week": undefined,

			// these are abberivations for dates
			"tmr": "Date",
			"tmrw": "Date",
			"tue": "Date",
			"thu": "Date",
		};

		// handle prefix list
		for (var prefixIndex in prefixes.list) {
			var prefix = prefixes.list[prefixIndex];
			for (var wordIndex in prefix.words) {
				// tell nlp_compromise
				var word = prefix.words[wordIndex];
				lexicon[word.toLowerCase()] = "MHSPrefix";
			}
		}

		// add synonyms first so that the real classes can overwrite them
		for (var listIndex in classSynonyms) {
			var synonymList = classSynonyms[listIndex];
			for (var synonymIndex in synonymList) {
				var synonym = synonymList[synonymIndex];
				lexicon[synonym.toLowerCase()] = "MHSClassSynonym";
			}
		}

		// handle class list
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];

			// tell nlp_compromise
			lexicon[classItem.name.toLowerCase()] = "MHSClass";
			lexicon[classItem.name.toLowerCase().replace(/ /g, "")] = "MHSClass";
			lexicon[classItem.name.toLowerCase().replace(/\./g, "")] = "MHSClass";
			lexicon[normalizeName(classItem.name)] = "MHSClass";

			classes.push(classItem);
			classIds.push(classItem.id);
		}
	},
	parseDate: function(text) {
		if (!isNaN(moment(text).day())) {
			var foundDate = moment(text);
			if (moment().month() > foundDate.month()) {
				// today's month is after the entered month, meaning it's probably due next year
				foundDate.year(moment().year() + 1);
			} else {
				// it's this year
				foundDate.year(moment().year());
			}
			return foundDate.format("YYYY-MM-DD");
		}
		var textToParse = text.toLowerCase().split(" ");
		var result = {
			last: false,
			next: false,
			dow: -1
		};
		for (var wordIndex in textToParse) {
			var word = textToParse[wordIndex];
			if (word == "last") {
				result.last = true;
			} else if (word == "next") {
				result.next = true;
			} else if (word.substr(0, 3) == "sun") {
				result.dow = 0;
			} else if (word.substr(0, 3) == "mon") {
				result.dow = 1;
			} else if (word.substr(0, 3) == "tue") {
				result.dow = 2;
			} else if (word.substr(0, 3) == "wed") {
				result.dow = 3;
			} else if (word.substr(0, 3) == "thu") {
				result.dow = 4;
			} else if (word.substr(0, 3) == "fri") {
				result.dow = 5;
			} else if (word.substr(0, 3) == "sat") {
				result.dow = 6;
			} else if (word.substr(0, 3) == "ton") { // tonight
				result.dow = moment().day();
			} else if (word.substr(0, 3) == "tom" || word.substr(0, 3) == "tmr") { // tomorrow
				result.dow = moment().day() + 1;
				if (result.dow == 7) {
					result.dow = 0;
				}
			}
		}
		if (result.dow == -1) {
			return "";
		}
		var resultDate = moment();
		var thisWeek = resultDate.week();
		while (
			((result.last || result.next) && (resultDate.week() == thisWeek || resultDate.day() != result.dow)) ||
			((!result.last && !result.next) && (resultDate.day() != result.dow))
		) {
			if (result.last) {
				resultDate.subtract(1, "day");
			} else {
				resultDate.add(1, "day");
			}
		}
		return resultDate.format("YYYY-MM-DD");
	},
	parseText: function(text) {
		// examples:
		// [read poem] [for English] for [tomorrow]
		// take [test on molecules] [in Science] on [next Tuesday]
		// [next Friday] write an [essay about the revolution] [in History] class

		var response = {
			tag: "",
			name: "",
			class: null,
			due: ""
		};
		var sentence = nlp(text, lexicon);

		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var hasSpace = classItem.name.indexOf(" ") > -1;

			if (hasSpace) {
				// special case: make it one word
				sentence.replace(classItem.name, classItem.name.replace(/ /g, ""));
			}
		}

		// values probably shouldn't be flagged as dates
		// this fixes things like "HW 7.2 tuesday", where "7.2 tuesday" is chosen as date
		// we also check if it's a class name, in case you have a class named something like "6.003"
		// it's a bit of a hack but it works
		sentence.terms().list.forEach(function(term) {
			var tags = term.get(0).tags;
			if (tags.Value || Object.keys(tags).length == 0) {
				if (term.get(0).tags.Date) {
					term.get(0).tags.Date = false;
				}

				var text = term.get(0).text;
				var normalizedText = text.replace(/ /g, "").toLowerCase();
				if (lexicon[normalizedText] == "MHSClass") {
					term.get(0).tags.MHSClass = true;
				}
			}
		});

		response.tag = sentence.match("#MHSPrefix").terms(0).out().trim();
		response.due = sentence.replace("Test", "").replace("test", "").match("#Date").out().trim();

		var className = sentence.match("(#MHSClass|#MHSClassSynonym)").terms(0).out().replace(/ /g, "").toLowerCase().trim();
		response.class = findClass(className);

		var nameSentence = sentence;

		// class name
		nameSentence.replace("(#Conjunction|#Preposition)? (#MHSClass|#MHSClassSynonym) class?", "");
		// due date info
		nameSentence.replace("(#Conjunction|#Preposition|due)? #Date", "");
		// prefix info
		nameSentence.replace("*+ #MHSPrefix", "");
		nameSentence.replace("#MHSPrefix", "");

		response.name = nameSentence.out().trim();

		if (!response.tag.trim() && response.name) {
			var nameParts = response.name.split(" ");
			var assignedPrefix = nameParts[0];
			nameParts.shift();

			response.tag = assignedPrefix;
			response.name = nameParts.join(" ");
		} else {
			// correct capitalization of the prefix
			for (var prefixIndex in prefixes.list) {
				var prefix = prefixes.list[prefixIndex];
				for (var wordIndex in prefix.words) {
					var word = prefix.words[wordIndex];
					if (word.toLowerCase() == response.tag.toLowerCase()) {
						response.tag = word;
					}
				}
			}
		}

		return response;
	}
};
