# Examples for A-Frame `new-location-based` components

These examples have been written specifically, or adapted, for the `new-location-based` components available in AR.js 3.4.0 upwards.

- `hello-world` : A basic Hello World example, using only HTML, which shows a box 0.001 degrees north of your location.

- `multiple-boxes` : An extension of the `hello-world` example with four boxes, to the north, south, east and west of your current location.

- `always-face-user` : Displays text 0.001 degrees north of your current location, using the third-party A-Frame look-at component to make the text always face the camera.

- `click-places` : Demonstrates how you can add click events to your AR objects, making use of A-Frame's `cursor` and `raycaster` components.

- `basic-js` : Basic JavaScript example which dynamically creates four boxes to the north, south, east and west of your initial GPS position (whatever that is). Allows you to enter a "fake" latitude and longitude for testing on a desktop.

- `basic-js-modules` : version of `basic-js` which uses an ES6 import to include AR.js. Requires building using Webpack: a `webpack.config.js` is provided.

- `show-distance` : version of `basic-js` which shows the distance to a given object when you click on it.

- `poi` : Demonstrates downloading POIs from an OpenStreetMap-based GeoJSON API and adding them to the scene as objects, with text labels.

- `poi-component` : Similar to `poi`, but demonstrating the use of a custom A-Frame component to download and display the POIs.

- `osm-ways` : A more complex example showing how more specialised geodata can be rendered with AR.js. Downloads OpenStreetMap ways (roads, paths) from a GeoJSON API, reprojects them into Spherical Mercator, and adds them to the scene as polylines made up of individual triangles.

- `avoid-shaking` : A version of `basic-js` with a smoothing factor applied to reduce shaking effects.
