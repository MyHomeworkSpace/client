import prefixes from "prefixes.js";

var classes = [];
var classIds = [];
var classSynonyms = [
	["science", "sci", "bio", "biology", "chem", "chemistry", "physics"],
	["math", "algebra", "calculus", "calc", "pre-calculus", "precalculus", "precalc", "geometry", "geo"],
	["computer science", "compsci"],
	["language", "french", "latin", "spanish", "mandarin"]
];
var lexicon = {};

var findClass = function(name) {
	for (var classIndex in classes) {
		var classItem = classes[classIndex];
		var classId = classIds[classIndex];

		// check for exact match
		if (classItem.toLowerCase() == name.toLowerCase()) {
			// found it
			return {
				id: classId,
				name: classItem
			};
		}

		// check all synonyms
		for (var listIndex in classSynonyms) {
			var synonymList = classSynonyms[listIndex];
			if (synonymList.indexOf(classItem.toLowerCase()) > -1 && synonymList.indexOf(name.toLowerCase()) > -1) {
				// this class and the target name are synonyms
				return {
					id: classId,
					name: classItem
				};
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
			"week": undefined
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

			classes.push(classItem.name);
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
			} else if (word.substr(0, 3) == "tom") { // tomorrow
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

		response.tag = sentence.match("#MHSPrefix").terms(0).out().trim();
		response.due = sentence.match("#Date").out().trim();

		var className = sentence.match("(#MHSClass|#MHSClassSynonym)").terms(0).out().trim();
		response.class = findClass(className);

		var nameSentence = sentence;

		// class name
		nameSentence.replace("(#Conjunction|#Preposition)? (#MHSClass|#MHSClassSynonym) class?", "");
		// due date info
		nameSentence.replace("(#Conjunction|#Preposition)? #Date", "");
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
