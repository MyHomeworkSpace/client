var classes = [];
var classIds = [];
var prefixList = [];
var casePrefixList = [];
var classSynonyms = [
	["science", "sci", "bio", "biology", "chem", "chemistry", "physics"],
	["math", "algebra", "calculus", "calc", "pre-calculus", "precalculus", "precalc", "geometry", "geo"],
	["computer science", "compsci"],
	["language", "french", "latin", "spanish", "mandarin"]
];
var lexicon = {};

var isClass = function(array, index) {
	var classMatches = false;
	var termsToSkip = 0;
	var arrIndex = index;
	for (var classIndex in classes) {
		var classItem = classes[classIndex];
		var classWords = classItem.split(" ");
		arrIndex = index;
		for (var i = 0; i < classWords.length; i++) {
			if (array.length <= arrIndex) {
				if (classMatches) {
					break;
				} else {
					continue;
				}
			}
			if (classWords[i].toLowerCase() == array[arrIndex].text.toLowerCase()) {
				classMatches = true;
			} else {
				classMatches = false;
				for (var synonymsIndex in classSynonyms) {
					if (classSynonyms[synonymsIndex].indexOf(classWords[i].toLowerCase()) > -1) {
						if (classSynonyms[synonymsIndex].indexOf(array[arrIndex].text.toLowerCase()) > -1) {
							classMatches = true;
						}
					}
				}
			}
			arrIndex++;
		}
		if (classMatches) {
			break;
		}
	}
	return {
		match: classMatches,
		classIndex: parseInt(classIndex),
		termsToSkip: arrIndex - index
	};
};

export default {
	init: function() {
		var lexicon = {
			// these things aren't descriptive enough to be useful dates, so remove them from the lexicon
			"day": undefined,
			"week": undefined,

			// these things cause nlp_compromise to get very confused
			// "hw pa" doesn't mean a highway in philadelphia
			"hw": undefined,
			"pa": undefined,
		};

		// this is a bit of a hack to get nlp_compromise to like prefixes
		// i know that "hw" and "essay" aren't verbs
		// nlp_compromise doesn't
		for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
			var prefix = MyHomeworkSpace.Prefixes.list[prefixIndex];
			for (var wordIndex in prefix.words) {
				var word = prefix.words[wordIndex];
				lexicon[word.toLowerCase()] = "Infinitive";
			}
		}

		lexicon = lexicon;

		classes = [];
		classIds = [];
		prefixList = [];
		casePrefixList = [];
		for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
			var prefix = MyHomeworkSpace.Prefixes.list[prefixIndex];
			for (var wordIndex in prefix.words) {
				casePrefixList.push(prefix.words[wordIndex]);
				prefixList.push(prefix.words[wordIndex].toLowerCase());
			}
		}
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			classes.push(MyHomeworkSpace.Classes.list[classIndex].name.toLowerCase());
			classIds.push(MyHomeworkSpace.Classes.list[classIndex].id);
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
			class: "",
			classId: 0,
			due: ""
		};
		var sentence = nlp(text, lexicon);
		var nameTrack = false;
		var termsToSkip = 0;

		var terms = sentence.list[0].terms;

		for (var termIndex in terms) {
			var term = terms[termIndex];
			if (termsToSkip > 0) {
				termsToSkip--;
			} else if (prefixList.indexOf(term.text.toLowerCase()) > -1) {
				var prefixIndex = prefixList.indexOf(term.text.toLowerCase());
				response.tag = casePrefixList[prefixIndex];
				nameTrack = true;
			} else if (term.tags.Date) {
				response.due = term.text;
			} else if (term.tags.Conjunction || term.tags.Preposition) {
				// peek at the next word
				var classResults = isClass(terms, parseInt(termIndex) + 1);
				if (terms[parseInt(termIndex) + 1] && classResults.match) {
					// if it's a class, set it and skip it
					response.class = MyHomeworkSpace.Classes.list[classResults.classIndex].name;
					response.classId = classIds[classResults.classIndex];
					termsToSkip = classResults.termsToSkip;
				} else if ((parseInt(termIndex) + 1) != terms.length && terms[parseInt(termIndex) + 1].tags.Date) {
					// the next word is a due date, so skip this word
				} else if (nameTrack) {
					response.name += term.text;
					response.name += " ";
				}
			} else if (term.text.toLowerCase() == "due" || term.text.toLowerCase() == "class") {
				// skip it
			} else if (nameTrack) {
				response.name += term.text;
				response.name += " ";
			}
		}

		response.name = response.name.trim();
		response.due = sentence.match("#Date").out().trim();

		return response;
	}
};
