Mousetrap.bind('up up down down left right left right b a', function() {
    cornify_add();
    // window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

var happyWords = [
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

var serverLocations = [
    "Ashburn, US",
    "Atlanta, US",
    "Boston, US",
    "Calgary, CA",
    "Chicago, US",
    "Dallas, US",
    "Denver, US",
    "Detroit, US",
    "Houston, US",
    "Indianapolis, US",
    "Jacksonville, US",
    "Kansas City, US",
    "Las Vegas, US",
    "Los Angeles, US",
    "Mcallen, US",
    "Memphis, US",
    "Mexico City, MX",
    "Miami, US",
    "Minneapolis, US",
    "Montgomery, US",
    "Montréal, CA",
    "Nashville, US",
    "Newark, US",
    "Omaha, US",
    "Philadelphia, US",
    "Phoenix, US",
    "Pittsburgh, US",
    "Portland, US",
    "Sacramento, US",
    "Salt Lake City, US",
    "San Diego, US",
    "San Jose, US",
    "Saskatoon, CA",
    "Seattle, US",
    "St. Louis, US",
    "Tallahassee, US",
    "Tampa, US",
    "Toronto, CA",
    "Vancouver, CA",
    "Winnipeg, CA",
    "Bogota, CO",
    "Buenos Aires, AR",
    "Lima, PE",
    "Medellín, CO",
    "Panama City, PA",
    "Quito, EC",
    "Rio de Janeiro, BR",
    "São Paulo, BR",
    "Valparaíso, CL",
    "Willemstad, CW",
    "Auckland, NZ",
    "Brisbane, AU",
    "Melbourne, AU",
    "Perth, AU",
    "Sydney, AU",
    "Baghdad, IQ",
    "Beirut, LB",
    "Doha, QA",
    "Dubai, AE",
    "Kuwait City, KW",
    "Muscat, OM",
    "Riyadh, SA",
    "Tel Aviv, IL",
    "Athens, GR",
    "Barcelona, ES",
    "Belgrade, RS",
    "Berlin, DE",
    "Brussels, BE",
    "Bucharest, RO",
    "Budapest, HU",
    "Chișinău, MD",
    "Copenhagen, DK",
    "Dublin, IE",
    "Düsseldorf, DE",
    "Edinburgh, GB",
    "Frankfurt, DE",
    "Hamburg, DE",
    "Helsinki, FI",
    "Istanbul, TR",
    "Kiev, UA",
    "Lisbon, PT",
    "London, GB",
    "Luxembourg City, LU",
    "Madrid, ES",
    "Manchester, GB",
    "Marseille, FR",
    "Milan, IT",
    "Moscow, RU",
    "Munich, DE",
    "Oslo, NO",
    "Paris, FR",
    "Prague, CZ",
    "Reykjavík, IS",
    "Riga, LV",
    "Rome, IT",
    "Sofia, BG",
    "Stockholm, SE",
    "Tallinn, EE",
    "Vienna, AT",
    "Vilnius, LT",
    "Warsaw, PL",
    "Zagreb, HR",
    "Zürich, CH",
    "Cairo, EG",
    "Cape Town, ZA",
    "Djibouti, DJ",
    "Durban, ZA",
    "Johannesburg, ZA",
    "Luanda, AO",
    "Mombasa, KE",
    "Port Louis, MU",
    "Bangkok, TH",
    "Cebu City, PH",
    "Chennai, IN",
    "Colombo, LK",
    "Hong Kong",
    "Kathmandu, NP",
    "Kuala Lumpur, MY",
    "Macau",
    "Manila, PH",
    "Mumbai, IN",
    "New Delhi, IN",
    "Osaka, JP",
    "Phnom, KH",
    "Seoul, KR",
    "Singapore, SG",
    "Taipei",
    "Tokyo, JP",
    "Yerevan, AM",
    "Chengdu, CN",
    "Dongguan, CN",
    "Foshan, CN",
    "Fuzhou, CN",
    "Guangzhou, CN",
    "Hangzhou, CN",
    "Hengyang, CN",
    "Jinan, CN",
    "Langfang, CN",
    "Luoyang, CN",
    "Nanning, CN",
    "Qingdao, CN",
    "Shanghai, CN",
    "Shenyang, CN",
    "Shijiazhuang, CN",
    "Suzhou, CN",
    "Wuhan, CN",
    "Wuxi, CN",
    "Xian, CN",
    "Zhengzhou, CN",
    "Zhuzhou, CN",
]

$(document).ready(function() {
    var happyWord = happyWords[Math.round(Math.random() * (happyWords.length-1))];
    $(".happy-synonym").text(happyWord);
})

$(document).ready(function() {
    var serverLocation = serverLocations[Math.round(Math.random() * (serverLocations.length-1))];
    $(".server-location").text(serverLocation);
})