// slight hack to import nlp_compromise
require("../public/js/compromise.min");

// set up MyHomeworkSpace object to convince quickAdd + prefixes to like us
global.MyHomeworkSpace = {
	Prefixes: {}
};

var data = require("./quickAddData");
var prefixes = require("../app/prefixes");
var quickAdd = require("../app/quickAdd");

prefixes.list = data.PREFIXES;
quickAdd.init(data.CLASSES);

describe("Quick Add", function() {
	describe("parseText", function() {
		data.SUITES.forEach(function(suite) {
			describe(suite.name, function() {
				suite.cases.forEach(function(testCase, i) {
					it("case " + (i + 1), function() {
						var result = quickAdd.parseText(testCase.input)[0];
						var expected = testCase.result;

						var failures = [];
						if (result.tag != expected.tag) {
							failures.push(`Tag was ${JSON.stringify(result.tag)} when it should have been ${JSON.stringify(expected.tag)}`);
						}
						if (result.name != expected.name) {
							failures.push(`Name was ${JSON.stringify(result.name)} when it should have been ${JSON.stringify(expected.name)}`);
						}
						if (!expected.classID && result.class) {
							failures.push(`Class was ${JSON.stringify(result.class)} when it should have been null`);
						}
						if (expected.classID && (!result.class || result.class.id != expected.classID)) {
							failures.push(`Class was ${JSON.stringify(result.class)} when it should have been class with ID ${expected.classID}`);
						}
						if (result.due != expected.dueText) {
							failures.push(`Due date was ${JSON.stringify(result.due)} when it should have been ${JSON.stringify(expected.due)}`);
						}

						if (failures.length > 0) {
							throw new Error(failures.join("\n"));
						}
					});
				});
			});
		});
	});
});