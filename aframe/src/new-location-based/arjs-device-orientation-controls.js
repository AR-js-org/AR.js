/**
 * arjs-device-orientation-controls
 *
 * Replaces the standard look-controls component to provide mobile device
 * orientation controls.
 *
 * A lightweight A-Frame wrapper round the modified three.js
 * DeviceOrientationControls used in the three.js location-based API.
 *
 * Creates the THREE object using using the three.js camera, and allows update
 * of the smoothing factor.
 */

import * as AFRAME from "aframe";
AFRAME.registerComponent("arjs-device-orientation-controls", {
  schema: {
    smoothingFactor: {
      type: "number",
      default: 1,
    },
  },

  init: function () {
    this._orientationControls = new THREEx.DeviceOrientationControls(
      this.el.object3D
    );
  },

  update: function () {
    this._orientationControls.smoothingFactor = this.data.smoothingFactor;
  },

  tick: function () {
    this._orientationControls.update();
  },
});
