// this doesn't use the import statements the rest of the code uses
// because it makes the unit test runner sad
let moment = require("moment");
let nlp = require("compromise");
let nlpNumbers = require("compromise-numbers");
let nlpDates = require("compromise-dates");
let prefixes = require("./prefixes");

if (nlp.default) {
	nlp = nlp.default;
}
if (nlpDates.default) {
	nlpDates = nlpDates.default;
}
if (nlpNumbers.default) {
	nlpNumbers = nlpNumbers.default;
}
nlp.extend(nlpNumbers);
nlp.extend(nlpDates);

let classMap = {};
let classSynonyms = [
	["science", "sci", "bio", "biology", "chem", "chemistry", "physics"],
	["math", "algebra", "calculus", "calc", "pre-calculus", "precalculus", "precalc", "geometry", "geo"],
	["computer science", "compsci", "cs"],
	["language", "french", "latin", "spanish", "span", "mandarin"],
	["history", "us history", "hist", "ush"],
	["english", "eng", "fws"]
];
let lexicon = {};

let normalizeName = function(name) {
	return name.replace(/ /g, "").replace(/\./g, "").toLowerCase();
};

let findClass = function(name) {
	let normalizedName = normalizeName(name);
	for (let classID in classMap) {
		let classItem = classMap[classID];
		let classNormalized = normalizeName(classItem.name);

		// check for exact match
		if (classNormalized == normalizedName) {
			// found it
			return classItem;
		}

		// check all synonyms
		for (let listIndex in classSynonyms) {
			let synonymList = classSynonyms[listIndex];

			let hasClassName = false;
			let hasSearchName = false;

			for (let synonymIndex in synonymList) {
				let synonym = synonymList[synonymIndex];
				let normalizedSynonym = normalizeName(synonym);

				if (normalizedSynonym == classNormalized) {
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

let assignYearToDate = function(date) {
	if (moment().month() > date.month()) {
		// today's month is after the entered month, meaning it's probably due next year
		date.year(moment().year() + 1);
	} else {
		// it's this year
		date.year(moment().year());
	}
	return date;
};

let resolveDate = function(text) {
	// let's try some common formats
	let parsed = moment(text, [
		"YYYY-MM-DD",
		"MM-DD-YYYY",
		"DD-MM-YYYY"
	]);
	if (parsed.isValid()) {
		return parsed;
	}

	// let's see if the browser can understand it
	if (!isNaN(new Date(text))) {
		return moment(new Date(text));
	}

	let textToParse = text.toLowerCase().split(" ");
	let result = {
		last: false,
		next: false,
		dow: -1
	};
	for (let wordIndex in textToParse) {
		let word = textToParse[wordIndex];
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
		} else if (word.substr(0, 3) == "tod" || word.substr(0, 3) == "ton") { // today, tonight
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
	let resultDate = moment();
	let thisWeek = resultDate.week();
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
	return resultDate;
};

let cleanPunctuation = function(str) {
	return str.replace(/\./g, "").replace(/!/g, "").replace(/\?/g, "").replace(/,/g, "");
};

module.exports = {
	init: function(classes) {
		// reset state
		// (required because init can be called multiple times on a page load if the class list changes)
		classMap = {};
		lexicon = {
			// these things aren't descriptive enough to be useful dates, so remove them from the lexicon
			"day": undefined,

			// these are abbreviations for dates
			"tmr": "Date",
			"tmrw": "Date",
			"tue": "Date",
			"wed": "Date",
			"thu": "Date",
		};

		// handle prefix list
		for (let prefixIndex in prefixes.list) {
			let prefix = prefixes.list[prefixIndex];
			for (let wordIndex in prefix.words) {
				// tell nlp_compromise
				let word = prefix.words[wordIndex];
				lexicon[word.toLowerCase()] = "MHSPrefix";
			}
		}

		// add synonyms first so that the real classes can overwrite them
		for (let listIndex in classSynonyms) {
			let synonymList = classSynonyms[listIndex];
			for (let synonymIndex in synonymList) {
				let synonym = synonymList[synonymIndex];
				lexicon[synonym.toLowerCase()] = "MHSClassSynonym";
			}
		}

		// handle class list
		for (let classIndex in classes) {
			let classItem = classes[classIndex];

			// tell nlp_compromise
			lexicon[classItem.name.toLowerCase()] = "MHSClass";
			lexicon[classItem.name.toLowerCase().replace(/ /g, "")] = "MHSClass";
			lexicon[classItem.name.toLowerCase().replace(/\./g, "")] = "MHSClass";
			lexicon[normalizeName(classItem.name)] = "MHSClass";

			classMap[classItem.id] = classItem;
		}
	},

	_resolveDate: resolveDate, // only for use by unit tests!

	parseText: function(text) {
		// examples:
		// [read poem] [for English] for [tomorrow]
		// take [test on molecules] [in Science] on [next Tuesday]
		// [next Friday] write an [essay about the revolution] [in History] class

		let response = {
			tag: "",
			name: "",
			class: null,
			due: null,
			dueText: ""
		};
		let sentence = nlp(text, lexicon);

		response.tag = sentence.match("#MHSPrefix").terms(0).out().trim();

		let offset = new Date().getTimezoneOffset() / 60;

		// look for #Month #Value, like "May 12"
		let dateTextResult = sentence.match("#Month #Value").terms().out().trim();
		if (dateTextResult) {
			let parsed = moment(dateTextResult, "MMM D");

			if (parsed.isValid()) {
				sentence = sentence.replace("#Month #Value", "").trim();
				response.due = assignYearToDate(parsed);
			}
		}

		// look for relative dates based on the week, like "a week from tuesday"
		// will is the only person i know who thinks of dates like this, but we do it anyways to make him happy
		let relativeWeekResult = sentence.match("a week from (#WeekDay|today|tomorrow|yesterday)").text();
		if (relativeWeekResult) {
			// we came here because we are matching a relative week date
			// we handle this by feeding it to compromise-dates, but need to match it out explicitly
			// otherwise, compromise-dates gets distracted with the rest of the text

			// workaround for some weird compromise behavior i can't figure out
			// (might be a bug in compromise? or i'm misunderstanding their api)
			relativeWeekResult = relativeWeekResult.replace("aweek", "a week");

			const sentenceDate = nlp(relativeWeekResult, lexicon).dates({
				timezone: "GMT"
			});
			if (sentenceDate) {
				let normalDateText = sentenceDate.format("{year}-{iso-month}-{date-pad}").all().text();
				if (normalDateText) {
					response.dueText = relativeWeekResult;
					response.due = resolveDate(normalDateText);
				}
			}
		}

		if (!response.due) {
			// ask compromise-dates
			// filter out values because they probably shouldn't be flagged as dates
			// this fixes things like "HW 7.2 tuesday", where "7.2 tuesday" is chosen as date
			const sentenceDate = sentence.clone().replace("#Value", "").dates({
				timezone: "GMT" + (offset > 0 ? "-" + offset : "+" + (-offset)),
			}).json(0);
			if (sentenceDate) {
				// if the length is 2, then we have something like "5-11", which can't be treated as a date
				if (sentenceDate.text.split("-").length != 2) {
					response.dueText = sentenceDate.text;

					// clean it up
					response.dueText = nlp(response.dueText).replace("(by|before|due|on|in)", "").out().trim();
					response.dueText = cleanPunctuation(response.dueText);

					// unfortunately, compromise-dates is pretty bad at actually resolving the dates
					// so we do it ourselves
					response.due = resolveDate(response.dueText);
				}
			}
		}

		let className = sentence.match("(#MHSClass|#MHSClassSynonym)+").terms().out().toLowerCase().trim();
		response.class = findClass(className);

		let nameSentence = sentence;

		// class name
		nameSentence.replace("(#Conjunction|#Preposition)? (#MHSClass|#MHSClassSynonym) class?", "");
		// due date info
		nameSentence.replace("(#Conjunction|#Preposition|due|on)? " + response.dueText, "");
		// prefix info
		nameSentence.replace("*+ #MHSPrefix", "");
		nameSentence.replace("#MHSPrefix", "");

		response.name = nameSentence.out().trim();

		if (!response.tag.trim() && response.name) {
			let nameParts = response.name.split(" ");
			let assignedPrefix = nameParts[0];
			nameParts.shift();

			response.tag = assignedPrefix;
			response.name = nameParts.join(" ");
		} else {
			// correct capitalization of the prefix
			for (let prefixIndex in prefixes.list) {
				let prefix = prefixes.list[prefixIndex];
				for (let wordIndex in prefix.words) {
					let word = prefix.words[wordIndex];
					if (word.toLowerCase() == response.tag.toLowerCase()) {
						response.tag = word;
					}
				}
			}
		}

		return [response];
	}
};
