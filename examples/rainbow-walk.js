var config = require('../config').config;
var Color = require('color');
// canvas
var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');
    setInterval(renderLoop, 1000 / 60)
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

var canvasWidth = config.screen.cols // width
var canvasHeight = config.screen.rows // height
px = 0
py = 0
hue = 0
color = new Color().rgb(255,0,0);

renderLoop = function() {

    var command = 'PX ' + px + ' ' + py + ' ' + color.hexString().substring(1) + '\n';
    client.write(command);
    // console.log(command)
    // move
    px++
    hue = hue+Math.random()*30
    color.hue(hue)
    if (px >= canvasWidth) {
        py++
        px = 0
    }
    if (py >= canvasHeight) py = 0;
    if (hue >= 180) hue = -180;
}
