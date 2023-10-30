
# AR.js - Augmented Reality on the Web


[![CI](https://github.com/AR-js-org/AR.js/actions/workflows/CI.yml/badge.svg)](https://github.com/AR-js-org/AR.js/actions/workflows/CI.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Gitter chat](https://badges.gitter.im/AR-js/Lobby.png)](https://gitter.im/AR-js/Lobby)
[![Twitter Follow](https://img.shields.io/twitter/follow/nicolocarp.svg?style=plastic&label=nicolocarpignoli-𝕏(Twitter)&style=plastic)](https://twitter.com/nicolocarp)
[![Twitter Follow](https://img.shields.io/twitter/follow/jerome_etienne.svg?style=plastic&label=jeromeetienne-𝕏(Twitter)&style=plastic)](https://twitter.com/jerome_etienne)

You can now own the first commit of AR.js! 👉[OpenSea](https://opensea.io/assets/matic/0xe7ea2e2be12c257d376400cb231d8ee51e972bd6/3962549295964122998537137060348053157629730105441540397501924171148500367064/)

AR.js is a lightweight library for Augmented Reality on the Web, coming with features like Image Tracking, Location-based AR and Marker tracking.

<i><b>30/12/21 Update:</b> There is now also a brand new OSS Web AR JS library around, called [MindAR](https://github.com/hiukim/mind-ar-js).
If you need a great Image tracking feature (also multiple image tracking) and Face tracking, [go check it out](https://github.com/hiukim/mind-ar-js)!  
  As for now, AR.js is still the only library providing Marker based and Location based AR features.</i>

This project has been created by [@jeromeetienne](https://github.com/jeromeetienne), previously managed by Nicolò Carpignoli and it is now maintained by the AR.js org.

🚀For frequent updates on AR.js you can follow [@the official 𝕏(Twitter) account](https://twitter.com/ARjs_Library) and Watch this repo!

Logo is courtesy of <a href="https://twitter.com/viralinfo"> Simon Poulter </a>.

------


### ⚡️AR.js has now an official Documentation!⚡️
### Check it out: [AR.js Official Documentation](https://ar-js-org.github.io/AR.js-Docs/).

If you want to give a first look at AR.js potential, you can continue with this Readme.

-----


⚡️ AR.js is coming in different builds. They are both maintained. They are exclusive.

Please import the one you need for your project, not both:

- **AR.js with Image Tracking + Location Based AR (AFRAME):**

  - https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js

- **AR.js with Marker Tracking + Location Based AR (AFRAME):**

  - https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js


- **AR.js with Image Tracking + Marker Tracking (Threejs):**

  - https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex.js

  if you need the ARjs namespace import ar.js:

  - https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js

- **AR.js with Location Based AR (Threejs):**

  - https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js


You can also import a specific version replacing `master` keyword with version tag:

```html
  <script src="https://raw.githack.com/AR-js-org/AR.js/3.4.5/aframe/build/aframe-ar-nft.js">
```

## Get started

### 🖼 **Image Tracking**

Please follow these simple steps:

- Create a new project with the code below (or [open this live example](https://ar-js-org.github.io/.github/profile/aframe/examples/image-tracking/nft/) and go directly to the last step)
- Run it on a server
- Open the website on your phone
- Scan [this picture](https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex-image-big.jpeg) to see content through the camera.

```html
<script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1.3.0/dist/aframe-master.min.js"></script>
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

<style>
  .arjs-loader {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arjs-loader div {
    text-align: center;
    font-size: 1.25em;
    color: white;
  }
</style>

<body style="margin : 0px; overflow: hidden;">
  <!-- minimal loader shown until image descriptors are loaded -->
  <div class="arjs-loader">
    <div>Loading, please wait...</div>
  </div>
  <a-scene
    vr-mode-ui="enabled: false;"
    renderer="logarithmicDepthBuffer: true; precision: medium;"
    embedded
    arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;"
  >
    <!-- we use cors proxy to avoid cross-origin problems ATTENTION! you need to set up your server -->
    <a-nft
      type="nft"
      url="your-server/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
      smooth="true"
      smoothCount="10"
      smoothTolerance=".01"
      smoothThreshold="5"
    >
      <a-entity
        gltf-model="your-server/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
        scale="5 5 5"
        position="150 300 -100"
      >
      </a-entity>
    </a-nft>
    <a-entity camera></a-entity>
  </a-scene>
</body>
```

### 🌍Location Based Example

Please follow these simple steps:

- Create a new project with the following snippet, and change `add-your-latitude` and `add-your-longitude` with your latitude and longitude, without the `<>`.
- Run it on a server
- Activate GPS on your phone and navigate to the example URL
- Look around. You should see the text looking at you, appearing in the requested position, even if you look around and move.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GeoAR.js demo</title>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body>
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
    >
      <a-text
        value="This content will always face you."
        look-at="[gps-camera]"
        scale="120 120 120"
        gps-entity-place="latitude: <add-your-latitude>; longitude: <add-your-longitude>;"
      ></a-text>
      <a-camera gps-camera rotation-reader> </a-camera>
    </a-scene>
  </body>
</html>
```

### 🔲 Marker Based Example

Please follow this simple steps:

- Create a new project with the code below (or [open this live example](https://ar-js-org.github.io/.github/profile/aframe/examples/marker-based/basic.html) and go directly to the last step)
- Run it on a server
- Open the website on your phone
- Scan [this picture](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png) to see content through the camera.

```html
<!DOCTYPE html>
<html>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <!-- we import arjs version without NFT but with marker + location based support -->
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <body style="margin : 0px; overflow: hidden;">
        <a-scene embedded arjs>
        <a-marker preset="hiro">
            <!-- we use cors proxy to avoid cross-origin problems ATTENTION! you need to set up your server -->
            <a-entity
            position="0 0 0"
            scale="0.05 0.05 0.05"
            gltf-model="your-server/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
            ></a-entity>
        </a-marker>
        <a-entity camera></a-entity>
        </a-scene>
    </body>
</html>
```
Important! Be aware that if you are referring to external resources, in any app, especially those using NFT, you will encounter CORS problems if those resources are not in the same server of the code. If you can’t see the tracking, please open your Browser Dev Tools and check if you have CORS errors in the console. If so, you have to fix those errors in order to see your content. The correct fix is to place your resources on the same server of your code.

If you cannot do that, you can host a proxy anywhere server to solve that (https://github.com/Rob--W/cors-anywhere).
Please note that several hosting services have policies that does not permit to use such server. Always check hosting services policies before using them to avoid account suspensions

Learn more on the [AR.js Official Documentation](https://ar-js-org.github.io/AR.js-Docs/).

## ES6 npm package

You can install **AR.js** with **npm** and use in any compatible project that support npm modules (React.js, Vue.js, Next.js or whatelse), to install it run:

```
// Install with npm
npm install @ar-js-org/ar.js
```
```
// Install with yarn
yarn add @ar-js-org/ar.js
```
For some examples read this [issue](https://github.com/AR-js-org/AR.js/issues/234).
## Troubleshooting, feature requests, community

**You can find a lot of help on the old [AR.js repositories issues](https://github.com/jeromeetienne/AR.js/issues). Please search on open/closed issues, you may find interesting stuff.**

### Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcome. If you're planning to implement a new feature or change
the api please create an issue first. This way we can ensure that your precious
work is not in vain.

### Issues

If you are having configuration or setup problems, please post
a question to [StackOverflow](https://stackoverflow.com/search?q=ar.js).
You can also address the question to us in our [Gitter chatroom](https://gitter.im/AR-js/Lobby)

**If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.**

### Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## Licenses

It is **all open-source**! artoolkit5-js is under LGPLv3 license and additional permission.
And all my code in the AR.js repository is under MIT license. :)

For legal details, be sure to check [artoolkit5-js license](https://github.com/AR-js-org/artoolkit5-js/blob/master/LICENSE)
and [AR.js license](https://github.com/AR-js-org/AR.js/blob/master/LICENSE).

Full Changelog: [AR.js changelog](https://github.com/AR-js-org/AR.js/blob/master/CHANGELOG.md)
