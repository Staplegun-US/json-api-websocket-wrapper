var http   = require('http'),
    faye   = require('faye'),
    config = require('../config/config.json');

module.exports = {
  bayeux: new faye.NodeAdapter({mount: '/faye', timeout: 45}),
  attach: function(server){
    this.bayeux.attach(server);
  },
  init_callbacks: function(){
    this.bayeux.on('subscribe', function(clientId, channel) {
      channel = channel.substring(1);
      console.log('\nNew subscriber for channel: ' + channel + '\nPublishing existing channel data\n');
      // Don't need to requery the data for every new subscription
      this.getClient().publish('/' + channel,{
        results: config[channel].prev_data
      });
    })
  },
  init_publishing: function(){
    for (var key in config) {
      if (config.hasOwnProperty(key)) {
        console.log("Setting up automatic publishing for channel: " + key);
        setInterval(function(channel){
          this.queryChannel(channel);
        }.bind(this, key), config[key].pollingTime);
      }
    }
  },
  queryChannel: function(channel){
    url     = config[channel].url
    bayeux  = this.bayeux;

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
};
