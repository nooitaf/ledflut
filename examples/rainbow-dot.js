var config = require('../config').config;
var Color = require('color')

var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000/30)
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


// canvas
var canvasWidth = config.screen.cols  // width
var canvasHeight = config.screen.rows   // height
var squareSize = 1
var colorRandomFactor = 50
var jumpFactor = 0.35 //0.95
px = parseInt(Math.floor(Math.random() * (canvasWidth)))
py = parseInt(Math.floor(Math.random() * (canvasHeight)))
hue = 0
color = new Color().rgb(255,0,0);


renderLoop = function() {
    // draw square
    for (var i = 0; i < squareSize; i++) {
        for (var k = 0; k < squareSize; k++) {
            var x = Math.round(px + i)
            var y = Math.round(py + k)
                //             PX     X         Y     BGCOLOR CHAR FGCOLOR █▓▒░┘
            // var command = 'TX ' + x + ' ' + y + ' + ' + rr + rb + rg + '\n';
            var command = 'PX ' + x + ' ' + y + ' ' + color.hexString().substring(1) + '\n';
            // var command = 'PX ' + x + ' ' + y + ' FF0000  ff0000\n';
            client.write(command);
        }
    }
    // move square
    px = px + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    py = py + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    hue = hue+Math.random()*20-10;
    color.hue(hue)
    if (px > canvasWidth + squareSize - 1) px = canvasWidth - squareSize;
    if (py > canvasHeight) py = canvasHeight - squareSize;
    if (px < 0) px++;
    if (py < 0) py++;
}
