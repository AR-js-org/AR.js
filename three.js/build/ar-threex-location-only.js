(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["THREEx"] = factory(require("three"));
	else
		root["THREEx"] = factory(root["THREE"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_three__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./three.js/src/location-based/js/device-orientation-controls.js":
/*!***********************************************************************!*\
  !*** ./three.js/src/location-based/js/device-orientation-controls.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* binding */ DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
// Modified version of THREE.DeviceOrientationControls from three.js
// will use the deviceorientationabsolute event if available



const _zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);
const _euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();
const _q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();
const _q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    const onDeviceOrientationChangeEvent = function (event) {
      scope.deviceOrientation = event;
    };

    const onScreenOrientationChangeEvent = function () {
      scope.screenOrientation = window.orientation || 0;
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    const setObjectQuaternion = function (
      quaternion,
      alpha,
      beta,
      gamma,
      orient
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load

      // iOS 13+

      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "orientationchange",
                onScreenOrientationChangeEvent
              );
              window.addEventListener(
                this.orientationChangeEventName,
                onDeviceOrientationChangeEvent
              );
            }
          })
          .catch(function (error) {
            console.error(
              "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent
        );
        window.addEventListener(
          this.orientationChangeEventName,
          onDeviceOrientationChangeEvent
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent
      );
      window.removeEventListener(
        this.orientationChangeEventName,
        onDeviceOrientationChangeEvent
      );

      scope.enabled = false;
    };

    this.update = function () {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        const alpha = device.alpha
          ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        const beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.beta) : 0; // X'

        const gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(scope.screenOrientation)
          : 0; // O

        setObjectQuaternion(
          scope.object.quaternion,
          alpha,
          beta,
          gamma,
          orient
        );

        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
      }
    };

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/location-based.js":
/*!**********************************************************!*\
  !*** ./three.js/src/location-based/js/location-based.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocationBased": () => (/* binding */ LocationBased)
/* harmony export */ });
/* harmony import */ var _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sphmerc-projection.js */ "./three.js/src/location-based/js/sphmerc-projection.js");


class LocationBased {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._proj = new _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__.SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 0;
    this._gpsMinAccuracy = 1000;
    this._watchPositionId = null;
    this.setGpsOptions(options);
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
  }

  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge,
        }
      );
      return true;
    }
    return false;
  }

  stopGps() {
    if (this._watchPositionId !== null) {
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    this.setWorldPosition(object, lon, lat, elev);
    this._scene.add(object);
  }

  setWorldPosition(object, lon, lat, elev) {
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    [object.position.x, object.position.z] = worldCoords;
    if (elev !== undefined) {
      object.position.y = elev;
    }
  }

  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  _gpsReceived(position) {
    let distMoved = Number.MAX_VALUE;
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if (distMoved >= this._gpsMinDistance) {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;

        this.setWorldPosition(
          this._camera,
          position.coords.longitude,
          position.coords.latitude
        );
        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        }
      }
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
    const dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    const dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.Math.degToRad(src.latitude)) *
        Math.cos(THREE.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/sphmerc-projection.js":
/*!**************************************************************!*\
  !*** ./three.js/src/location-based/js/sphmerc-projection.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SphMercProjection": () => (/* binding */ SphMercProjection)
/* harmony export */ });
class SphMercProjection {
  constructor() {
    this.EARTH = 40075016.68;
    this.HALF_EARTH = 20037508.34;
  }

  project(lon, lat) {
    return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
  }

  unproject(projected) {
    return [this.sphMercToLon(projected[0]), this.sphMercToLat(projected[1])];
  }

  lonToSphMerc(lon) {
    return (lon / 180) * this.HALF_EARTH;
  }

  latToSphMerc(lat) {
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    return (y * this.HALF_EARTH) / 180.0;
  }

  sphMercToLon(x) {
    return (x / this.HALF_EARTH) * 180.0;
  }

  sphMercToLat(y) {
    var lat = (y / this.HALF_EARTH) * 180.0;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return lat;
  }

