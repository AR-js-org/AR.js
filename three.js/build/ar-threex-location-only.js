(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["THREEx"] = factory(require("three"));
	else
		root["THREEx"] = factory(root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_three__) {
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



const _zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3( 0, 0, 1 );
const _euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();
const _q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();
const _q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

const _changeEvent = { type: 'change' };

class DeviceOrientationControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {

	constructor( object ) {

		super();

		if ( window.isSecureContext === false ) {

			console.error( 'THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)' );

		}

		const scope = this;

		const EPS = 0.000001;
		const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

		this.object = object;
		this.object.rotation.reorder( 'YXZ' );

		this.enabled = true;

		this.deviceOrientation = {};
		this.screenOrientation = 0;

		this.alphaOffset = 0; // radians

		this.orientationChangeEventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';

		const onDeviceOrientationChangeEvent = function ( event ) {

			scope.deviceOrientation = event;

		};

		const onScreenOrientationChangeEvent = function () {

			scope.screenOrientation = window.orientation || 0;

		};

		// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

		const setObjectQuaternion = function ( quaternion, alpha, beta, gamma, orient ) {

			_euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( _euler ); // orient the device

			quaternion.multiply( _q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( _q0.setFromAxisAngle( _zee, - orient ) ); // adjust for screen orientation

		};

		this.connect = function () {

			onScreenOrientationChangeEvent(); // run once on load

			// iOS 13+

			if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {

				window.DeviceOrientationEvent.requestPermission().then( function ( response ) {

					if ( response == 'granted' ) {

						window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent );
						window.addEventListener( this.orientationChangeEventName, onDeviceOrientationChangeEvent );

					}

				} ).catch( function ( error ) {

					console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );

				} );

			} else {

				window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent );
				window.addEventListener( this.orientationChangeEventName, onDeviceOrientationChangeEvent );

			}

			scope.enabled = true;

		};

		this.disconnect = function () {

			window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent );
			window.removeEventListener( this.orientationChangeEventName , onDeviceOrientationChangeEvent );

			scope.enabled = false;

		};

		this.update = function () {

			if ( scope.enabled === false ) return;

			const device = scope.deviceOrientation;

			if ( device ) {

				const alpha = device.alpha ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

				const beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad( device.beta ) : 0; // X'

				const gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad( device.gamma ) : 0; // Y''

				const orient = scope.screenOrientation ? three__WEBPACK_IMPORTED_MODULE_0__.MathUtils.degToRad( scope.screenOrientation ) : 0; // O

				setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

				if ( 8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					lastQuaternion.copy( scope.object.quaternion );
					scope.dispatchEvent( _changeEvent );

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

    constructor (scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.proj = new _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__.SphMercProjection();
    }

    setProjection(proj) {
        this.proj = proj;
    }

    startGps(maximumAge = 0) {
        this.watchPositionId = navigator.geolocation.watchPosition( 
            position => {
                this.setWorldPosition(
                    this.camera,
                    position.coords.longitude,
                    position.coords.latitude
                );
            }, error => {
                alert(`GPS listen error: code ${error}`);
            }, {
                enableHighAccuracy: true,
                maximumAge: maximumAge
            }
        );
    }

    stopGps() {
        if(this.watchPositionId) {
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.watchPositionId = null;
        }
    }    

    fakeGps(lon, lat, elev) {
        this.setWorldPosition(this.camera, lon, lat, elev);
    }

    lonLatToWorldCoords(lon, lat) {
        const projectedPos = this.proj.project(lon, lat);
        return [projectedPos[0], -projectedPos[1]];
    }

    add(object, lon, lat, elev) {
        this.setWorldPosition(object, lon, lat, elev);
        this.scene.add(object);
    }
    
    setWorldPosition(object, lon, lat, elev) {
        const worldCoords = this.lonLatToWorldCoords(lon, lat);
        [ object.position.x, object.position.z ] = worldCoords;
        if(elev !== undefined) {
            object.position.y = elev;
        }
    }

    setElevation(elev) {
        this.camera.position.y = elev;
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

class SphMercProjection  {
   
    constructor() {
        this.EARTH = 40075016.68; 
        this.HALF_EARTH = 20037508.34;
    } 

    project (lon, lat) {
        return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
    }
    
    unproject (projected) {
        return [this.sphMercToLon(projected[0]),this.sphMercToLat(projected[1])];
    }
    
    lonToSphMerc( lon) {
        return (lon/180) * this.HALF_EARTH;
    }
    
    latToSphMerc(lat) {
        var y = Math.log(Math.tan((90+lat)*Math.PI/360)) / (Math.PI/180);
        return y*this.HALF_EARTH/180.0;
    }
    
    sphMercToLon(x) {
            return (x/this.HALF_EARTH) * 180.0;
    }
    
    sphMercToLat(y) {
        var lat = (y/this.HALF_EARTH) * 180.0;
        lat = 180/Math.PI * (2*Math.atan(Math.exp(lat*Math.PI/180)) - Math.PI/2);
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
        const video = document.querySelector(videoElement);
        this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry(); 
        this.texture = new three__WEBPACK_IMPORTED_MODULE_0__.VideoTexture(video);
        this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial( { map: this.texture } );
        const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.geom, this.material);
        this.sceneWebcam.add(mesh);
        this.cameraWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = { 
                video: {
                    width: 1280,
                    height: 720,
                    facingMode: 'environment' 
                }
            };
            navigator.mediaDevices.getUserMedia(constraints).then( stream=> {
                console.log(`using the webcam successfully...`);
                video.srcObject = stream;    
                video.play();
            })
            .catch(e => { alert(`Webcam error: ${e}`); });
        } else {
            alert('sorry - media devices API not supported');
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
/* harmony export */   "LocationBased": () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   "WebcamRenderer": () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer),
/* harmony export */   "DeviceOrientationControls": () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7QUM5QzFCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051RDtBQUNFO0FBQ3VCOztBQU05RSIsInNvdXJjZXMiOlsid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzIiwid2VicGFjazovL1RIUkVFeC9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRIUkVFeFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pIHtcbnJldHVybiAiLCIvLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xuLy8gd2lsbCB1c2UgdGhlIGRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUgZXZlbnQgaWYgYXZhaWxhYmxlXG5cbmltcG9ydCB7XG5cdEV1bGVyLFxuXHRFdmVudERpc3BhdGNoZXIsXG5cdE1hdGhVdGlscyxcblx0UXVhdGVybmlvbixcblx0VmVjdG9yM1xufSBmcm9tICd0aHJlZSc7XG5cbmNvbnN0IF96ZWUgPSBuZXcgVmVjdG9yMyggMCwgMCwgMSApO1xuY29uc3QgX2V1bGVyID0gbmV3IEV1bGVyKCk7XG5jb25zdCBfcTAgPSBuZXcgUXVhdGVybmlvbigpO1xuY29uc3QgX3ExID0gbmV3IFF1YXRlcm5pb24oIC0gTWF0aC5zcXJ0KCAwLjUgKSwgMCwgMCwgTWF0aC5zcXJ0KCAwLjUgKSApOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcblxuY29uc3QgX2NoYW5nZUV2ZW50ID0geyB0eXBlOiAnY2hhbmdlJyB9O1xuXG5jbGFzcyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcblxuXHRjb25zdHJ1Y3Rvciggb2JqZWN0ICkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdGlmICggd2luZG93LmlzU2VjdXJlQ29udGV4dCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIHNlY3VyZSBjb250ZXh0cyAoaHR0cHMpJyApO1xuXG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2NvcGUgPSB0aGlzO1xuXG5cdFx0Y29uc3QgRVBTID0gMC4wMDAwMDE7XG5cdFx0Y29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXG5cdFx0dGhpcy5vYmplY3QgPSBvYmplY3Q7XG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlciggJ1lYWicgKTtcblxuXHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0XHR0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG5cdFx0dGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cblx0XHR0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xuXG5cdFx0dGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9ICdvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnIGluIHdpbmRvdyA/ICdkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJyA6ICdkZXZpY2VvcmllbnRhdGlvbic7XG5cblx0XHRjb25zdCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG5cdFx0XHRzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuXG5cdFx0fTtcblxuXHRcdGNvbnN0IG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb24gfHwgMDtcblxuXHRcdH07XG5cblx0XHQvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cblx0XHRjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKCBxdWF0ZXJuaW9uLCBhbHBoYSwgYmV0YSwgZ2FtbWEsIG9yaWVudCApIHtcblxuXHRcdFx0X2V1bGVyLnNldCggYmV0YSwgYWxwaGEsIC0gZ2FtbWEsICdZWFonICk7IC8vICdaWFknIGZvciB0aGUgZGV2aWNlLCBidXQgJ1lYWicgZm9yIHVzXG5cblx0XHRcdHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKCBfZXVsZXIgKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcblxuXHRcdFx0cXVhdGVybmlvbi5tdWx0aXBseSggX3ExICk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuXHRcdFx0cXVhdGVybmlvbi5tdWx0aXBseSggX3EwLnNldEZyb21BeGlzQW5nbGUoIF96ZWUsIC0gb3JpZW50ICkgKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cblxuXHRcdH07XG5cblx0XHR0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpOyAvLyBydW4gb25jZSBvbiBsb2FkXG5cblx0XHRcdC8vIGlPUyAxMytcblxuXHRcdFx0aWYgKCB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJyApIHtcblxuXHRcdFx0XHR3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpLnRoZW4oIGZ1bmN0aW9uICggcmVzcG9uc2UgKSB7XG5cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlID09ICdncmFudGVkJyApIHtcblxuXHRcdFx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdvcmllbnRhdGlvbmNoYW5nZScsIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCApO1xuXHRcdFx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gKS5jYXRjaCggZnVuY3Rpb24gKCBlcnJvciApIHtcblxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTonLCBlcnJvciApO1xuXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ29yaWVudGF0aW9uY2hhbmdlJywgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ICk7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCB0aGlzLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lLCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRzY29wZS5lbmFibGVkID0gdHJ1ZTtcblxuXHRcdH07XG5cblx0XHR0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgKTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCB0aGlzLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lICwgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcblxuXHRcdH07XG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0aWYgKCBzY29wZS5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0Y29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cblx0XHRcdGlmICggZGV2aWNlICkge1xuXG5cdFx0XHRcdGNvbnN0IGFscGhhID0gZGV2aWNlLmFscGhhID8gTWF0aFV0aWxzLmRlZ1RvUmFkKCBkZXZpY2UuYWxwaGEgKSArIHNjb3BlLmFscGhhT2Zmc2V0IDogMDsgLy8gWlxuXG5cdFx0XHRcdGNvbnN0IGJldGEgPSBkZXZpY2UuYmV0YSA/IE1hdGhVdGlscy5kZWdUb1JhZCggZGV2aWNlLmJldGEgKSA6IDA7IC8vIFgnXG5cblx0XHRcdFx0Y29uc3QgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyBNYXRoVXRpbHMuZGVnVG9SYWQoIGRldmljZS5nYW1tYSApIDogMDsgLy8gWScnXG5cblx0XHRcdFx0Y29uc3Qgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPyBNYXRoVXRpbHMuZGVnVG9SYWQoIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uICkgOiAwOyAvLyBPXG5cblx0XHRcdFx0c2V0T2JqZWN0UXVhdGVybmlvbiggc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sIGFscGhhLCBiZXRhLCBnYW1tYSwgb3JpZW50ICk7XG5cblx0XHRcdFx0aWYgKCA4ICogKCAxIC0gbGFzdFF1YXRlcm5pb24uZG90KCBzY29wZS5vYmplY3QucXVhdGVybmlvbiApICkgPiBFUFMgKSB7XG5cblx0XHRcdFx0XHRsYXN0UXVhdGVybmlvbi5jb3B5KCBzY29wZS5vYmplY3QucXVhdGVybmlvbiApO1xuXHRcdFx0XHRcdHNjb3BlLmRpc3BhdGNoRXZlbnQoIF9jaGFuZ2VFdmVudCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fTtcblxuXHRcdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c2NvcGUuZGlzY29ubmVjdCgpO1xuXG5cdFx0fTtcblxuXHRcdHRoaXMuY29ubmVjdCgpO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIH07XG4iLCJpbXBvcnQgeyBTcGhNZXJjUHJvamVjdGlvbiB9IGZyb20gJy4vc3BobWVyYy1wcm9qZWN0aW9uLmpzJztcblxuY2xhc3MgTG9jYXRpb25CYXNlZCB7XG5cbiAgICBjb25zdHJ1Y3RvciAoc2NlbmUsIGNhbWVyYSkge1xuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuICAgICAgICB0aGlzLnByb2ogPSBuZXcgU3BoTWVyY1Byb2plY3Rpb24oKTtcbiAgICB9XG5cbiAgICBzZXRQcm9qZWN0aW9uKHByb2opIHtcbiAgICAgICAgdGhpcy5wcm9qID0gcHJvajtcbiAgICB9XG5cbiAgICBzdGFydEdwcyhtYXhpbXVtQWdlID0gMCkge1xuICAgICAgICB0aGlzLndhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKCBcbiAgICAgICAgICAgIHBvc2l0aW9uID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBHUFMgbGlzdGVuIGVycm9yOiBjb2RlICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgICAgICAgIG1heGltdW1BZ2U6IG1heGltdW1BZ2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdG9wR3BzKCkge1xuICAgICAgICBpZih0aGlzLndhdGNoUG9zaXRpb25JZCkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy53YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgICAgICAgdGhpcy53YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIGZha2VHcHMobG9uLCBsYXQsIGVsZXYpIHtcbiAgICAgICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKHRoaXMuY2FtZXJhLCBsb24sIGxhdCwgZWxldik7XG4gICAgfVxuXG4gICAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ZWRQb3MgPSB0aGlzLnByb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgICAgIHJldHVybiBbcHJvamVjdGVkUG9zWzBdLCAtcHJvamVjdGVkUG9zWzFdXTtcbiAgICB9XG5cbiAgICBhZGQob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG9iamVjdCk7XG4gICAgfVxuICAgIFxuICAgIHNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgICAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgICAgIFsgb2JqZWN0LnBvc2l0aW9uLngsIG9iamVjdC5wb3NpdGlvbi56IF0gPSB3b3JsZENvb3JkcztcbiAgICAgICAgaWYoZWxldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvYmplY3QucG9zaXRpb24ueSA9IGVsZXY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRFbGV2YXRpb24oZWxldikge1xuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gZWxldjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IExvY2F0aW9uQmFzZWQgfTtcbiIsIlxuY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24gIHtcbiAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7IFxuICAgICAgICB0aGlzLkhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcbiAgICB9IFxuXG4gICAgcHJvamVjdCAobG9uLCBsYXQpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgICB9XG4gICAgXG4gICAgdW5wcm9qZWN0IChwcm9qZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnNwaE1lcmNUb0xvbihwcm9qZWN0ZWRbMF0pLHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICAgIH1cbiAgICBcbiAgICBsb25Ub1NwaE1lcmMoIGxvbikge1xuICAgICAgICByZXR1cm4gKGxvbi8xODApICogdGhpcy5IQUxGX0VBUlRIO1xuICAgIH1cbiAgICBcbiAgICBsYXRUb1NwaE1lcmMobGF0KSB7XG4gICAgICAgIHZhciB5ID0gTWF0aC5sb2coTWF0aC50YW4oKDkwK2xhdCkqTWF0aC5QSS8zNjApKSAvIChNYXRoLlBJLzE4MCk7XG4gICAgICAgIHJldHVybiB5KnRoaXMuSEFMRl9FQVJUSC8xODAuMDtcbiAgICB9XG4gICAgXG4gICAgc3BoTWVyY1RvTG9uKHgpIHtcbiAgICAgICAgICAgIHJldHVybiAoeC90aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgfVxuICAgIFxuICAgIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgICAgIHZhciBsYXQgPSAoeS90aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgICAgIGxhdCA9IDE4MC9NYXRoLlBJICogKDIqTWF0aC5hdGFuKE1hdGguZXhwKGxhdCpNYXRoLlBJLzE4MCkpIC0gTWF0aC5QSS8yKTtcbiAgICAgICAgcmV0dXJuIGxhdDtcbiAgICB9XG4gICAgXG4gICAgZ2V0SUQoKSB7XG4gICAgICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU3BoTWVyY1Byb2plY3Rpb24gfTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyLCB2aWRlb0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjZW5lV2ViY2FtID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIGNvbnN0IHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2aWRlb0VsZW1lbnQpO1xuICAgICAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpOyBcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh2aWRlbyk7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgbWFwOiB0aGlzLnRleHR1cmUgfSApO1xuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5zY2VuZVdlYmNhbS5hZGQobWVzaCk7XG4gICAgICAgIHRoaXMuY2FtZXJhV2ViY2FtID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgICAgICBpZihuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHsgXG4gICAgICAgICAgICAgICAgdmlkZW86IHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEyODAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogNzIwLFxuICAgICAgICAgICAgICAgICAgICBmYWNpbmdNb2RlOiAnZW52aXJvbm1lbnQnIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbiggc3RyZWFtPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGB1c2luZyB0aGUgd2ViY2FtIHN1Y2Nlc3NmdWxseS4uLmApO1xuICAgICAgICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTsgICAgXG4gICAgICAgICAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHsgYWxlcnQoYFdlYmNhbSBlcnJvcjogJHtlfWApOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lV2ViY2FtLCB0aGlzLmNhbWVyYVdlYmNhbSk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuICAgIH1cblxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgV2ViY2FtUmVuZGVyZXIgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBMb2NhdGlvbkJhc2VkIH0gZnJvbSAnLi9qcy9sb2NhdGlvbi1iYXNlZC5qcyc7XG5pbXBvcnQgeyBXZWJjYW1SZW5kZXJlciB9IGZyb20gJy4vanMvd2ViY2FtLXJlbmRlcmVyLmpzJztcbmltcG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfSBmcm9tICcuL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyc7XG5cbmV4cG9ydCB7XG4gICAgTG9jYXRpb25CYXNlZCxcbiAgICBXZWJjYW1SZW5kZXJlcixcbiAgICBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzXG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9