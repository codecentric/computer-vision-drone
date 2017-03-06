# Land the drone by voice-command

For interacting with the drone there should be a way to communicate with the drone via speech. 
At this point of the project, the connected raspberry pi has no connection to the internet. 
Due to the lack of the internet connection, services like google speech api or amazon lex are no option. 
Therefore we used [snowboy](https://snowboy.kitt.ai/) which is an offline hotword-detection software powered by kitt.ai. 
The first step for user-voice-interaction should be an emergency-landing command for the user. 
The drone should response to the users word "stop" by performing the landing procedure. 

So let's have a look at "snowboy" by kitt.ai. 
As already mentioned, "snowboy" is a hotword-detection software which means it listens on the microphone input all the time 
and if it recognize a predefined, so called "hotword", it can trigger an action. 
In our case the "hotword" should be "stop". So every time someone shout "stop" to the drone, it should land. 

## Step 0: Setup

For using "snowboy" hotword-detection you need the following dependencies

`sudo apt-get install sox node-record-lpcm16`

On top of that we use a microphone as input device so we need the correct id of the device.

`arecord -l` will give you all connected recording devices
for example:

```
**** List of CAPTURE Hardware Devices ****
card 1: Device [USB PnP Sound Device], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```

The import things are the card and device id. So look at the second line.
Our device is an usb microphone plugged to the raspberry pi. The card Id is 1 and the device id is 0.
So lets try to record from this this device:

`arecord -D 'plughw:1,0' -d 5 -f cd test.wav` 

this will record 5 seconds and save it to the give filename. After recording you can listen to the file by:

`aplay test.wav`

You should hear the recorded voice. If not make sure your audio is setup correctly.

## Step 1: train the language model

For recognizing "hotwords" or phrases, "snowboy" need to be trained. 
Therefore the developers of kitt.ai offer two ways of generating such a model.
First thing to do is, record three examples of your input you want recognize with "snowboy". 
These three recorded audio-files you now upload to kitt.ai REST-API. 
Therefore you can use the API itself or use the offered Webui. 
Both ways built an language-model file which is later used in the program.
  
## Step 2: test the hotword-detection

After building your language-model you can easily test your model by using the examples offered by kitt.ai. 
First clone the official Github repository:

`git clone https://github.com/Kitt-AI/snowboy.git`

enter the folder

`cd snowboy`

copy your genereted language-model to the resource folder

`cp path/language-model.pmdl ./resources`

navigate to the examples folder. In our case we were using the node-js examples.

`cd examples/Node`

now you see two files. The file.js is for testing with an prerecorded audio file and the microphone.js uses the connected microphone as input.
Open the microphone.js in you editor an change the following lines:

``` javascript
models.add({
  file: 'resources/snowboy.umdl',
  sensitivity: '0.5',
  hotwords : 'snowboy'
});
```

to 

``` javascript
models.add({
  file: 'resources/language-model.pmdl', // this line has changed
  sensitivity: '0.5',
  hotwords : 'snowboy'
});
```

and set the recording device by setting the device id:

```javascript
const mic = record.start({
  threshold: 0,
  device: 'plughw:1,0', // set the deviceID of the mic. see Step 0.
  verbose: true
});
```
save and close the file.

Now you can run the hotword detection:

`node microphone.js`

and you should see something like:

```
Recording with sample rate 16000...
Recording 8192 bytes
Recording 8192 bytes
Recording 4096 bytes
hotword 1 dronestop  // here the hotword is detected
Recording 4096 bytes
```

## Step 3: add hotword-detection to drone-control

Now we know the hotword-detection works we need to add it to the project.

`npm install --save snowboy`

Then we built a class for the voice-interface and added it to the drone class.
We split up the example file in several methods for better customizing the behavior within the drone initialisation. 
The reult looks like:

```javascript
/* register a Voice handler for landing on hotword detection */
        this.voice = new Voice("voice/resources/common.res");
        this.voice.addHotWord("voice/resources/Drohne_Stop.pmdl", "dronestop", 0.5); // set the path to the language-model
        this.voice.registerHotwordReaction( this.emergencyLand.bind(this)); // register the callback function which is triggered if the hotword is detected
        this.voice.triggerStart();
```

Now it is possible to configure the parameters for hotword-detection within the drone initialisation. 

## Step 4: test the landing command

Finally let's try it:

[![drone emergency stop via audio with snowboy](http://img.youtube.com/vi/ME8_x6vWVdo/0.jpg)](https://www.youtube.com/watch?v=ME8_x6vWVdo "drone emergency stop via audio with snowboy")

## Further steps

The first test showed that the rotors of the drone make too much noise so the voice commands are not recognized. 
Further steps will be reducing the noise of the rotors so the voice can be detected.