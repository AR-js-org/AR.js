# AR.js Location Based Implementation with Pure Three.js

This is (the basics of) an implementation of location-based AR.js using
pure three.js.

## Directory structure

The `js` directory contains the source files. It's written using ECMAScript 6
modules, and assumes you already have three.js locally installed. There is a
`package.json` provided to allow you to install three.js from NPM:

`npm install three`

## Full docs

Will follow.

## Example

Provided in the `example` directory is an example. This will behave differently
depending on the query string parameter `m` supplied to it:

- `m` missing or `m=0`: uses a default location and does not setup device orientation controls. Useful for testing on a desktop.

- `m=1` : uses a default location but does setup device orientation controls. Useful for testing on a mobile device. Move the device round and you should see a red box to the northeast, green box to the north and blue box to the west (approximately).

- `m=2` : will use GPS tracking and device orientation controls. Unless you are located near the default location, you will need to modify the `ar.js` code to add meshes near your current location.
