var config = require('../config');

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
    setInterval(renderLoop, 1000 / 15)
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


var color_switched = false

renderLoop = function() {
    if (!px && !py) color_switched = !color_switched
    if (color_switched){
      rw = '20'
    } else {
      rw = '01'
    }

    var command = 'WP ' + px + ' ' + py + ' ' + rw + '\n';
    client.write(command);
    // console.log(command)
    // move
    px++
    if (px >= canvasWidth) {
        py++
        px = 0
    }
    if (py >= canvasHeight) py = 0;
}
