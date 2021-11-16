# Location-based examples

A brief summary of each example follows below. Aside from `hello-world`, the majority of the applications have a simulated lattitude and longitude; please modify the code to use your actual latitude and longitude.

- `hello-world`: a simple example placing a cube at a given latitude and longitude. You must edit the code to supply your latitude and longitude.

- `projected-based-camera` : version of `hello-world` using `gps-projected-camera` and `gps-projected-entity-place`.

- `click-places` -  a version of `hello-world` which demonstrates click events on entities. Please look at the code and note how the raycaster is working.

- `always-face-user` - shows how you can use A-Frame's `look-at` component to create an entity which always faces the user.

- `avoid-shaking` - demonstrates the parameters needed to minimise shaking effects. Please look at the source code for full details.

- `show-arbitrary-distant-places` - shows how you can view AR content many kilometres away using the `videoTexture` component. (In fact, currently, all working examples use `videoTexture` due to an issue - pending investigation - which occurs if it's not set)

- `places-name` - shows the use of a web API to download local POIs but currently non-operational due to the CORS proxy no longer being available.

- `peakfinder-2d` - shows the use of an OpenStreetMap based web API to download local summits. Does *not* include elevation though, hence the `2d`. Uses a working proxy.

- `osm-ways` - shows how you can use AR.js to show not just simple point features but more complex geodata such as polylines. Downloads OpenStreetMap ways (roads, footpaths etc) from a server and renders them as polylines.
