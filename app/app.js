var http      = require('http'),
    config    = require('../config/config.json');
    publisher = require('./publisher.js');

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

publisher.init_callbacks();
publisher.init_publishing();
publisher.attach(server);

server.listen(9000);
