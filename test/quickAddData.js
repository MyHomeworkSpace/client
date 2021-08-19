const moment = require("moment");

const CLASS_ID_MATH = 1;
const CLASS_ID_ENGLISH = 2;
const CLASS_ID_HISTORY = 3;
const CLASS_ID_SCIENCE = 4;
const CLASS_ID_LANGUAGE = 5;
const CLASS_ID_COMPSCI = 6;
const CLASS_ID_6004 = 7;

const CLASSES = [
	{
		id: CLASS_ID_MATH,
		name: "Math"
	},
	{
		id: CLASS_ID_ENGLISH,
		name: "English"
	},
	{
		id: CLASS_ID_HISTORY,
		name: "History"
	},
	{
		id: CLASS_ID_SCIENCE,
		name: "Science"
	},
	{
		id: CLASS_ID_LANGUAGE,
		name: "Language"
	},
	{
		id: CLASS_ID_COMPSCI,
		name: "Computer Science"
	},
	{
		id: CLASS_ID_6004,
		name: "6.004"
	}
];

const today = new Date();
const currentYear = today.getFullYear();

var buildDate = function(year, month, day) {
	return year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
};

var noYearDate = function(month, day) {
	if (month < today.getMonth()) {
		// it's BEFORE this month, so we're referring to next year
		return buildDate(currentYear + 1, month, day);
	} else {
		// it's ON or AFTER this month, so we're referring to this year
		return buildDate(currentYear, month, day);
	}
};

// dowRelativeDate(n, dow) returns the nth next day of week
// days of week start with 0 on sunday (see Date.prototype.getDay)
var dowRelativeDate = function(count, dow) {
	const mod = function(n, m) {
		return ((n % m) + m) % m;
	};

	const daysUntilNext = mod(dow - moment().day(), 7);

	const target = moment().add(daysUntilNext, "days").add(count, "weeks");
	return buildDate(target.year(), target.month() + 1, target.date());
};

var daysFromNow = function(count) {
	const target = moment().add(count, "days");
	return buildDate(target.year(), target.month() + 1, target.date());
};

