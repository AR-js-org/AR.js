# Examples for A-Frame `new-location-based` components

These examples have been written specifically, or adapted, for the `new-location-based` components available in AR.js 3.4.0 upwards.

- `hello-world` : A basic Hello World example, using only HTML, which shows a box 0.001 degrees north of your location.

- `multiple-boxes` : An extension of the `hello-world` example with four boxes, to the north, south, east and west of your current location.

- `always-face-user` : Displays text 0.001 degrees north of your current location, using the third-party A-Frame look-at component to make the text always face the camera.

- `click-places` : Demonstrates how you can add click events to your AR objects, making use of A-Frame's `cursor` and `raycaster` components.

- `basic-js` : Basic JavaScript example which dynamically creates four boxes to the north, south, east and west of your initial GPS position (whatever that is). Allows you to enter a "fake" latitude and longitude for testing on a desktop.

- `poi` : Demonstrates downloading POIs from an OpenStreetMap-based GeoJSON API and adding them to the scene as objects, with text labels.

- `poi-component` : Similar to `poi`, but demonstrating the use of a custom A-Frame component to download and display the POIs.

- `osm-ways` : A more complex example showing how more specialised geodata can be rendered with AR.js. Downloads OpenStreetMap ways (roads, paths) from a GeoJSON API, reprojects them into Spherical Mercator, and adds them to the scene as polylines made up of individual triangles.

## Coming soon!

The use of smoothing to reduce "shaking" artefacts, currently implemented in the "classic" AR.js location-based components, has been implemented as a PR for the `new-location-based` components. It is likely to be available in the next release (3.4.3).
