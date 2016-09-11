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