module.exports = {
	CLASSES: CLASSES,
	PREFIXES: [
		{ "id": -1, "background": "4C6C9B", "color": "FFFFFF", "words": ["HW", "Read", "Reading"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "9ACD32", "color": "FFFFFF", "words": ["Project"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "C3A528", "color": "FFFFFF", "words": ["Report", "Essay", "Paper", "Write"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "FFA500", "color": "FFFFFF", "words": ["Quiz", "PopQuiz", "GradedHW", "GradedHomework"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "EE5D1E", "color": "FFFFFF", "words": ["Quest"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "DC143C", "color": "FFFFFF", "words": ["Test", "Final", "Exam", "Midterm"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "2AC0F1", "color": "FFFFFF", "words": ["ICA", "FieldTrip"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "2AF15E", "color": "FFFFFF", "words": ["Study", "Memorize"], "timedEvent": true, "default": true },
		{ "id": -1, "background": "000000", "color": "00FF00", "words": ["Trojun", "Hex"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "5000BC", "color": "FFFFFF", "words": ["OptionalHW", "Challenge"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "000099", "color": "FFFFFF", "words": ["Presentation", "Prez"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "123456", "color": "FFFFFF", "words": ["BuildSession", "Build"], "timedEvent": true, "default": true },
		{ "id": -1, "background": "5A1B87", "color": "FFFFFF", "words": ["Meeting", "Meet"], "timedEvent": true, "default": true },
		{ "id": -1, "background": "01B501", "color": "FFFFFF", "words": ["Begin", "Start", "Do"], "timedEvent": true, "default": true },
		{ "id": -1, "background": "E34000", "color": "FFFFFF", "words": ["Apply", "Application", "Deadline"], "timedEvent": false, "default": true },
		{ "id": -1, "background": "3F4146", "color": "FFFFFF", "words": ["Form", "File", "Submit"], "timedEvent": false, "default": true },
		{ "id": 1, "background": "FF4086", "color": "FFFFFF", "words": ["Thing"], "timedEvent": false, "default": false },
		{ "id": 7, "background": "40ccff", "color": "FFFFFF", "words": ["SampleTestPrefix"], "timedEvent": false, "default": false }
	],

	/*
	 * the quick add test cases are below
	 * if you add more, please try to keep the existing ones in order
	 */
	SUITES: [
		{
			name: "Simple examples",
			cases: [
				{
					input: "read poem for English for tomorrow",
					result: {
						tag: "Read",
						name: "poem",
						classID: CLASS_ID_ENGLISH,
						dueText: "tomorrow"
					}
				},
				{
					input: "test on molecules in Science on next Tuesday",
					result: {
						tag: "Test",
						name: "on molecules",
						classID: CLASS_ID_SCIENCE,
						dueText: "next Tuesday"
					}
				},
				{
					input: "for next Friday, write an essay about the revolution in History class",
					result: {
						tag: "Write",
						name: "about the revolution",
						classID: CLASS_ID_HISTORY,
						dueText: "next Friday"
					}
				},
				{
					input: "HW 7.2 tuesday math",
					result: {
						tag: "HW",
						name: "7.2",
						classID: CLASS_ID_MATH,
						dueText: "tuesday"
					}
				},
				{
					input: "6.004 Quiz 3 on Tuesday",
					result: {
						tag: "Quiz",
						name: "3",
						classID: CLASS_ID_6004,
						dueText: "Tuesday"
					}
				},
				{
					input: "Project on lists in computer science wednesday",
					result: {
						tag: "Project",
						name: "on lists",
						classID: CLASS_ID_COMPSCI,
						dueText: "wednesday"
					}
				},
				{
					input: "paper 3 for English today",
					result: {
						tag: "Paper",
						name: "3",
						classID: CLASS_ID_ENGLISH,
						dueText: "today"
					}
				},
			]
		},
		{
			name: "Date formats",
			cases: [
				{
					input: "Read next chapter in english for May 12",
					result: {
						tag: "Read",
						name: "next chapter",
						classID: CLASS_ID_ENGLISH,
						dueDate: noYearDate(5, 12)
					}
				},
				{
					input: "Read chapters 5-11 for english",
					result: {
						tag: "Read",
						name: "chapters 5-11",
						classID: CLASS_ID_ENGLISH,
						dueDate: undefined
					}
				},
				{
					input: "Read chapters 5-11-2020 for english",
					result: {
						tag: "Read",
						name: "chapters",
						classID: CLASS_ID_ENGLISH,
						dueDate: buildDate(2020, 5, 11)
					}
				},
				{
					input: "HW 11 math 2020-11-4",
					result: {
						tag: "HW",
						name: "11",
						classID: CLASS_ID_MATH,
						dueDate: buildDate(2020, 11, 4)
					}
				},
				{
					input: "HW 11 math 2020-11-04",
					result: {
						tag: "HW",
						name: "11",
						classID: CLASS_ID_MATH,
						dueDate: buildDate(2020, 11, 4)
					}
				},
				{
					input: "HW 12 math 2020-11-14",
					result: {
						tag: "HW",
						name: "12",
						classID: CLASS_ID_MATH,
						dueDate: buildDate(2020, 11, 14)
					}
				},
				{
					input: "HW math problems 3 and 4 4-3-2020",
					result: {
						tag: "HW",
						name: "problems 3 and 4",
						classID: CLASS_ID_MATH,
						dueDate: buildDate(2020, 4, 3)
					}
				},
				{
					input: "Paper 3 due 1/5/2021",
					result: {
						tag: "Paper",
						name: "3",
						classID: null,
						dueDate: buildDate(2021, 1, 5)
					}
				},
				{
					input: "Paper due a week from tuesday",
					result: {
						tag: "Paper",
						name: "",
						classID: null,
						dueDate: dowRelativeDate(1, 2),
					}
				},
				{
					input: "Paper due a week from today",
					result: {
						tag: "Paper",
						name: "",
						classID: null,
						dueDate: dowRelativeDate(1, new Date().getDay())
					}
				},
				{
					input: "Paper due in two days",
					result: {
						tag: "Paper",
						name: "",
						classID: null,
						dueDate: daysFromNow(2)
					}
				},
				{
					input: "Paper due in 2 days",
					result: {
						tag: "Paper",
						name: "",
						classID: null,
						dueDate: daysFromNow(2)
					}
				}
			]
		}
	]
};