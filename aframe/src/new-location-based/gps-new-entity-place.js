import * as THREE from "three";
import * as AFRAME from "aframe";

AFRAME.registerComponent("gps-new-entity-place", {
  schema: {
    longitude: {
      type: "number",
      default: 0,
    },
    latitude: {
      type: "number",
      default: 0,
    },
  },

  init: function () {
    const camera = document.querySelector("[gps-new-camera]");
    if (!camera.components["gps-new-camera"]) {
      console.error("gps-new-camera not initialised");
      return;
    }
    this._cameraGps = camera.components["gps-new-camera"];

    camera.addEventListener("gps-camera-update-position", (e) => {
      this.distance = this._haversineDist(e.detail.position, this.data);
    });

    this.el.sceneEl.emit("gps-entity-place-added", {
      component: this.el,
    });
  },

  update: function () {
    const projCoords = this._cameraGps.threeLoc.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude,
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1],
    );
  },

  setDistanceFrom: function (position) {
    this.distance = this._haversineDist(position, this.data);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    const dlongitude = THREE.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = THREE.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.MathUtils.degToRad(src.latitude)) *
        Math.cos(THREE.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },
});
