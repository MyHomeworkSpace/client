const CLASS_ID_MATH = 1;
const CLASS_ID_ENGLISH = 2;
const CLASS_ID_HISTORY = 3;
const CLASS_ID_SCIENCE = 4;
const CLASS_ID_LANGUAGE = 5;

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
	}
];

module.exports = {
	CLASSES: CLASSES,
	CLASS_IDS: {
		MATH: CLASS_ID_MATH,
		ENGLISH: CLASS_ID_ENGLISH,
		HISTORY: CLASS_ID_HISTORY,
		SCIENCE: CLASS_ID_SCIENCE,
		LANGUAGE: CLASS_ID_LANGUAGE,
	},

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
						dueText: "next Friday,"
					}
				}
			]
		}
	]
};