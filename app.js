var http = require('http'),
    faye = require('faye');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

function queryStock(symbol){
  var url = 'http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in ("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
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
  response.end('Hello, non-Bayeux request');
  console.log('subscribed new client');
});

bayeux.on('subscribe', function(clientId, channel) {
  channel = channel.substring(1);
  console.log('New Subscriber for channel: ' + channel);
  queryStock(channel);
  // Move this out of 'subscribe' block after stocks are storable and retrievable
  setInterval(function(){
    queryStock(channel);
  }, 10000);
})

bayeux.attach(server);
server.listen(9000);
