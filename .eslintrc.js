module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly",

		"html2canvas": "readonly",
		"moment": "readonly",
		"Mousetrap": "readonly",
		"nlp": "readonly",
		"$": "readonly",

		"MyHomeworkSpace": "writable",
		"MHSBridge": "writable"
	},
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"no-constant-condition": [
			"error",
			{ "checkLoops": false }
		],
		"no-unused-vars": [
			"off",
			{ "varsIgnorePattern": "(props|state)" }
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"space-before-function-paren": [
			"error",
			"never"
		],
		"react/jsx-key": "off",
		"react/prop-types": "off",
		"react/no-unescaped-entities": [
			"error",
			{ forbid: [">", "}"] }
		],
		"react/no-unknown-property": [
			"error",
			{ ignore: [ "class" ] }
		],
	},
	"settings": {
		"react": {
			"createClass": "createComponent",
			"pragma": "h",  // Pragma to use, default to "React"
			"version": "16.3"
		  },
	}
};