# client
###### [![Lint status](https://img.shields.io/travis/MyHomeworkSpace/client.svg?label=code%20style)](https://travis-ci.org/MyHomeworkSpace/client) [![Created by the MyHomeworkSpace Team](https://img.shields.io/badge/Created%20by-MyHomeworkSpace%20Team-3698dc.svg)](https://github.com/MyHomeworkSpace)

This repository is the MyHomeworkSpace client, which runs at https://app.myhomework.space.

## Related
* [MyHomeworkSpace/api-server](https://github.com/MyHomeworkSpace/api-server) - the API server, which this client talks to
* [MyHomeworkSpace/website](https://github.com/MyHomeworkSpace/website) - the main website, at https://myhomework.space

## Setting up
1. Make sure you've done the [api-server setup](https://github.com/MyHomeworkSpace/api-server/blob/master/README.md) first.
2. Clone this repository to your computer, and open a terminal to that folder.
3. Run `npm install`.

## Running
To start Webpack, just run `npm run dev`. This will start the development server, listening at port 9001.

If you followed the api-server guide, this should be available at http://app.myhomework.invalid.