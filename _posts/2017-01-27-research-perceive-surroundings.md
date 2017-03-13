# Basic Research: Perception of the drones surroundings

One of the first work package is to find out how to enable the drone to perceive its surrounding.

![header](./media/header_resistor.jpg)

## Basic considerations

As our drone shall flight without external control, it will require the ability to perceive its surroundings. 
Even if there are many different ways, we all agreed that the easiest way to achieve that would be to use 
some basic distance sensors on a micro-controller. We already have some experiences with Arduino, Raspberry 
and such in our team, and this working package was perfectly suitable for parallel work, so we started with
it as one of our first steps.

## Finding a suitable sensor type

We found that there are basically two different groups of sensors which could fit our needs:

- Acoustic sensors (ultrasonic)
- Optical sensors (like infrared or lasers)

They differ significantly in price and capabilities. For example, most infrared sensors are useable for 
small or middle distances (30cm - 150cm). We also found some laser sensors, but their price was always more
than 100€ per unit.
The solution for us was the very cheap HC-SR04 ultrasonic sensor. With a price of less than 3€ per unit, 
a distance range between 2cm and ~300cm and a low weight, it is perfectly suitable for our drone to find out what's upfront.

## The HC-SR04 ultrasonic sensor

No, the HC-SR04 is not the smallest sensor and we might have some trouble mounting it on our drone. But we are 
sure that we get this solved. Here is how the sensor looks like:

![HC-SR04 ultrasonic sensor](./media/hc_sr_04_small.jpg)

The functional principle is easy to explain: The sensor is equipped with a loudspeaker and a microphone. If it 
is triggered, it sends out an acoustic signal and then listens if and when the signal returns and measures this 
delay. The acoustic velocity is approximately known, so the distance is calculable.

## The hardware setup

For our drone, we started with a setup of 4 sensors on a Raspberry Pi. For the moment we had enough free GPIO pins,
so we started without experimenting on bus systems like SPI or I2C. 

The HC-SR04 has four pins to connect:
- VCC (5V power supply)
- Trigger (incoming signal will start measurement)
- Echo (outgoing signal will provide the result of the measurement)
- Ground

We connected the trigger and echo pins to any free GPIO pins on our Pi, and came to this result:

![HC-SR04 ultrasonic sensor](./media/ultrasonic_sketch_small.jpg)

You can see that we created 4 4-Pin connectors where we can plug in the ultrasonic sensors and one 10-pin connector 
for the connection to the PI. The resistors are needed to bring down the voltage of the echo pin from 5V to 3.3V.


## Testing the sensors

Now it was time to test our sensor setup. Therefore we "wrote" a little Python script (we copied it from the internet) 
and adjusted it to support four instead of one sensor and ran it on the Pi.

We also made some experiments with a single common echo line (instead of one per sensor), but the Python script was too 
slow to process all four responses in the available time (at least in one thread). That's no problem because we have enough 
free GPIO pins on the Pi, but if we have to save some for other things in future, we will revisit this approach - it's not yet 
exhausted.

Finally, let's have a short look at our python script. Here it is:

```python
import time
import RPi.GPIO as GPIO

triggerPins =   [10, 23, 27, 17]
echoPins =      [9,  24, 22, 18]

# function to measure the distance
def measureDistance(gpioTrigger, gpioEcho):

    # set trigger to high
    GPIO.output(gpioTrigger, True)

    # set trigger after 10µs to low
    time.sleep(0.00001)
    GPIO.output(gpioTrigger, False)

    # store initial start time
    startTime = time.time()

    # store start time
    while GPIO.input(gpioEcho) == 0:
      startTime = time.time()

    # store stop time
    while GPIO.input(gpioEcho) == 1:
      stopTime = time.time()

    # calculate distance
    timeElapsed = stopTime - startTime
    distance = (timeElapsed * 34300) / 2

    return distance

def main():

  try:
    while True:

      for idx in xrange(0, len(triggerPins)):
          distance = measureDistance(triggerPins[idx], echoPins[idx])
          print("Measured Distance for sensor " + str(idx) + " == %.1f cm" % distance)
      print("----------------------------------------")
      time.sleep(0.3)

  # reset GPIO settings if user pressed Ctrl+C
  except KeyboardInterrupt:
    print("Measurement stopped by user")
    GPIO.cleanup()

if __name__ == '__main__':
  # use GPIO pin numbering convention
  GPIO.setmode(GPIO.BCM)

  # set up GPIO pins
  for t in triggerPins:
    GPIO.setup(t, GPIO.OUT)

    # set trigger to false
    GPIO.output(t, False)

  for t in echoPins:
    GPIO.setup(t, GPIO.IN)

  main()
```

As you can see, we connected the pins as follows to the Pi:

- Trigger Pins: 10, 23, 27, 17
- Echo Pins: (Order according to the trigger pins): 9, 24, 22, 18

The script works as explained above and without any problems, except some measuring errors where the distance is about ten times 
higher than expected. But that's fine for now because our primary goal was reached, and we will solve this problem in our final 
implementation.
