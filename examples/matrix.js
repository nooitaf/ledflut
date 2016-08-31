var config = require('../config');

// canvas
var canvasWidth = config.screen.cols // width
var canvasHeight = config.screen.rows // height

var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000 / 10)
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

function randomChar() {
    //33 - 126
    var startChar = 36
    var endChar = 126
    var dist = Math.floor(Math.random() * (endChar-startChar))
    return String.fromCharCode(startChar + dist)
}

var heads = []
var tails = []
for (var i = 0; i < canvasWidth; i++) {
    if (!heads[i]) heads[i] = Math.floor(Math.random() * canvasHeight)
    if (!tails[i]) tails[i] = Math.floor(Math.random() * canvasHeight*2)
}

renderLoop = function() {
    for (var i = 0; i < canvasWidth; i++) {
        heads[i]++
        if (heads[i]>canvasHeight+tails[i]+3) {
            heads[i] = -Math.floor(Math.random() * canvasHeight*2)
            tails[i] = Math.floor(Math.random() * canvasHeight)+3
        }

    }
    var x = 0
    var y = 0
    var colorHead = "aaffaa";
    var colorTail = "007500";
    var colorTailDark = "003500"
    var colorTailVeryDark = "000200"
    for (var row = 0; row < canvasHeight; row++) {
        for (var col = 0; col < canvasWidth; col++) {
            x = col
            y = row
            if (y === heads[col]) client.write('PX ' + x + ' ' + y + ' ' + colorHead + '\n');
            if (y === heads[col] -1) client.write('PX ' + x + ' ' + y + ' ' + colorTail + '\n');
            if (y === heads[col] -2) client.write('PX ' + x + ' ' + y + ' ' + colorTailDark + '\n');
            if (y === heads[col] -3) client.write('PX ' + x + ' ' + y + ' ' + colorTailVeryDark + '\n');
            if (y === heads[col] - tails[col] -1 ) client.write('PX ' + x + ' ' + y + ' 000000\n');
        }
    }
}
