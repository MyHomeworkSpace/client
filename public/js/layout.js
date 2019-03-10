var happyWords = [
    "happy",
    "cheerful",
    "content",
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

$(document).ready(function () {
    generateHappyWord();
    $(".happy-synonym").click(function (e) {
        e.preventDefault();
        generateHappyWord();
    })
})

function generateHappyWord() {
    var happyWord = happyWords[Math.round(Math.random() * (happyWords.length - 1))];
    $(".happy-synonym").text(happyWord);
}