export default {
	colors: [
		"ff4d40",
		"ffa540",
		"40ff73",
		"4071ff",
		"ff4086",
		"40ccff",
		"5940ff",
		"ff40f5",
		"a940ff",
		"e6ab68",
		"4d4d4d"
	],

	EVENT_TYPE_PLAIN: 1,
	EVENT_TYPE_HOMEWORK: 2,
	EVENT_TYPE_SCHEDULE: 3,

	EVENT_TAG_RESERVED: 0,
	EVENT_TAG_DESCRIPTION: 1,
	EVENT_TAG_HOMEWORK: 2,
	EVENT_TAG_TERM_ID: 3,
	EVENT_TAG_CLASS_ID: 4,
	EVENT_TAG_OWNER_ID: 5,
	EVENT_TAG_OWNER_NAME: 6,
	EVENT_TAG_DAY_NUMBER: 7,
	EVENT_TAG_BLOCK: 8,
	EVENT_TAG_BUILDING_NAME: 9,
	EVENT_TAG_ROOM_NUMBER: 10,

	CALENDAR_STATUS_UNIMPORTED: 0,
	CALENDAR_STATUS_IMPORTED: 1,
	CALENDAR_STATUS_NEEDS_UPDATE: 2,

	RECUR_FREQUENCY_DAILY: 0,
	RECUR_FREQUENCY_WEEKLY: 1,
	RECUR_FREQUENCY_MONTHLY: 2,
	RECUR_FREQUENCY_YEARLY: 3,

	TOKEN_TYPE_NONE: 0,
	TOKEN_TYPE_RESET_PASSWORD: 1,
	TOKEN_TYPE_CHANGE_EMAIL: 2,
};