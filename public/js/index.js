$('.marquee-left').marquee({
	//duration in milliseconds of the marquee
	duration: 10000,
	//gap in pixels between the tickers
	gap: 50,
	//time in milliseconds before the marquee will start animating
	delayBeforeStart: 0,
	//'left' or 'right'
	direction: 'left',
	//true or false - should the marquee be duplicated to show an effect of continues flow
	duplicated: true,
	// pauseOnHover: true //don't need until we add popovers
});

$('.marquee-right').marquee({
	//duration in milliseconds of the marquee
	duration: 10000,
	//gap in pixels between the tickers
	gap: 50,
	//time in milliseconds before the marquee will start animating
	delayBeforeStart: 0,
	//'left' or 'right'
	direction: 'right',
	//true or false - should the marquee be duplicated to show an effect of continues flow
	duplicated: true,
	// pauseOnHover: true //don't need until we add popovers
});
