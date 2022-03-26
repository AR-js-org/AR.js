import * as AFRAME from "aframe";

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
      default: 1000,
    },
  },

  init: function () {
    this._testForOrientationControls();

    this.threeLoc = new THREEx.LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D
    );

    this.threeLoc.on("gpsupdate", (gpspos) => {
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
  },

  update: function (oldData) {
    this.threeLoc.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance,
    });
    if (
      (this.data.simulateLatitude !== 0 || this.data.simulateLongitude !== 0) &&
      (this.data.simulateLatitude != oldData.simulateLatitude ||
        this.data.simulateLongitude != oldData.simulateLongitude)
    ) {
      this.threeLoc.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude
      );
      this.data.simulateLatitude = 0;
      this.data.simulateLongitude = 0;
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
      arjs._displayErrorPopup(msg);
    } else {
      alert(msg);
    }
  },

  // from original gps-camera component
  _setupSafariOrientationPermissions: function () {
    // iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
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
        false
      );

      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "After camera permission prompt, please tap the screen to activate geolocation."
      );
    } else {
      var timeout = setTimeout(function () {
        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
        );
      }, 750);
      window.addEventListener(eventName, function () {
        clearTimeout(timeout);
      });
    }
  },

  _isMobile: function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      return true;
    }
    return false;
  },
});
