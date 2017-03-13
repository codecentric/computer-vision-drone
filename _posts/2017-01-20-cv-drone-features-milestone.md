# Computer Vision Drone Features and Milestones

This is the first set of features that we want to work on.

## Emergency Stop 

This will be the first feature to implement. 

* implement a stable way to stop the drone
* make sure it works in every condition (WLAN problems etc.)

## Rotate and Find a person in a room

After we have emergency stop, we can start working on computer vision. In the beginning we won't 
have distance sensors and microphones so we are limited in what we can do.

* start the drone via API
* drone stays 1m above ground 
* it slowly turns around 360°
* the video signal is analyzed to detect persons in the room
* if the drone finds a certain person it should stop rotating and focus the person, either:
  * person must point up
  * person must hold specially colored thing
* if person moves left/right, drone should follow by rotating (keep the person centered)
* if person does special gesture, drone should land

## Emergency Stop via Audio Signal

After we have sensors on board. Coding can be started anyway.

* Land drone if somebody shouts "STOP"

## Find Person from Audio triangulation

With 3 microphones on board we can modify the person finder. 

* Drone should not rotate anymore
* If somebody shouts "Hey Drone" it estimates the position from Audio signals 
* rotates to estimated position and center / focus the person
* follow the person as long as he/she points up (only rotating)

