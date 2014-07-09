# JSON API Websocket Wrapper
---

A node.js server that will poll multiple JSON APIs for you, and publish the result to all clients.
Clients subscribe through web sockets, which are managed through [Faye.js](http://faye.jcoglan.com/).

## Purpose
Websockets are a great technology when you want you page to reflect new data
without having to reload the entire page. This is especially handy with sites
based on chat applications, stock tickers, sports scores, etc. However, if you
don't control the server and just want to hit an external API for data,
websockets are usually out of the question since the server manages the
websocket backend.

With this JSON API wrapper, browser clients can retrieve data from any JSON API and receive
continuous feeds with the JSON response everytime the API provides a new
response. The browser won't ever manually query the external API, so there is no
load on the page for any type of request; it just receive updates as through a
callback and handle the client-side changes then. This wrapper will handle all
of the load.

## Install
```bash
git clone https://github.com/Staplegun-US/json-api-websocket-wrapper.git
cd json-api-websocket-wrapper.git
npm install
cp config.json.example config.json # Now edit the config file
```

## Deploying
```bash
node app.js
```
