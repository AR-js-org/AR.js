import * as AFRAME from "aframe";
import * as THREEx from "../../../three.js/build/ar-threex-location-only.js";

AFRAME.registerComponent("gps-new-camera", {
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0,
    },
    simulateLongitude: {
      type: "number",
      default: 0,
    },
    simulateAltitude: {
      type: "number",
      default: -Number.MAX_VALUE,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "number",
      default: 100,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
    initialPositionAsOrigin: {
      type: "boolean",
      default: false,
    },
  },

  init: function () {
    this._testForOrientationControls();

    this.fakeGpsStarted = false;

    this.threeLoc = new THREEx.LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D,
      {
        initialPositionAsOrigin: this.data.initialPositionAsOrigin,
      },
    );

    this.threeLoc.on("gpsupdate", (gpspos) => {
      this._currentPosition = {
        longitude: gpspos.coords.longitude,
        latitude: gpspos.coords.latitude,
      };
      this._sendGpsUpdateEvent(gpspos.coords.longitude, gpspos.coords.latitude);
    });

    this.threeLoc.on("gpserror", (code) => {
      const msg = [
        "User denied access to GPS.",
        "GPS satellites not available.",
        "Timeout communicating with GPS satellites - try moving to a more open area.",
      ];
      if (code >= 1 && code <= 3) {
        this._displayError(msg[code - 1]);
      } else {
        this._displayError(`Unknown geolocation error code ${code}.`);
      }
    });

    // Use arjs-device-orientation-controls on mobile only, with standard
    // look-controls disabled (this interferes with the readings from the
    // sensors). On desktop, use standard look-controls instead.

    const mobile = this._isMobile();
    this.el.setAttribute("look-controls-enabled", !mobile);
    if (mobile) {
      this.el.setAttribute("arjs-device-orientation-controls", true);
    }

    // from original gps-camera component
    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      this._setupSafariOrientationPermissions();
    }

    this.el.sceneEl.addEventListener("gps-entity-place-added", (e) => {
      const entityPlace = e.detail.component.components["gps-new-entity-place"];
      if (this._currentPosition) {
        entityPlace.setDistanceFrom(this._currentPosition);
      }
    });
  },

  update: function (oldData) {
    this.threeLoc.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance,
      maximumAge: this.data.gpsTimeInterval,
    });
    if (
      !this.fakeGpsStarted &&
      (this.data.simulateLatitude !== 0 || this.data.simulateLongitude !== 0) &&
      (this.data.simulateLatitude != oldData.simulateLatitude ||
        this.data.simulateLongitude != oldData.simulateLongitude)
    ) {
      this.threeLoc.stopGps();
      this.threeLoc.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude,
      );
      this.fakeGpsStarted = true;
    }
    if (this.data.simulateAltitude > -Number.MAX_VALUE) {
      this.threeLoc.setElevation(this.data.simulateAltitude + 1.6);
    }
  },

  play: function () {
    if (this.data.simulateLatitude === 0 && this.data.simulateLongitude === 0) {
      this.threeLoc.startGps();
    }
  },

  pause: function () {
    this.threeLoc.stopGps();
  },

  latLonToWorld: function (lat, lon) {
    return this.threeLoc.lonLatToWorldCoords(lon, lat);
  },

  getInitialPosition: function () {
    return this.threeLoc.initialPosition;
  },

  _sendGpsUpdateEvent: function (lon, lat) {
    this.el.emit("gps-camera-update-position", {
      position: {
        longitude: lon,
        latitude: lat,
      },
    });
  },

  _testForOrientationControls: function () {
    const msg =
      "WARNING - No orientation controls component, app will not respond to device rotation.";
    if (
      !this.el.components["arjs-device-orientation-controls"] &&
      !this.el.components["look-controls"]
    ) {
      this._displayError(msg);
    }
  },

  _displayError: function (error) {
    const arjs = this.el.sceneEl.systems["arjs"];
    if (arjs) {
      arjs._displayErrorPopup(error);
    } else {
      alert(error);
    }
  },

  // from original gps-camera component
  _setupSafariOrientationPermissions: function () {
    // iOS 13+
    if (
      typeof window.DeviceOrientationEvent?.requestPermission === "function"
    ) {
      var handler = function () {
        console.log("Requesting device orientation permissions...");
        DeviceOrientationEvent.requestPermission();
        document.removeEventListener("touchend", handler);
      };

      document.addEventListener(
        "touchend",
        function () {
          handler();
        },
        false,
      );

      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "After camera permission prompt, please tap the screen to activate geolocation.",
      );
    } else {
      var timeout = setTimeout(() => {
        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "Please enable device orientation in Settings > Safari > Motion & Orientation Access.",
        );
      }, 750);
      window.addEventListener(
        "deviceorientation",
        function () {
          clearTimeout(timeout);
        },
        { once: true },
      );
    }
  },

  _isMobile: function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      // true for mobile device
      return true;
    }
    return false;
  },
});
