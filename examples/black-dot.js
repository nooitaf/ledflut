var config = require('../config');
// canvas
var canvasWidth = config.screen.cols  // width
var canvasHeight = config.screen.rows   // height
var squareSize = 1
var colorRandomFactor = 50
var jumpFactor = 0.35 //0.95
px = parseInt(Math.floor(Math.random() * (canvasWidth)))
py = parseInt(Math.floor(Math.random() * (canvasHeight)))
hr = 0
hg = 0
hb = 0



var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.port, function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000/20)
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
    var x = Math.round(px)
    var y = Math.round(py)
    var command = 'PX ' + x + ' ' + y + ' ' + '000000' + '\n';
    client.write(command);
    px = px + Math.round(1 - Math.random() * 2) * jumpFactor
    py = py + Math.round(1 - Math.random() * 2) * jumpFactor
    if (px > canvasWidth) px = 0;
    if (py > canvasHeight) py = 0;
    if (px < 0) px++;
    if (py < 0) py++;
}
