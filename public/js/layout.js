Mousetrap.bind('up up down down left right left right b a', function() {
    cornify_add();
    // window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

happyWords = [
    "happy",
    "cheerful",
    "contented",
    "delighted",
    "elated",
    "glad",
    "joyful",
    "joyous",
    "jubilant",
    "lively",
    "merry",
    "overjoyed",
    "peaceful",
    "pleasant",
    "pleased",
    "thrilled",
    "upbeat",
    "blissful",
    "content",
    "jolly",
    "gleeful",
    "perky",
    "playful",
    "laughing"
]

$(document).ready(function() {
    var happyWord = happyWords[Math.round(Math.random() * (happyWords.length-1))];
    $("#happy-synonym").text(happyWord);
})