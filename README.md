# client
[![Tests](https://github.com/MyHomeworkSpace/client/actions/workflows/tests.yml/badge.svg)](https://github.com/MyHomeworkSpace/client/actions/workflows/tests.yml) [![Style](https://github.com/MyHomeworkSpace/client/actions/workflows/style.yml/badge.svg)](https://github.com/MyHomeworkSpace/client/actions/workflows/style.yml) [![Created by the MyHomeworkSpace Team](https://img.shields.io/badge/Created%20by-MyHomeworkSpace%20Team-3698dc.svg)](https://github.com/MyHomeworkSpace)

This repository is the MyHomeworkSpace client, which runs at https://app.myhomework.space.

## Related
* [MyHomeworkSpace/api-server](https://github.com/MyHomeworkSpace/api-server) - the API server, which this client talks to
* [MyHomeworkSpace/website](https://github.com/MyHomeworkSpace/website) - the main website, at https://myhomework.space

## Setting up
1. Make sure you've done the [api-server setup](https://github.com/MyHomeworkSpace/api-server/blob/master/README.md) first.
2. Clone this repository to your computer, and open a terminal to that folder.
3. Run `npm install`.

If you're working on the app, the [Preact DevTools](https://github.com/preactjs/preact-devtools) ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)/[Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)/[Edge](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)) can be helpful.

## Running
To start Webpack, just run `npm run dev`. This will start the development server, listening at port 9001.

If you followed the api-server guide, this should be available at http://app.myhomework.localhost.