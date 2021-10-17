# AR.js Location Based Implementation with Pure Three.js

This is a simple, lightweight implementation of location-based AR.js using pure three.js.

## Directory structure

The `js` directory contains the source files. It's written using ECMAScript 6 modules. There is a `package.json` provided to allow you to install three.js from NPM:

`npm install`

## Building

Using Webpack is assumed. There is a simple `webpack.config.js` which is configured to place a `bundle.js` inside `example/dist`. Build with

`npx webpack`

## Full docs

Will follow.

## Example

Provided in the `example` directory is an example. This will behave differently
depending on the query string parameter `m` supplied to it:

- `m` missing or `m=0`: uses a default location and does not setup device orientation controls. Useful for testing on a desktop.

- `m=1` : uses a default location but does setup device orientation controls. Useful for testing on a mobile device. Move the device round and you should see a red box to the northeast, green box to the north and blue box to the west (approximately).

- `m=2` : will use GPS tracking and device orientation controls. Unless you are located near the default location, you will need to modify the `index.js` code to add meshes near your current location.

If `m=1` is used (default location with device orientation controls) you should see the following:

- Red box a short distance to your north
- Green box a short distance to your east
- Yellow box a short distance to your south 
- Blue box a short distance to your west 

There are some remaining issues with device orientation controls, particularly if in portrait or using Firefox, so this may not work perfectly just yet. These are the same issues encountered on the A-Frame version of location-based.
