#include <Arduino.h>

/*
This example will receive multiple universes via Artnet and control a strip of ws2811 leds via
Adafruit's NeoPixel library: https://github.com/adafruit/Adafruit_NeoPixel
This example may be copied under the terms of the MIT license, see the LICENSE file for details
*/

#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ArtnetWifi.h>
#include <Adafruit_NeoPixel.h>

//Wifi settings
const char* ssid = "SSID";
const char* password = "PASS";

// Neopixel settings
const int numLeds = 30; // change for your setup
const int numberOfChannels = numLeds * 4; // Total number of channels you want to receive (1 led = 3 channels)
const byte dataPin = 12;
Adafruit_NeoPixel leds = Adafruit_NeoPixel(numLeds, dataPin, NEO_GRBW + NEO_KHZ800);

// Artnet settings
ArtnetWifi artnet;
const int startUniverse = 0; // CHANGE FOR YOUR SETUP most software this is 1, some software send out artnet first universe as 0.

// Check if we got all universes
const int maxUniverses = numberOfChannels / 512 + ((numberOfChannels % 512) ? 1 : 0);
bool universesReceived[maxUniverses];
bool sendFrame = 1;
int previousDataLength = 0;

// connect to wifi – returns true if successful or false if not
boolean ConnectWifi(void)
{
  boolean state = true;
  int i = 0;

  WiFi.begin(ssid, password);
  //WiFi.mode(WIFI_STA);
  //WiFi.softAPdisconnect(true);

  Serial.println("");
  Serial.println("Connecting to WiFi");

  // Wait for connection
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (i > 20){
      state = false;
      break;
    }
    i++;
  }
  if (state){
    delay(200);
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    delay(500);
    initTest();
    for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 255, 0, 0); // Green
    leds.setBrightness(60);
    leds.show();


  } else {
    delay(200);
    Serial.println("");
    Serial.println("Connection failed.");
    delay(500);
    leds.begin();
    for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 0, 0, 0); // Black
    leds.show();
    delay(300);
    for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 255, 0, 0, 0); // Red
    leds.show();
  }

  return state;
}

void initTest()
{
  leds.begin();
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 0, 0, 0); //G
  leds.show();
  delay(500);
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 255, 0, 0, 0); //R
  leds.show();
  delay(500);
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 255, 0, 0); //G
  leds.show();
  delay(500);
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 0, 255, 0); //B
  leds.show();
  delay(500);
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 0, 0, 255); //W
  leds.show();
  delay(500);
  for (int i = 0 ; i < numLeds ; i++) leds.setPixelColor(i, 0, 0, 0, 0); //G
  leds.show();
  delay(500);

  leds.clear();
}

void onDmxFrame(uint16_t universe, uint16_t length, uint8_t sequence, uint8_t* data)
{
  Serial.println(universe);
  Serial.println(sequence);
  Serial.println(data[0]);

  sendFrame = 1;
  // set brightness of the whole strip
  if (universe == 15)
  {
    leds.setBrightness(data[0]);
    leds.show();
  }

  // Store which universe has got in
  if ((universe - startUniverse) < maxUniverses)
    universesReceived[universe - startUniverse] = 1;

  for (int i = 0 ; i < maxUniverses ; i++)
  {
    if (universesReceived[i] == 0)
    {
      //Serial.println("Broke");
      sendFrame = 0;
      break;
    }
  }

  // read universe and put into the right part of the display buffer
  for (int i = 0; i < length / 4; i++)
  {
    int led = i + (universe - startUniverse) * (previousDataLength / 4);
  /*
    if (led < numLeds) {
      if (data[i*3+1] == data[i*3] && data[i*3] == data[i*3+2]) { // check if White
        leds.setPixelColor(led, 0, 0, 0, data[i*3]);
      } else {
        leds.setPixelColor(led, data[i * 3 + 1], data[i * 3], data[i * 3 + 2],0);
      }
    }
  */
    if (led < numLeds) {
      Serial.println("changing led");
      Serial.println(data[i * 4]);
      Serial.println(data[i * 4+1]);
      Serial.println(data[i * 4+2]);
      leds.setPixelColor(led, data[i * 4], data[i * 4+ 1 ], data[i * 4 + 2]);
    }

  }
  previousDataLength = length;

  if (sendFrame)
  {
    leds.show();
    Serial.println("changing led");
    // Reset universeReceived to 0
    memset(universesReceived, 0, maxUniverses);
  }
}

void setup()
{
  Serial.begin(115200);
  artnet.begin();
//  initTest();/
  ConnectWifi();

  // this will be called for each packet received
  artnet.setArtDmxCallback(onDmxFrame);
}

void loop()
{
  // we call the read function inside the loop
  artnet.read();
}
