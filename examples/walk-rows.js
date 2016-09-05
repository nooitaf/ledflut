var config = require('../config').config;

// canvas
var canvasWidth = config.screen.cols // width
var canvasHeight = config.screen.rows // height
px = 0
py = 0
hr = 0
hg = 0
hb = 0
hw = 0


var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');
    setInterval(renderLoop, 1000 / 5)
})

client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
})

client.on('error', function(err) {
    console.log(err)
})
client.on('close', function() {
    console.log('Connection closed');
})


renderLoop = function() {
    rr = '01'
    rg = '01'
    rb = 'ff'
    rw = '00'

    var command = 'PX ' + px + ' ' + py + ' ' + rg + rr + rb + '\n';
    client.write(command);

    // move
    px++
    if (px >= canvasWidth) {
        py++
        px = 0
    }
    if (py >= canvasHeight) py = 0;
}
