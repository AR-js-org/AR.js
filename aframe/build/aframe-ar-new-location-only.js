(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-webcam-texture", {
  init: function () {
    this.scene = this.el.sceneEl;
    this.texCamera = new three__WEBPACK_IMPORTED_MODULE_1__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
    this.texScene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();

    this.scene.renderer.autoClear = false;
    this.video = document.createElement("video");
    this.video.setAttribute("autoplay", true);
    this.video.setAttribute("playsinline", true);
    this.video.setAttribute("display", "none");
    document.body.appendChild(this.video);
    this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(); //0.5, 0.5);
    this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
    this.texScene.add(mesh);
  },

  play: function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch((e) => {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            `Webcam error: ${e}`
          );
        });
    } else {
      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "sorry - media devices API not supported"
      );
    }
  },

  tick: function () {
    this.scene.renderer.clear();
    this.scene.renderer.render(this.texScene, this.texCamera);
    this.scene.renderer.clearDepth();
  },

  pause: function () {
    this.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  },

  remove: function () {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/arjs-device-orientation-controls.js":
/*!***************************************************************************!*\
  !*** ./aframe/src/new-location-based/arjs-device-orientation-controls.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
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


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-device-orientation-controls", {
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


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-camera.js":
/*!*********************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-camera.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-camera", {
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


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-entity-place.js":
/*!***************************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-entity-place.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-entity-place", {
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
  },

  update: function () {
    const projCoords = this._cameraGps.threeLoc.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1]
    );
  },
});


/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./aframe/src/new-location-based/index.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _location_based_arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../location-based/arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _gps_new_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gps-new-camera */ "./aframe/src/new-location-based/gps-new-camera.js");
/* harmony import */ var _gps_new_entity_place__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gps-new-entity-place */ "./aframe/src/new-location-based/gps-new-entity-place.js");
/* harmony import */ var _arjs_device_orientation_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./arjs-device-orientation-controls */ "./aframe/src/new-location-based/arjs-device-orientation-controls.js");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUF5QixJQUFJO0FBQ2pELHVCQUF1QiwrQ0FBa0I7QUFDekMsd0JBQXdCLG9EQUF1QixHQUFHLG1CQUFtQjtBQUNyRSxxQkFBcUIsdUNBQVU7QUFDL0I7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSw2QkFBNkIsRUFBRTtBQUMvQjtBQUNBLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2hFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWlDO0FBQ2pDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbkNnQzs7QUFFakMscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUiw2REFBNkQsS0FBSztBQUNsRTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzdLZ0M7O0FBRWpDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNsQ0Q7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ04rQztBQUNyQjtBQUNNO0FBQ1kiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9hcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvZ3BzLW5ldy1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJhZnJhbWVcIixcImNvbW1vbmpzMlwiOlwiYWZyYW1lXCIsXCJhbWRcIjpcImFmcmFtZVwiLFwicm9vdFwiOlwiQUZSQU1FXCJ9Iiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImFmcmFtZVwiLCBcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkFSanNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiQVJqc1wiXSA9IGZhY3Rvcnkocm9vdFtcIkFGUkFNRVwiXSwgcm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pID0+IHtcbnJldHVybiAiLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtd2ViY2FtLXRleHR1cmVcIiwge1xuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY2VuZSA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB0aGlzLnRleENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoLTAuNSwgMC41LCAwLjUsIC0wLjUsIDAsIDEwKTtcbiAgICB0aGlzLnRleFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCB0cnVlKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvKTtcbiAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpOyAvLzAuNSwgMC41KTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHRoaXMudmlkZW8pO1xuICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRoaXMudGV4dHVyZSB9KTtcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcbiAgICB0aGlzLnRleFNjZW5lLmFkZChtZXNoKTtcbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xuICAgICAgICB2aWRlbzoge1xuICAgICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAgIC5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpXG4gICAgICAgIC50aGVuKChzdHJlYW0pID0+IHtcbiAgICAgICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIGBXZWJjYW0gZXJyb3I6ICR7ZX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgIFwic29ycnkgLSBtZWRpYSBkZXZpY2VzIEFQSSBub3Qgc3VwcG9ydGVkXCJcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5yZW5kZXIodGhpcy50ZXhTY2VuZSwgdGhpcy50ZXhDYW1lcmEpO1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52aWRlby5zcmNPYmplY3QuZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gIH0sXG59KTtcbiIsIi8qKlxuICogYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcbiAqXG4gKiBSZXBsYWNlcyB0aGUgc3RhbmRhcmQgbG9vay1jb250cm9scyBjb21wb25lbnQgdG8gcHJvdmlkZSBtb2JpbGUgZGV2aWNlXG4gKiBvcmllbnRhdGlvbiBjb250cm9scy5cbiAqXG4gKiBBIGxpZ2h0d2VpZ2h0IEEtRnJhbWUgd3JhcHBlciByb3VuZCB0aGUgbW9kaWZpZWQgdGhyZWUuanNcbiAqIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdXNlZCBpbiB0aGUgdGhyZWUuanMgbG9jYXRpb24tYmFzZWQgQVBJLlxuICpcbiAqIENyZWF0ZXMgdGhlIFRIUkVFIG9iamVjdCB1c2luZyB1c2luZyB0aGUgdGhyZWUuanMgY2FtZXJhLCBhbmQgYWxsb3dzIHVwZGF0ZVxuICogb2YgdGhlIHNtb290aGluZyBmYWN0b3IuXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgc21vb3RoaW5nRmFjdG9yOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMSxcbiAgICB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzID0gbmV3IFRIUkVFeC5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKFxuICAgICAgdGhpcy5lbC5vYmplY3QzRFxuICAgICk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fb3JpZW50YXRpb25Db250cm9scy5zbW9vdGhpbmdGYWN0b3IgPSB0aGlzLmRhdGEuc21vb3RoaW5nRmFjdG9yO1xuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzLnVwZGF0ZSgpO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtbmV3LWNhbWVyYVwiLCB7XG4gIHNjaGVtYToge1xuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IC1OdW1iZXIuTUFYX1ZBTFVFLFxuICAgIH0sXG4gICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDEwMDAsXG4gICAgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fdGVzdEZvck9yaWVudGF0aW9uQ29udHJvbHMoKTtcblxuICAgIHRoaXMudGhyZWVMb2MgPSBuZXcgVEhSRUV4LkxvY2F0aW9uQmFzZWQoXG4gICAgICB0aGlzLmVsLnNjZW5lRWwub2JqZWN0M0QsXG4gICAgICB0aGlzLmVsLm9iamVjdDNEXG4gICAgKTtcblxuICAgIHRoaXMudGhyZWVMb2Mub24oXCJncHN1cGRhdGVcIiwgKGdwc3BvcykgPT4ge1xuICAgICAgdGhpcy5fc2VuZEdwc1VwZGF0ZUV2ZW50KGdwc3Bvcy5jb29yZHMubG9uZ2l0dWRlLCBncHNwb3MuY29vcmRzLmxhdGl0dWRlKTtcbiAgICB9KTtcblxuICAgIHRoaXMudGhyZWVMb2Mub24oXCJncHNlcnJvclwiLCAoY29kZSkgPT4ge1xuICAgICAgY29uc3QgbXNnID0gW1xuICAgICAgICBcIlVzZXIgZGVuaWVkIGFjY2VzcyB0byBHUFMuXCIsXG4gICAgICAgIFwiR1BTIHNhdGVsbGl0ZXMgbm90IGF2YWlsYWJsZS5cIixcbiAgICAgICAgXCJUaW1lb3V0IGNvbW11bmljYXRpbmcgd2l0aCBHUFMgc2F0ZWxsaXRlcyAtIHRyeSBtb3ZpbmcgdG8gYSBtb3JlIG9wZW4gYXJlYS5cIixcbiAgICAgIF07XG4gICAgICBpZiAoY29kZSA+PSAxICYmIGNvZGUgPD0gMykge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RXJyb3IobXNnW2NvZGUgLSAxXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RXJyb3IoYFVua25vd24gZ2VvbG9jYXRpb24gZXJyb3IgY29kZSAke2NvZGV9LmApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVXNlIGFyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzIG9uIG1vYmlsZSBvbmx5LCB3aXRoIHN0YW5kYXJkXG4gICAgLy8gbG9vay1jb250cm9scyBkaXNhYmxlZCAodGhpcyBpbnRlcmZlcmVzIHdpdGggdGhlIHJlYWRpbmdzIGZyb20gdGhlXG4gICAgLy8gc2Vuc29ycykuIE9uIGRlc2t0b3AsIHVzZSBzdGFuZGFyZCBsb29rLWNvbnRyb2xzIGluc3RlYWQuXG5cbiAgICBjb25zdCBtb2JpbGUgPSB0aGlzLl9pc01vYmlsZSgpO1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwibG9vay1jb250cm9scy1lbmFibGVkXCIsICFtb2JpbGUpO1xuICAgIGlmIChtb2JpbGUpIHtcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxuICAgIC8vIGlmIFNhZmFyaVxuICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgdGhpcy5fc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zKCk7XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKG9sZERhdGEpIHtcbiAgICB0aGlzLnRocmVlTG9jLnNldEdwc09wdGlvbnMoe1xuICAgICAgZ3BzTWluQWNjdXJhY3k6IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5LFxuICAgICAgZ3BzTWluRGlzdGFuY2U6IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSxcbiAgICB9KTtcbiAgICBpZiAoXG4gICAgICAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgfHwgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSAmJlxuICAgICAgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9IG9sZERhdGEuc2ltdWxhdGVMYXRpdHVkZSB8fFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT0gb2xkRGF0YS5zaW11bGF0ZUxvbmdpdHVkZSlcbiAgICApIHtcbiAgICAgIHRoaXMudGhyZWVMb2MuZmFrZUdwcyhcbiAgICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlLFxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZVxuICAgICAgKTtcbiAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlID0gMDtcbiAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSA9IDA7XG4gICAgfVxuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSA+IC1OdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICB0aGlzLnRocmVlTG9jLnNldEVsZXZhdGlvbih0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSArIDEuNik7XG4gICAgfVxuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgPT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlID09PSAwKSB7XG4gICAgICB0aGlzLnRocmVlTG9jLnN0YXJ0R3BzKCk7XG4gICAgfVxuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50aHJlZUxvYy5zdG9wR3BzKCk7XG4gIH0sXG5cbiAgX3NlbmRHcHNVcGRhdGVFdmVudDogZnVuY3Rpb24gKGxvbiwgbGF0KSB7XG4gICAgdGhpcy5lbC5lbWl0KFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxuXG4gIF90ZXN0Rm9yT3JpZW50YXRpb25Db250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1zZyA9XG4gICAgICBcIldBUk5JTkcgLSBObyBvcmllbnRhdGlvbiBjb250cm9scyBjb21wb25lbnQsIGFwcCB3aWxsIG5vdCByZXNwb25kIHRvIGRldmljZSByb3RhdGlvbi5cIjtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIl0gJiZcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJsb29rLWNvbnRyb2xzXCJdXG4gICAgKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5RXJyb3IobXNnKTtcbiAgICB9XG4gIH0sXG5cbiAgX2Rpc3BsYXlFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgY29uc3QgYXJqcyA9IHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXTtcbiAgICBpZiAoYXJqcykge1xuICAgICAgYXJqcy5fZGlzcGxheUVycm9yUG9wdXAobXNnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQobXNnKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxuICBfc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaU9TIDEzK1xuICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLlwiKTtcbiAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICB9O1xuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInRvdWNoZW5kXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYW5kbGVyKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuXG4gICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICBcIkFmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLlwiXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcbiAgICAgICAgKTtcbiAgICAgIH0sIDc1MCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIF9pc01vYmlsZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICAgKVxuICAgICkge1xuICAgICAgLy8gdHJ1ZSBmb3IgbW9iaWxlIGRldmljZVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLW5ldy1lbnRpdHktcGxhY2VcIiwge1xuICBzY2hlbWE6IHtcbiAgICBsb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgbGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZ3BzLW5ldy1jYW1lcmFdXCIpO1xuICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtbmV3LWNhbWVyYVwiXSkge1xuICAgICAgY29uc29sZS5lcnJvcihcImdwcy1uZXctY2FtZXJhIG5vdCBpbml0aWFsaXNlZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtbmV3LWNhbWVyYVwiXTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwcm9qQ29vcmRzID0gdGhpcy5fY2FtZXJhR3BzLnRocmVlTG9jLmxvbkxhdFRvV29ybGRDb29yZHMoXG4gICAgICB0aGlzLmRhdGEubG9uZ2l0dWRlLFxuICAgICAgdGhpcy5kYXRhLmxhdGl0dWRlXG4gICAgKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnNldChcbiAgICAgIHByb2pDb29yZHNbMF0sXG4gICAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnksXG4gICAgICBwcm9qQ29vcmRzWzFdXG4gICAgKTtcbiAgfSxcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuLi9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctY2FtZXJhXCI7XG5pbXBvcnQgXCIuL2dwcy1uZXctZW50aXR5LXBsYWNlXCI7XG5pbXBvcnQgXCIuL2FyanMtZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=