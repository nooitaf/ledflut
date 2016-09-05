var config = require('../config').config;
cw = config.screen.cols
ch = config.screen.rows


var Canvas = require('canvas')
var fs = require('fs')
var Image = Canvas.Image
var net = require('net')

canvas = new Canvas(cw, ch)
ctx = canvas.getContext('2d')

var imageFiles = ['troll.png','forever.jpg','hark.jpg','harkdark.jpg','nyancat.png']
getFile = function(){
    var imgFileName = process.argv[2] || 'img/' + imageFiles[Math.floor(Math.random()*imageFiles.length)]
    console.log(imgFileName)
    fs.readFile(__dirname + '/' + imgFileName, function(err, squid) {
        if (err) throw err;
        img = new Image;
        img.src = squid;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cw, ch);
        // render()
    });
}


renderInterval = null

var client = new net.Socket();
client.connect(config.server.port, config.server.host, function() {
    console.log('Connected');

    // getFile()
    // render()
    renderInterval = setInterval(function() {
        getFile()
        render()
    }, 1000/1)
    // client.destroy()
});

render = function(){
    var imgd = ctx.getImageData(0, 0, cw, ch);
    var pix = imgd.data;

    var row = 0
    var col = 0
    var cmds = ''
    for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = pix[i].toString(16)
        var g = pix[i + 1].toString(16)
        var b = pix[i + 2].toString(16)
        var a = pix[i + 3].toString(16)
        if (String(r).length === 1) r = '0' + r
        if (String(g).length === 1) g = '0' + g
        if (String(b).length === 1) b = '0' + b
        if (String(a).length === 1) a = '0' + a
        var bgcolor = r + '' + g + '' + b

        //HAHAHAHA
        var c = col % 2 ? 'H' : 'A'

        //POLOPOLO
        // var c = col % 3 ? 'P' : 'L'
        // c = col % 2 ? c : 'O'

        // specials
        // var c = '5'//'♪'//☆'//'†'//'℃'//'∞'//'☆' // ♪
        //

        // PX 0 0 000000
        var command = 'PX ' + col + ' ' + row + ' ' + bgcolor + '\n';  //█▓▒░┘
        // var command = 'TX ' + col + ' ' + row + ' false ' + bgcolor + '\n';  //█▓▒░┘
        // var command = 'TX ' + col + ' ' + row + ' ' + c + ' ' + bgcolor + '\n';  //█▓▒░┘
        // var command = 'PX ' + col + ' ' + row + ' '+bgcolor+'\n';  //█▓▒░┘
        // console.log(command)
        cmds += command
        col++
        if (col >= cw) {
            col = 0
            row++
        }
        if (row >= ch) {
            // clearInterval(renderInterval)
            console.log('klaar')
        }
    }
    client.write(cmds);

}


client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});

client.on('error', function(err) {
    console.log(err)
    client.destroy(); // kill client after server's response
})
client.on('close', function() {
    console.log('Connection closed');
});
