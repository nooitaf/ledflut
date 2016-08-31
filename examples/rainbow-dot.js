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


renderLoop = function() {
    // change color..
    hr = hr + Math.round(colorRandomFactor - Math.random() * (colorRandomFactor * 2))
    if (hr >= 256) hr = 255;
    if (hr < 0) hr = 0;
    var rr = hr.toString(16)
    if (rr.length === 1) rr = '0' + rr;

    hg = hg + Math.round(colorRandomFactor - Math.random() * (colorRandomFactor * 2))
    if (hg >= 255) hg = 255
    if (hg < 0) hg = 0
    var rg = hg.toString(16)
    if (rg.length === 1) rg = '0' + rg;

    hb = hb + Math.round(colorRandomFactor - Math.random() * (colorRandomFactor * 2))
    if (hb >= 255) hb = 255
    if (hb < 0) hb = 0
    var rb = hb.toString(16)
    if (rb.length === 1) rb = '0' + rb;

    // draw square
    for (var i = 0; i < squareSize; i++) {
        for (var k = 0; k < squareSize; k++) {
            var x = Math.round(px + i)
            var y = Math.round(py + k)
                //             PX     X         Y     BGCOLOR CHAR FGCOLOR █▓▒░┘
            // var command = 'TX ' + x + ' ' + y + ' + ' + rr + rb + rg + '\n';
            var command = 'PX ' + x + ' ' + y + ' ' + rr + rb + rg + '\n';
            // var command = 'PX ' + x + ' ' + y + ' FF0000  ff0000\n';
            client.write(command);
        }
    }
    // move square
    px = px + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    py = py + Math.round(1 - Math.random() * 2) * squareSize * jumpFactor
    if (px > canvasWidth + squareSize - 1) px = canvasWidth - squareSize;
    if (py > canvasHeight) py = canvasHeight - squareSize;
    if (px < 0) px++;
    if (py < 0) py++;
}
