//


var Screen = {
    cols: 300,
    rows: 1,
    channels: 4
}



var options = {
    // host: '10.0.0.255' //default
    host: '10.0.0.104'
}

var artnet = require('artnet')(options);



// darken everything
var channels = Screen.cols * Screen.rows * Screen.channels
var universes = Math.round(channels/512)
for(var i=0;i<=universes;i++){
  artnet.set(i,1,Array(512).fill(1))
}

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
                artnet.set(leds, function(err, res) {
                    if (err) console.log(err);
                })
            }
        }
        if (f === "PX") {
            var color = String(params[3]) ? '#' + String(params[3]) : false
            if (params.length === 4) {
                color = hexToRGB(color)
                var channel = (x + y * Screen.cols) * 4 + 1
                var universe = Math.floor(channel/512)
                console.log("channel: %i  universe: %i", channel, universe)
                console.log(universe,channel-universe*512,[color[0],color[1],color[2]])
                artnet.set(universe,channel-universe*512,[color[0],color[1],color[2],null], function(err, res) {
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
    port: 1234,
    host: '0.0.0.0'
}, function() {
    address = server.address();
    console.log('opened server on %j', address);
    // Render the screen.
    console.log('asciiflut ' + server.address().address + ':1234')
});
