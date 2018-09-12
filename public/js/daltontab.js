$().ready(() => {
    setClock();
    setInterval(setClock,1000);
    $.get("https://daltontabservices.myhomework.space/v1/getImage.php?channel=normal", (data) => {
        bginfo = $.parseJSON(data);
        $(".dt").css("background-image", "url(" + bginfo.imgUrl + ")");
        $("#location").text(bginfo.description);
        $("#photographer").text(bginfo.authorName);
        $("#photographer").attr("href", bginfo.authorUrl);
        $("#source").text(bginfo.siteName);
        $("#source").attr("href", bginfo.siteUrl)
    })
    if(navigator.userAgent.search("Chrome") > 1 ){
        $("#download").html("Get DaltonTab <i class=\"fa fa-chrome\"></i>");
        $("#download").attr("href", "https://chrome.google.com/webstore/detail/daltontab/ggfjkmflbbjndabmnngilkfpmdegbfkm")
    } else if(navigator.userAgent.search("Firefox") > 1 ){
        $("#download").html("Get DaltonTab <i class=\"fa fa-firefox\"></i>");
        $("#download").attr("href", "https://addons.mozilla.org/en-US/firefox/addon/daltontab/")
    } else {
        $("#download").attr("download", "")
    }
})

function setClock() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var d = new Date();
    var hours = d.getHours()%12;
    var am = (d.getHours < 12);
    var minutes = padZero(d.getMinutes());
    $("#hoursmins").text(hours + ":" + minutes);
    $("#ampm").text((am ? "AM" : "PM"))
    var month = monthNames[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();
    $("#date").text(month + " " + day + ", " + year)
}

function padZero(n) {
    if(n == 0) {
        return "00";
    } else if(n > 10) {
        return n;
    } else { return "0" + n; }
}