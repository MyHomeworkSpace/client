window.addEventListener("scroll",function() { 
    if(window.scrollY > $("#keep-scrolling").offset().top && window.scrollY < $("#bottom-get-started").offset().top-20) {
       $('#features-navbar').fadeIn();
    }
    else {
       $('#features-navbar').fadeOut();
    }
 },false);

$(function () {
    $('[data-toggle="popover"]').popover()
})

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

$(document).ready(function() {
    if(document.location.href.indexOf("display-extra=finals") > -1) {
		$("#finals").modal()
	}
});