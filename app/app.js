var http   = require('http'),
    faye   = require('faye'),
    config = require('../config/config.json');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

function queryChannel(channel){
  url = config[channel].url

  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body)
      var prev_data = JSON.stringify(config[channel].prev_data);
      var new_data = JSON.stringify(data);
      if(prev_data != new_data){
        console.log("Responding json for: " + channel);
        config[channel].prev_data = data;
        bayeux.getClient().publish('/' + channel,{
          results: data
        });
      }else{
        // Don't publish if nothing has changed
        console.log('Skipping channel: ' + channel + '. No new data');
      }
    });
  }).on('error', function(e) {
    console.log("Got error: ", e);
  });
}

// Spin through config to set up automatic publishing for channels
for (var key in config) {
  if (config.hasOwnProperty(key)) {
    console.log("Setting up automatic publishing for channel: " + key);
    setInterval(function(){
      queryChannel(key);
    }, config[key].pollingTime);
  }
}

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Hello, I am currently responding to ' + Object.keys(config).length + ' channels:\n\n');
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      response.write(key + '\n');
    }
  }
  response.end('\nTo edit any of these channels, please edit the config.json file. Goodbye!');
});

// Handle new clients subscribing
bayeux.on('subscribe', function(clientId, channel) {
  channel = channel.substring(1);
  console.log('\nNew subscriber for channel: ' + channel + '\nPublishing existing channel data\n');
  // Don't need to requery the data for every new subscription
  bayeux.getClient().publish('/' + channel,{
    results: config[channel].prev_data
  });
})

bayeux.attach(server);
server.listen(9000);
