# AR.js - Augmented Reality on the Web

<img src="./logo.png" height="200" />

---

[![Build Status](https://travis-ci.org/jeromeetienne/AR.js.svg?branch=master)](https://travis-ci.org/jeromeetienne/AR.js)
[![Gitter chat](https://badges.gitter.im/AR-js/Lobby.png)](https://gitter.im/AR-js/Lobby)
[![Twitter Follow](https://img.shields.io/twitter/follow/nicolocarp.svg?style=plastic&label=nicolocarpignoli-twitter&style=plastic)](https://twitter.com/nicolocarp)
[![Twitter Follow](https://img.shields.io/twitter/follow/jerome_etienne.svg?style=plastic&label=jeromeetienne-twitter&style=plastic)](https://twitter.com/jerome_etienne)

AR.js is a lightweight library for Augmented Reality on the Web, coming with features like Image Tracking, Location based AR and Marker tracking.

Welcome to the official repository!

This project has been created by [@jeromeetienne](https://github.com/jeromeetienne) and it is now maintained by [@nicolocarpignoli](https://github.com/nicolocarpignoli).

🚀For frequent updates on AR.js you can follow [@nicolocarp](https://twitter.com/nicolocarp) and Watch this repo!

------


### ⚡️AR.js has now an official Documentation!⚡️
### Check it out: [AR.js Official Documentation](https://ar-js-org.github.io/AR.js-Docs/).

If you want to give a first look at AR.js potential, you can continue with this Readme.

-----


⚡️ AR.js is coming in two, different builds. They are both maintained. They are exclusive.

Please import the one you need for your project, not both:

- **AR.js with Image Tracking + Location Based AR:**

  - AFRAME version: https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js

  - three.js version: https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-nft.js

- **AR.js with Marker Tracking + Location Based AR:**

  - AFRAME version: https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js

  - three.js version: https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar.js


You can also import a specific version replacing `master` keyword with version tag:

```html
  <script src="https://raw.githack.com/AR-js-org/AR.js/3.1.0/aframe/build/aframe-ar-nft.js">
```

## Get started

### 🖼 **Image Tracking**

Please follow this simple steps:

- Create a new project with the code below (or [open this live example](https://ar-js-org.github.io/AR.js/aframe/examples/image-tracking/nft/) and go directly to the last step)
- Run it on a server
- Open the website on your phone
- Scan [this picture](https://raw.githubusercontent.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex-image-big.jpeg) to see content through the camera.

```html
<script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1c2407b26c61958baa93967b5412487cd94b290b/dist/aframe-master.min.js"></script>
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
    renderer="logarithmicDepthBuffer: true;"
    embedded
    arjs="trackingMethod: best; sourceType: webcam;debugUIEnabled: false;"
  >
    <!-- we use cors proxy to avoid cross-origin problems -->
    <a-nft
      type="nft"
      url="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
      smooth="true"
      smoothCount="10"
      smoothTolerance=".01"
      smoothThreshold="5"
    >
      <a-entity
        gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
        scale="5 5 5"
        position="50 150 0"
      >
      </a-entity>
    </a-nft>
    <a-entity camera></a-entity>
  </a-scene>
</body>
```

### 🌍Location Based Example

Please follow this simple steps:

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
    <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
  </head>

  <body style="margin: 0; overflow: hidden;">
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
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

- Create a new project with the code below (or [open this live example](https://ar-js-org.github.io/AR.js/aframe/examples/marker-based/basic.html) and go directly to the last step)
- Run it on a server
- Open the website on your phone
- Scan [this picture](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png) to see content through the camera.

```html
<!DOCTYPE html>
<!DOCTYPE html>
<html>
    <script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
    <!-- we import arjs version without NFT but with marker + location based support -->
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <body style="margin : 0px; overflow: hidden;">
        <a-scene embedded arjs>
        <a-marker preset="hiro">
            <a-entity
            position="0 -1 0"
            scale="0.05 0.05 0.05"
            gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
            ></a-entity>
        </a-marker>
        <a-entity camera></a-entity>
        </a-scene>
    </body>
</html>
```

Learn more on the [AR.js Official Documentation](https://ar-js-org.github.io/AR.js-Docs/).

## Troubleshooting, feature requests, community

**You can find a lot of help on the old [AR.js repositories issues](https://github.com/jeromeetienne/AR.js/issues). Please search on open/closed issues, you may find a interesting stuff.**

### Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcome. If you're planning to implement a new feature or change
the api please create an issue first. This way we can ensure that your precious
work is not in vain.

### Issues

If you are having configuration or setup problems, please post
a question to [StackOverflow](https://stackoverflow.com/search?q=ar.js).
You can also address question to us in our [Gitter chatroom](https://gitter.im/AR-js/Lobby)

**If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.**

### Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

## Licenses

It is **all open source**! jsartoolkit5 is under LGPLv3 license and additional permission.
And All my code in AR.js repository is under MIT license. :)

For legal details, be sure to check [jsartoolkit5 license](https://github.com/artoolkitx/jsartoolkit5/blob/master/LICENSE.txt)
and [AR.js license](https://github.com/AR-js-org/AR.js/blob/master/LICENSE).

Full Changelog: [AR.js changelog](https://github.com/AR-js-org/AR.js/blob/master/CHANGELOG.md)
