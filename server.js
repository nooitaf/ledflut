//
var config = require('./config').config;

console.log(config)
var Screen = {
    cols: config.screen.cols,
    rows: config.screen.rows,
    channels: config.artnet.channels
}



var options = {
    host: config.artnet.host
}
var leds = []
for (i = 0; i < config.screen.cols * config.screen.rows; i++) {
    if (!leds[i]) leds[i] = null
}

// poor mans renderloop
setInterval(function(){
  artnet.set(leds, function(err, res) {
      if (err) console.log(err);
  })
},1000/25)

var artnet = require('artnet')(options);

// darken everything
artnet.set(Array(Screen.cols * Screen.rows * Screen.channels).fill(0))

function updatePixelWithString(str) {
    var params = str.toString().split(' ')
    if (params && params.length >= 4 && params.length <= 6) {
        var f = params[0].toString()
        var x = parseInt(params[1])
        var y = parseInt(params[2])
        if (x >= Screen.cols || y >= Screen.rows || x < 0 || y < 0) return
        if (f === "WP") {
            var color = String(params[3]) ? String(params[3]) : false
            if (params.length === 4) {
                color = parseInt(color, 16)
                color = color & 0xff
                var leds = Array(Screen.cols * Screen.rows * Screen.channels)
                if (y % 2) {
                  leds[(Screen.rows - x + y * (Screen.cols)) * 4 + 3] = color ? color : 1;
                } else {
                  leds[(x + y * (Screen.cols)) * 4 + 3] = color ? color : 1;
                }
                for (i = 0; i < leds.length; i++) {
                    if (!leds[i]) leds[i] = null
                }
            }
        }
        if (f === "PX") {
            var color = String(params[3]) ? '#' + String(params[3]) : false
            if (params.length === 4) {
                color = hexToRGB(color)
                var leds = Array(Screen.cols * Screen.rows * Screen.channels)
                if (y % 2) {
                  leds[(Screen.rows - x + y * (Screen.cols)) * 4]     = color[0] ? color[0] : 1;
                  leds[(Screen.rows - x + y * (Screen.cols)) * 4 + 1] = color[1] ? color[1] : 1;
                  leds[(Screen.rows - x + y * (Screen.cols)) * 4 + 2] = color[2] ? color[2] : 1;
                  leds[(Screen.rows - x + y * (Screen.cols)) * 4 + 3] = 0;
                } else {
                  leds[(x + y * (Screen.cols)) * 4]     = color[0] ? color[0] : 1;
                  leds[(x + y * (Screen.cols)) * 4 + 1] = color[1] ? color[1] : 1;
                  leds[(x + y * (Screen.cols)) * 4 + 2] = color[2] ? color[2] : 1;
                  leds[(x + y * (Screen.cols)) * 4 + 3] = 0;
                }
                // leds[(x*Screen.rows+y*Screen.cols)*4+1]   = color[1];
                // leds[(x*Screen.rows+y*Screen.cols)*4+2]   = color[2];
                // leds[(x*Screen.rows+y*Screen.cols)*4+3]   = color[3];
                for (i = 0; i < leds.length; i++) {
                    if (!leds[i]) leds[i] = null
                }
                artnet.set(leds, function(err, res) {
                    if (err) throw new Error(err);
                })
            }
        }
    }
}




var hexToRGB = function(hex) {
    if (hex.length === 4) {
        hex = hex[0] +
            hex[1] + hex[1] +
            hex[2] + hex[2] +
            hex[3] + hex[3];
    }

    var col = parseInt(hex.substring(1), 16),
        r = (col >> 16) & 0xff,
        b = (col >> 8) & 0xff,
        g = col & 0xff;

    return [r, b, g, null];
}

// tcp server
var net = require('net');
var server = net.createServer(function(socket) {
    // socket.end('goodbye\n');
    socket.on('error', function(err) {
        // handle errors here
        // console.log(err)
        // throw err;
    });
    socket.on('data', function(data) {
        if (data) {
            var packets = data.toString().split('\n')
            for (var i = 0; i < packets.length; i++) {
                updatePixelWithString(packets[i])
            }
        }
    });

})

server.listen({
    port: config.server.port,
    host: config.server.host
}, function() {
    console.log('ledflut started at ' + config.server.host + ':' + config.server.port)
});
