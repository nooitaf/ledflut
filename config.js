var config = {};
config.screen = {};
config.screen.rows = 5;
config.screen.cols = 6;

config.artnet = {};
config.artnet.host = '10.0.0.172';
config.artnet.channels = 4;

config.server = {};
config.server.host = '0.0.0.0';
config.server.port = 1234;
exports.config = config;
