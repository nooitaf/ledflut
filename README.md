# ledflut

[pixelflut](https://github.com/defnull/pixelflut) clone using nodemcu, ledstrips, artnet and nodejs

<img src="http://imgur.com/b9TvLFA.jpg" alt="screenshot.jpg"> 

`server.js` bridges pixelflut command to artnet
`/examples` pixelflut command generator examples
`/esp` nodemcu examples

### Install Server
Edit `config.js` to reflect your setup
````bash
npm install
node server.js
````

### Install ESP/nodemcu
Choose from `/esp` your strip type (WS2812B/...)
Edit led-count, color-type (RGBW) and wifi settings (SSID/PASS)
Flash

> Special thanks to [buzztiaan/art-net](https://github.com/buzztiaan/art-net) for getting the LEDS + ESP8266 + Art-Net part working :)
