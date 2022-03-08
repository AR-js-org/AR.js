# AR.js Location Based Implementation with Pure Three.js

This is a simple, lightweight implementation of location-based AR.js using pure three.js. **It will only work on Chrome due to limitations with obtaining compass bearing on other browsers. Also, it is only tested on Android, not iOS. I believe it is possible to get it to work on Webkit-based browsers due to `webkitCompassHeading`, but I don't have any iDevices so cannot test this. However pull requests to fix this are welcome!**

## Example

Provided in the `example/location-based` directory is an example. It will check if a Mobile device is in use there are two cases:
- if gps is enabled you will need to modify the `example/location-based/index.js` code to add meshes near your current location.
- if gps is not enabled a fakeGps will start and you will see the four meshes.
  
In any case, it does setup device orientation controls and you will see the following:

- Red box a short distance to your north
- Green box a short distance to your east
- Yellow box a short distance to your south 
- Blue box a short distance to your west 

