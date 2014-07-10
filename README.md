# JSON API Websocket Wrapper

The JSON API Websocket Wrapper is a node.js server that will poll multiple JSON APIs for you, and publish the result to all clients.
Clients subscribe and receive data through web sockets, which are managed through [Faye.js](http://faye.jcoglan.com/).

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

## Running Locally for Development
To run a local server:
```bash
node app.js
```

## Running as a Daemon
A Makefile has been set up with basic tasks related to running the server as a
daemon. To set the daemon up:
```bash
make start
```

To see all running background processes related to the daemon:
```bash
make list
```

To kill all daemon-related processes:
```bash
make stop
```

### Config
Based on the config file, the wrapper will continuously poll the preset API urls at
preset intervals and publish new JSON blobs to the subscribed clients. The
config file reflects the APIs that are continuously polled, and is structured in
the following form:

```javascript
{
  "channel-name": {
    "url": "http://some_json_url.com",
    "pollingTime": 15000  // 15 seconds
  }
}
```
The `channel-name` key can have any name you want. `url` and `pollingTime` must
remain those names. Add as many channel hashes as you want.

### Browser Code

To reap the benefits of websockets, you will need to add some client side code.
The JSON API Websocket Wrapper uses [Faye.js](http://faye.jcoglan.com/).

Add this to your HTML pages (Assuming you are running the server on
localhost:9000):
```html
<script type="text/javascript" src="http://localhost:9000/faye/client.js"></script>
```

Then, in your client side JS, add:
```javascript
var client = new Faye.Client('http://localhost:9000/faye');
client.subscribe('/channel-name', function(data) {
  console.log(data);  // Plus hopefully other code
});
```

Everytime the wrapper publishes a new JSON blob, this subscribe callback will be
called with the new JSON.

<b>Important:</b> The channel-name here must be the same channel-name as defined
in the config file, as well as preceded by a `/`

## License

Copyright (c) 2014 Staplegun Design

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
