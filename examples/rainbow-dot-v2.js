var config = require('../config').config;
var Color = require('color')

var net = require('net');
var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');
    // random start positions
    // render loop
    setInterval(renderLoop, 1000/15)
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
px = parseInt(Math.floor(Math.random() * (canvasWidth)))
py = parseInt(Math.floor(Math.random() * (canvasHeight)))
hue = 0
color = new Color().rgb(255,0,0);
positions = []

renderLoop = function() {
    var x = px
    var y = py
        //             PX     X         Y     BGCOLOR CHAR FGCOLOR █▓▒░┘
    // var command = 'TX ' + x + ' ' + y + ' + ' + rr + rb + rg + '\n';
    var command = 'PX ' + x + ' ' + y + ' ' + color.hexString().substring(1) + '\n';
    // var command = 'PX ' + x + ' ' + y + ' FF0000  ff0000\n';
    client.write(command);
    // move square
    for (var i=0; i <= 10; i++){
      var factor = 2
      var right = Math.round(factor/2 - Math.random() * factor)
      var left  = Math.round(factor/2 - Math.random() * factor)

      px = px + right
      py = py + left
      if (px !== x &&
          py !== y &&
          px < canvasWidth &&
          py < canvasHeight) {
            break;
          }
    }
    hue = hue+Math.random()*20-10;
    color.hue(hue)
    if (positions.length > 30) {
      var pos = positions.shift()
      var command = 'PX ' + pos[0] + ' ' + pos[1] + ' ' + '000000' + '\n';
      client.write(command)
    }
    positions.push([px,py]);
    if (px > canvasWidth) px = canvasWidth - 1;
    if (py > canvasHeight) py = canvasHeight - 1;
    if (px < 0) px++;
    if (py < 0) py++;
}
