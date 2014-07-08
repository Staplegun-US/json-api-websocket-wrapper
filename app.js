var http = require('http'),
    faye = require('faye');

var redis = require("redis"),
    rClient = redis.createClient();

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

function queryStock(symbol){
  var url = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol = "' + symbol +
    '"%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body)
      console.log("Responding json for: " + symbol);
      bayeux.getClient().publish('/' + symbol,{
        quote: data.query.results.quote
      });
    });
  }).on('error', function(e) {
    console.log("Got error: ", e);
  });
}

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  rClient.hkeys("stocks", function (err, replies) {
    response.write('Hello, I am currently responding to ' + replies.length + ' stocks:\n\n');
    replies.forEach(function (reply, i) {
      response.write(i + ": " + reply + '\n');
    });
  });
  setTimeout(function(){ response.end('\nGoodbye!'); }, 500);
});

// Spin through Redis to set up automatic publishing for stored stocks
rClient.hkeys("stocks", function (err, replies) {
  console.log(replies.length + " stocks:");
  replies.forEach(function (reply, i) {
    console.log("Setting up automatic stock publishing for:" + reply);
    setInterval(function(){
      queryStock(reply);
    }, 10000);
  });
});

bayeux.on('subscribe', function(clientId, channel) {
  channel = channel.substring(1);
  console.log('New Subscriber for channel: ' + channel);
  // Add channel to Redis if it doesn't exist
  rClient.hsetnx("stocks", channel, "0");
  queryStock(channel);
})

bayeux.attach(server);
server.listen(9000);
