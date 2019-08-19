$(document).ready(function() {
    setClock();
    setInterval(setClock, 1000);

    $.get("https://daltontabservices.myhomework.space/v1/getImage.php?channel=normal", function(data) {
        bginfo = $.parseJSON(data);

        $(".dt").css("background-image", "url(" + bginfo.imgUrl + ")");
        $("#location").text(bginfo.description);
        $("#photographer").text(bginfo.authorName);
        $("#photographer").attr("href", bginfo.authorUrl);
        $("#source").text(bginfo.siteName);
        $("#source").attr("href", bginfo.siteUrl);

        if (bginfo.beaconUrl) {
            $.get(bginfo.beaconUrl, function(data) {
                
            });
        }
    });

    if (navigator.userAgent.search("Chrome") != -1) {
        $("#download").html("Get DaltonTab <i class=\"fa fa-chrome\"></i>");
        $("#download").attr("href", "https://chrome.google.com/webstore/detail/daltontab/ggfjkmflbbjndabmnngilkfpmdegbfkm");
    } else if (navigator.userAgent.search("Firefox") != -1) {
        $("#download").html("Get DaltonTab <i class=\"fa fa-firefox\"></i>");
        $("#download").attr("href", "https://addons.mozilla.org/en-US/firefox/addon/daltontab/");
    } else {
        $("#download").hide();
    }
})

function setClock() {
    var time = moment();

    $("#ampm").text(time.format("A"));
    $("#hoursmins").text(time.format("h:mm"));
    $("#date").text(time.format("MMMM Do, YYYY"));
}