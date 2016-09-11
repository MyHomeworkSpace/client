MyHomeworkSpace.QuickAdd = {
	classes: [],
	classIds: [],
	prefixList: [],
	init: function() {
		MyHomeworkSpace.QuickAdd.classes = [];
		MyHomeworkSpace.QuickAdd.classIds = [];
		MyHomeworkSpace.QuickAdd.prefixList = [];
		for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
			var prefix = MyHomeworkSpace.Prefixes.list[prefixIndex];
			for (var wordIndex in prefix.words) {
				MyHomeworkSpace.QuickAdd.prefixList.push(prefix.words[wordIndex].toLowerCase());
			}
		}
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			MyHomeworkSpace.QuickAdd.classes.push(MyHomeworkSpace.Classes.list[classIndex].name.toLowerCase());
			MyHomeworkSpace.QuickAdd.classIds.push(MyHomeworkSpace.Classes.list[classIndex].id);
		}
	},
	isClass: function(text) {
		// TODO: multi-word classes
		return MyHomeworkSpace.QuickAdd.classes.indexOf(text.toLowerCase());
	},
	parseDate: function(text) {
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

		var nlp = window.nlp_compromise;
		var response = {
			tag: "",
			name: "",
			class: "",
			classId: 0,
			due: ""
		};
		var sentence = nlp.sentence(text);
		var nameTrack = false;
		var skipNext = false;

		for (var termIndex in sentence.terms) {
			var term = sentence.terms[termIndex];
			if (skipNext) {
				skipNext = false;
			} else if (MyHomeworkSpace.QuickAdd.prefixList.indexOf(term.text.toLowerCase()) > -1) {
				response.tag = term.text;
				nameTrack = true;
			} else if (term.tag == "Date") {
				response.due = term.text;
			} else if (term.pos.Conjunction || term.pos.Preposition) {
				// peek at the next word
				if (sentence.terms[parseInt(termIndex) + 1] && MyHomeworkSpace.QuickAdd.isClass(sentence.terms[parseInt(termIndex) + 1].text) > -1) {
					// if it's a class, set it and skip it
					response.class = sentence.terms[parseInt(termIndex) + 1].text;
					response.classId = MyHomeworkSpace.QuickAdd.classIds[MyHomeworkSpace.QuickAdd.isClass(sentence.terms[parseInt(termIndex) + 1].text)];
					skipNext = true;
				} else if (nameTrack) {
					response.name += term.text;
					response.name += " ";
				}
			} else if (nameTrack) {
				response.name += term.text;
				response.name += " ";
			}
		}

		response.name = response.name.trim();

		return response
	}
};