  getID() {
    return "epsg:3857";
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/webcam-renderer.js":
/*!***********************************************************!*\
  !*** ./three.js/src/location-based/js/webcam-renderer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebcamRenderer": () => (/* binding */ WebcamRenderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);


class WebcamRenderer {
  constructor(renderer, videoElement) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
    let video;
    if (videoElement === undefined) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElement);
    }
    this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry();
    this.texture = new three__WEBPACK_IMPORTED_MODULE_0__.VideoTexture(video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: 1280,
          height: 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          alert(`Webcam error: ${e}`);
        });
    } else {
      alert("sorry - media devices API not supported");
    }
  }

  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }
}




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
/*!**********************************************!*\
  !*** ./three.js/src/location-based/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls),
/* harmony export */   "LocationBased": () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   "WebcamRenderer": () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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eUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnVEO0FBQ0U7QUFDdUI7O0FBRVoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2xvY2F0aW9uLWJhc2VkLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9zcGhtZXJjLXByb2plY3Rpb24uanMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3dlYmNhbS1yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9USFJFRXgvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiVEhSRUV4XCJdID0gZmFjdG9yeShyb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsIi8vIE1vZGlmaWVkIHZlcnNpb24gb2YgVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tIHRocmVlLmpzXG4vLyB3aWxsIHVzZSB0aGUgZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSBldmVudCBpZiBhdmFpbGFibGVcblxuaW1wb3J0IHtcbiAgRXVsZXIsXG4gIEV2ZW50RGlzcGF0Y2hlcixcbiAgTWF0aCBhcyBNYXRoVXRpbHMsXG4gIFF1YXRlcm5pb24sXG4gIFZlY3RvcjMsXG59IGZyb20gXCJ0aHJlZVwiO1xuXG5jb25zdCBfemVlID0gbmV3IFZlY3RvcjMoMCwgMCwgMSk7XG5jb25zdCBfZXVsZXIgPSBuZXcgRXVsZXIoKTtcbmNvbnN0IF9xMCA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5jb25zdCBfcTEgPSBuZXcgUXVhdGVybmlvbigtTWF0aC5zcXJ0KDAuNSksIDAsIDAsIE1hdGguc3FydCgwLjUpKTsgLy8gLSBQSS8yIGFyb3VuZCB0aGUgeC1heGlzXG5cbmNvbnN0IF9jaGFuZ2VFdmVudCA9IHsgdHlwZTogXCJjaGFuZ2VcIiB9O1xuXG5jbGFzcyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iob2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIHNlY3VyZSBjb250ZXh0cyAoaHR0cHMpXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuXG4gICAgY29uc3QgRVBTID0gMC4wMDAwMDE7XG4gICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcblxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gICAgdGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cbiAgICB0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xuXG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XG4gICAgICBcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvd1xuICAgICAgICA/IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuXG4gICAgY29uc3Qgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuICAgIH07XG5cbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIGFscGhhLFxuICAgICAgYmV0YSxcbiAgICAgIGdhbW1hLFxuICAgICAgb3JpZW50XG4gICAgKSB7XG4gICAgICBfZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMSk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTAuc2V0RnJvbUF4aXNBbmdsZShfemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cbiAgICAgIC8vIGlPUyAxMytcblxuICAgICAgaWYgKFxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IFVuYWJsZSB0byB1c2UgRGV2aWNlT3JpZW50YXRpb24gQVBJOlwiLFxuICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcbiAgICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcbiAgICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXG4gICAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudFxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICB0aGlzLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLFxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcbiAgICAgICk7XG5cbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICAgIGlmIChkZXZpY2UpIHtcbiAgICAgICAgY29uc3QgYWxwaGEgPSBkZXZpY2UuYWxwaGFcbiAgICAgICAgICA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYWxwaGEpICsgc2NvcGUuYWxwaGFPZmZzZXRcbiAgICAgICAgICA6IDA7IC8vIFpcblxuICAgICAgICBjb25zdCBiZXRhID0gZGV2aWNlLmJldGEgPyBNYXRoVXRpbHMuZGVnVG9SYWQoZGV2aWNlLmJldGEpIDogMDsgLy8gWCdcblxuICAgICAgICBjb25zdCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXG5cbiAgICAgICAgY29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgICA/IE1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcbiAgICAgICAgICA6IDA7IC8vIE9cblxuICAgICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxuICAgICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICAgIGFscGhhLFxuICAgICAgICAgIGJldGEsXG4gICAgICAgICAgZ2FtbWEsXG4gICAgICAgICAgb3JpZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKDggKiAoMSAtIGxhc3RRdWF0ZXJuaW9uLmRvdChzY29wZS5vYmplY3QucXVhdGVybmlvbikpID4gRVBTKSB7XG4gICAgICAgICAgbGFzdFF1YXRlcm5pb24uY29weShzY29wZS5vYmplY3QucXVhdGVybmlvbik7XG4gICAgICAgICAgc2NvcGUuZGlzcGF0Y2hFdmVudChfY2hhbmdlRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNjb3BlLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB9O1xuIiwiaW1wb3J0IHsgU3BoTWVyY1Byb2plY3Rpb24gfSBmcm9tIFwiLi9zcGhtZXJjLXByb2plY3Rpb24uanNcIjtcblxuY2xhc3MgTG9jYXRpb25CYXNlZCB7XG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xuICAgIHRoaXMuX3Byb2ogPSBuZXcgU3BoTWVyY1Byb2plY3Rpb24oKTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXJzID0ge307XG4gICAgdGhpcy5fbGFzdENvb3JkcyA9IG51bGw7XG4gICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSAwO1xuICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gMTAwMDtcbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgIHRoaXMuc2V0R3BzT3B0aW9ucyhvcHRpb25zKTtcbiAgfVxuXG4gIHNldFByb2plY3Rpb24ocHJvaikge1xuICAgIHRoaXMuX3Byb2ogPSBwcm9qO1xuICB9XG5cbiAgc2V0R3BzT3B0aW9ucyhvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy5ncHNNaW5EaXN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IG9wdGlvbnMuZ3BzTWluRGlzdGFuY2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmdwc01pbkFjY3VyYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gb3B0aW9ucy5ncHNNaW5BY2N1cmFjeTtcbiAgICB9XG4gIH1cblxuICBzdGFydEdwcyhtYXhpbXVtQWdlID0gMCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKFxuICAgICAgICAocG9zaXRpb24pID0+IHtcbiAgICAgICAgICB0aGlzLl9ncHNSZWNlaXZlZChwb3NpdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzZXJyb3JcIl0pIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXShlcnJvci5jb2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoYEdQUyBlcnJvcjogY29kZSAke2Vycm9yLmNvZGV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgIG1heGltdW1BZ2U6IG1heGltdW1BZ2UsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RvcEdwcygpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmYWtlR3BzKGxvbiwgbGF0LCBlbGV2ID0gbnVsbCwgYWNjID0gMCkge1xuICAgIGlmIChlbGV2ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldEVsZXZhdGlvbihlbGV2KTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncHNSZWNlaXZlZCh7XG4gICAgICBjb29yZHM6IHtcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXG4gICAgICAgIGxhdGl0dWRlOiBsYXQsXG4gICAgICAgIGFjY3VyYWN5OiBhY2MsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgIGNvbnN0IHByb2plY3RlZFBvcyA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgcmV0dXJuIFtwcm9qZWN0ZWRQb3NbMF0sIC1wcm9qZWN0ZWRQb3NbMV1dO1xuICB9XG5cbiAgYWRkKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgdGhpcy5fc2NlbmUuYWRkKG9iamVjdCk7XG4gIH1cblxuICBzZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcbiAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgW29iamVjdC5wb3NpdGlvbi54LCBvYmplY3QucG9zaXRpb24uel0gPSB3b3JsZENvb3JkcztcbiAgICBpZiAoZWxldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYmplY3QucG9zaXRpb24ueSA9IGVsZXY7XG4gICAgfVxuICB9XG5cbiAgc2V0RWxldmF0aW9uKGVsZXYpIHtcbiAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24ueSA9IGVsZXY7XG4gIH1cblxuICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IGV2ZW50SGFuZGxlcjtcbiAgfVxuXG4gIF9ncHNSZWNlaXZlZChwb3NpdGlvbikge1xuICAgIGxldCBkaXN0TW92ZWQgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGlmIChwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5fZ3BzTWluQWNjdXJhY3kpIHtcbiAgICAgIGlmICh0aGlzLl9sYXN0Q29vcmRzID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMgPSB7XG4gICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHRoaXMuX2xhc3RDb29yZHMsIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9XG4gICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuX2dwc01pbkRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcblxuICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24oXG4gICAgICAgICAgdGhpcy5fY2FtZXJhLFxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc3VwZGF0ZVwiXShwb3NpdGlvbiwgZGlzdE1vdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXG4gICAqXG4gICAqIFRha2VuIGZyb20gb3JpZ2luYWwgQS1GcmFtZSBjb21wb25lbnRzXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdChzcmMsIGRlc3QpIHtcbiAgICBjb25zdCBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGRsYXRpdHVkZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICBjb25zdCBhID1cbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXG4gICAgICAgIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICpcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH1cbn1cblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCB9O1xuIiwiY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7XG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG4gIH1cblxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XG4gICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgfVxuXG4gIHVucHJvamVjdChwcm9qZWN0ZWQpIHtcbiAgICByZXR1cm4gW3RoaXMuc3BoTWVyY1RvTG9uKHByb2plY3RlZFswXSksIHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICB9XG5cbiAgbG9uVG9TcGhNZXJjKGxvbikge1xuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcbiAgfVxuXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcbiAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCgoOTAgKyBsYXQpICogTWF0aC5QSSkgLyAzNjApKSAvIChNYXRoLlBJIC8gMTgwKTtcbiAgICByZXR1cm4gKHkgKiB0aGlzLkhBTEZfRUFSVEgpIC8gMTgwLjA7XG4gIH1cblxuICBzcGhNZXJjVG9Mb24oeCkge1xuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgfVxuXG4gIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgdmFyIGxhdCA9ICh5IC8gdGhpcy5IQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgIGxhdCA9XG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxuICAgICAgKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoKGxhdCAqIE1hdGguUEkpIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XG4gICAgcmV0dXJuIGxhdDtcbiAgfVxuXG4gIGdldElEKCkge1xuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICB9XG59XG5cbmV4cG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcihyZW5kZXJlciwgdmlkZW9FbGVtZW50KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zY2VuZVdlYmNhbSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIGxldCB2aWRlbztcbiAgICBpZiAodmlkZW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICAgIHZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlkZW8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmlkZW9FbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTtcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZVdlYmNhbS5hZGQobWVzaCk7XG4gICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKFxuICAgICAgLTAuNSxcbiAgICAgIDAuNSxcbiAgICAgIDAuNSxcbiAgICAgIC0wLjUsXG4gICAgICAwLFxuICAgICAgMTBcbiAgICApO1xuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcbiAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgYWxlcnQoYFdlYmNhbSBlcnJvcjogJHtlfWApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lV2ViY2FtLCB0aGlzLmNhbWVyYVdlYmNhbSk7XG4gICAgdGhpcy5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5leHBvcnQgeyBXZWJjYW1SZW5kZXJlciB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2F0aW9uQmFzZWQgfSBmcm9tIFwiLi9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiO1xuaW1wb3J0IHsgV2ViY2FtUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy93ZWJjYW0tcmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfSBmcm9tIFwiLi9qcy9kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanNcIjtcblxuZXhwb3J0IHsgTG9jYXRpb25CYXNlZCwgV2ViY2FtUmVuZGVyZXIsIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==