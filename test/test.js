// set up MyHomeworkSpace object to convince quickAdd + prefixes to like us
global.MyHomeworkSpace = {
	Prefixes: {}
};

let data = require("./quickAddData");
let prefixes = require("../app/prefixes");
let quickAdd = require("../app/quickAdd");

prefixes.list = data.PREFIXES;
quickAdd.init(data.CLASSES);

describe("Quick Add", function() {
	describe("parseText", function() {
		data.SUITES.forEach(function(suite) {
			describe(suite.name, function() {
				suite.cases.forEach(function(testCase, i) {
					it("case " + (i + 1), function() {
						let result = quickAdd.parseText(testCase.input)[0];
						let expected = testCase.result;

						let failures = [];
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

						if (expected.dueText) {
							// it's a relative date

							if (result.dueText != expected.dueText) {
								failures.push(`Due date text was ${JSON.stringify(result.dueText)} when it should have been ${JSON.stringify(expected.dueText)}`);
							}

							// what was the actual due date we wanted?
							let dueDate = quickAdd._resolveDate(expected.dueText);

							let sameDay = dueDate.isSame(result.due, "day");

							if (!sameDay) {
								failures.push(`Due date was ${JSON.stringify(result.due ? result.due.format("YYYY-MM-DD") : result.due)} when it should have been ${JSON.stringify(dueDate.format("YYYY-MM-DD"))}`);
							}
						} else if (expected.dueDate) {
							// it's an absolute date
							if (!result.due) {
								failures.push(`Due date was ${JSON.stringify(result.due)} when it should have been ${JSON.stringify(expected.dueDate)}`);
							} else {
								let resultFormat = result.due.format("YYYY-MM-DD");
								if (resultFormat != expected.dueDate) {
									failures.push(`Due date was ${JSON.stringify(resultFormat)} when it should have been ${JSON.stringify(expected.dueDate)}`);
								}
							}
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