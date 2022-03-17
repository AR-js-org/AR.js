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
        this.eventHandlers = { };
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
                if(this.eventHandlers["gpsupdate"]) {
                    this.eventHandlers["gpsupdate"](position);
                }    
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

    on(eventName, eventHandler) {
        this.eventHandlers[eventName] = eventHandler;
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
        let video;
        if(videoElement === undefined) {
            video = document.createElement("video");
            video.setAttribute("autoplay", true);
            video.setAttribute("playsinline", true);
            video.style.display = 'none';
            document.body.appendChild(video);
        } else {
            video = document.querySelector(videoElement);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTBCOzs7Ozs7Ozs7OztBQ3ZEMUI7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnVEO0FBQ0U7QUFDdUI7O0FBTTlFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy9sb2NhdGlvbi1iYXNlZC5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvc3BobWVyYy1wcm9qZWN0aW9uLmpzIiwid2VicGFjazovL1RIUkVFeC8uL3RocmVlLmpzL3NyYy9sb2NhdGlvbi1iYXNlZC9qcy93ZWJjYW0tcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4L2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1widGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVEhSRUV4XCJdID0gZmFjdG9yeShyZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlRIUkVFeFwiXSA9IGZhY3Rvcnkocm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykge1xucmV0dXJuICIsIi8vIE1vZGlmaWVkIHZlcnNpb24gb2YgVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tIHRocmVlLmpzXG4vLyB3aWxsIHVzZSB0aGUgZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSBldmVudCBpZiBhdmFpbGFibGVcblxuaW1wb3J0IHtcblx0RXVsZXIsXG5cdEV2ZW50RGlzcGF0Y2hlcixcblx0TWF0aFV0aWxzLFxuXHRRdWF0ZXJuaW9uLFxuXHRWZWN0b3IzXG59IGZyb20gJ3RocmVlJztcblxuY29uc3QgX3plZSA9IG5ldyBWZWN0b3IzKCAwLCAwLCAxICk7XG5jb25zdCBfZXVsZXIgPSBuZXcgRXVsZXIoKTtcbmNvbnN0IF9xMCA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5jb25zdCBfcTEgPSBuZXcgUXVhdGVybmlvbiggLSBNYXRoLnNxcnQoIDAuNSApLCAwLCAwLCBNYXRoLnNxcnQoIDAuNSApICk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG5jb25zdCBfY2hhbmdlRXZlbnQgPSB7IHR5cGU6ICdjaGFuZ2UnIH07XG5cbmNsYXNzIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuXG5cdGNvbnN0cnVjdG9yKCBvYmplY3QgKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0aWYgKCB3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSApIHtcblxuXHRcdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IERldmljZU9yaWVudGF0aW9uRXZlbnQgaXMgb25seSBhdmFpbGFibGUgaW4gc2VjdXJlIGNvbnRleHRzIChodHRwcyknICk7XG5cblx0XHR9XG5cblx0XHRjb25zdCBzY29wZSA9IHRoaXM7XG5cblx0XHRjb25zdCBFUFMgPSAwLjAwMDAwMTtcblx0XHRjb25zdCBsYXN0UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cblx0XHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0XHR0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKCAnWVhaJyApO1xuXG5cdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuXHRcdHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcblx0XHR0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuXHRcdHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cblx0XHR0aGlzLm9yaWVudGF0aW9uQ2hhbmdlRXZlbnROYW1lID0gJ29uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScgaW4gd2luZG93ID8gJ2RldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnIDogJ2RldmljZW9yaWVudGF0aW9uJztcblxuXHRcdGNvbnN0IG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cblx0XHRcdHNjb3BlLmRldmljZU9yaWVudGF0aW9uID0gZXZlbnQ7XG5cblx0XHR9O1xuXG5cdFx0Y29uc3Qgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuXG5cdFx0fTtcblxuXHRcdC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcblxuXHRcdGNvbnN0IHNldE9iamVjdFF1YXRlcm5pb24gPSBmdW5jdGlvbiAoIHF1YXRlcm5pb24sIGFscGhhLCBiZXRhLCBnYW1tYSwgb3JpZW50ICkge1xuXG5cdFx0XHRfZXVsZXIuc2V0KCBiZXRhLCBhbHBoYSwgLSBnYW1tYSwgJ1lYWicgKTsgLy8gJ1pYWScgZm9yIHRoZSBkZXZpY2UsIGJ1dCAnWVhaJyBmb3IgdXNcblxuXHRcdFx0cXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoIF9ldWxlciApOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG5cdFx0XHRxdWF0ZXJuaW9uLm11bHRpcGx5KCBfcTEgKTsgLy8gY2FtZXJhIGxvb2tzIG91dCB0aGUgYmFjayBvZiB0aGUgZGV2aWNlLCBub3QgdGhlIHRvcFxuXG5cdFx0XHRxdWF0ZXJuaW9uLm11bHRpcGx5KCBfcTAuc2V0RnJvbUF4aXNBbmdsZSggX3plZSwgLSBvcmllbnQgKSApOyAvLyBhZGp1c3QgZm9yIHNjcmVlbiBvcmllbnRhdGlvblxuXG5cdFx0fTtcblxuXHRcdHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0b25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50KCk7IC8vIHJ1biBvbmNlIG9uIGxvYWRcblxuXHRcdFx0Ly8gaU9TIDEzK1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nICkge1xuXG5cdFx0XHRcdHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCkudGhlbiggZnVuY3Rpb24gKCByZXNwb25zZSApIHtcblxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UgPT0gJ2dyYW50ZWQnICkge1xuXG5cdFx0XHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ29yaWVudGF0aW9uY2hhbmdlJywgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ICk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSwgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSApLmNhdGNoKCBmdW5jdGlvbiAoIGVycm9yICkge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHM6IFVuYWJsZSB0byB1c2UgRGV2aWNlT3JpZW50YXRpb24gQVBJOicsIGVycm9yICk7XG5cblx0XHRcdFx0fSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgKTtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUsIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHNjb3BlLmVuYWJsZWQgPSB0cnVlO1xuXG5cdFx0fTtcblxuXHRcdHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdvcmllbnRhdGlvbmNoYW5nZScsIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCApO1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIHRoaXMub3JpZW50YXRpb25DaGFuZ2VFdmVudE5hbWUgLCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0c2NvcGUuZW5hYmxlZCA9IGZhbHNlO1xuXG5cdFx0fTtcblxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRpZiAoIHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBkZXZpY2UgPSBzY29wZS5kZXZpY2VPcmllbnRhdGlvbjtcblxuXHRcdFx0aWYgKCBkZXZpY2UgKSB7XG5cblx0XHRcdFx0Y29uc3QgYWxwaGEgPSBkZXZpY2UuYWxwaGEgPyBNYXRoVXRpbHMuZGVnVG9SYWQoIGRldmljZS5hbHBoYSApICsgc2NvcGUuYWxwaGFPZmZzZXQgOiAwOyAvLyBaXG5cblx0XHRcdFx0Y29uc3QgYmV0YSA9IGRldmljZS5iZXRhID8gTWF0aFV0aWxzLmRlZ1RvUmFkKCBkZXZpY2UuYmV0YSApIDogMDsgLy8gWCdcblxuXHRcdFx0XHRjb25zdCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IE1hdGhVdGlscy5kZWdUb1JhZCggZGV2aWNlLmdhbW1hICkgOiAwOyAvLyBZJydcblxuXHRcdFx0XHRjb25zdCBvcmllbnQgPSBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA/IE1hdGhVdGlscy5kZWdUb1JhZCggc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gKSA6IDA7IC8vIE9cblxuXHRcdFx0XHRzZXRPYmplY3RRdWF0ZXJuaW9uKCBzY29wZS5vYmplY3QucXVhdGVybmlvbiwgYWxwaGEsIGJldGEsIGdhbW1hLCBvcmllbnQgKTtcblxuXHRcdFx0XHRpZiAoIDggKiAoIDEgLSBsYXN0UXVhdGVybmlvbi5kb3QoIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uICkgKSA+IEVQUyApIHtcblxuXHRcdFx0XHRcdGxhc3RRdWF0ZXJuaW9uLmNvcHkoIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uICk7XG5cdFx0XHRcdFx0c2NvcGUuZGlzcGF0Y2hFdmVudCggX2NoYW5nZUV2ZW50ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRzY29wZS5kaXNjb25uZWN0KCk7XG5cblx0XHR9O1xuXG5cdFx0dGhpcy5jb25uZWN0KCk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcbiIsImltcG9ydCB7IFNwaE1lcmNQcm9qZWN0aW9uIH0gZnJvbSAnLi9zcGhtZXJjLXByb2plY3Rpb24uanMnO1xuXG5jbGFzcyBMb2NhdGlvbkJhc2VkIHtcblxuICAgIGNvbnN0cnVjdG9yIChzY2VuZSwgY2FtZXJhKSB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBjYW1lcmE7XG4gICAgICAgIHRoaXMucHJvaiA9IG5ldyBTcGhNZXJjUHJvamVjdGlvbigpO1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnMgPSB7IH07XG4gICAgfVxuXG4gICAgc2V0UHJvamVjdGlvbihwcm9qKSB7XG4gICAgICAgIHRoaXMucHJvaiA9IHByb2o7XG4gICAgfVxuXG4gICAgc3RhcnRHcHMobWF4aW11bUFnZSA9IDApIHtcbiAgICAgICAgdGhpcy53YXRjaFBvc2l0aW9uSWQgPSBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbiggXG4gICAgICAgICAgICBwb3NpdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmV2ZW50SGFuZGxlcnNbXCJncHN1cGRhdGVcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBHUFMgbGlzdGVuIGVycm9yOiBjb2RlICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgICAgICAgIG1heGltdW1BZ2U6IG1heGltdW1BZ2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdG9wR3BzKCkge1xuICAgICAgICBpZih0aGlzLndhdGNoUG9zaXRpb25JZCkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy53YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgICAgICAgdGhpcy53YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSAgICBcblxuICAgIGZha2VHcHMobG9uLCBsYXQsIGVsZXYpIHtcbiAgICAgICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKHRoaXMuY2FtZXJhLCBsb24sIGxhdCwgZWxldik7XG4gICAgfVxuXG4gICAgbG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ZWRQb3MgPSB0aGlzLnByb2oucHJvamVjdChsb24sIGxhdCk7XG4gICAgICAgIHJldHVybiBbcHJvamVjdGVkUG9zWzBdLCAtcHJvamVjdGVkUG9zWzFdXTtcbiAgICB9XG5cbiAgICBhZGQob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgICAgICB0aGlzLnNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG9iamVjdCk7XG4gICAgfVxuICAgIFxuICAgIHNldFdvcmxkUG9zaXRpb24ob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xuICAgICAgICBjb25zdCB3b3JsZENvb3JkcyA9IHRoaXMubG9uTGF0VG9Xb3JsZENvb3Jkcyhsb24sIGxhdCk7XG4gICAgICAgIFsgb2JqZWN0LnBvc2l0aW9uLngsIG9iamVjdC5wb3NpdGlvbi56IF0gPSB3b3JsZENvb3JkcztcbiAgICAgICAgaWYoZWxldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvYmplY3QucG9zaXRpb24ueSA9IGVsZXY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRFbGV2YXRpb24oZWxldikge1xuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gZWxldjtcbiAgICB9XG5cbiAgICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IGV2ZW50SGFuZGxlcjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IExvY2F0aW9uQmFzZWQgfTtcbiIsIlxuY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24gIHtcbiAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVBUlRIID0gNDAwNzUwMTYuNjg7IFxuICAgICAgICB0aGlzLkhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcbiAgICB9IFxuXG4gICAgcHJvamVjdCAobG9uLCBsYXQpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmxvblRvU3BoTWVyYyhsb24pLCB0aGlzLmxhdFRvU3BoTWVyYyhsYXQpXTtcbiAgICB9XG4gICAgXG4gICAgdW5wcm9qZWN0IChwcm9qZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnNwaE1lcmNUb0xvbihwcm9qZWN0ZWRbMF0pLHRoaXMuc3BoTWVyY1RvTGF0KHByb2plY3RlZFsxXSldO1xuICAgIH1cbiAgICBcbiAgICBsb25Ub1NwaE1lcmMoIGxvbikge1xuICAgICAgICByZXR1cm4gKGxvbi8xODApICogdGhpcy5IQUxGX0VBUlRIO1xuICAgIH1cbiAgICBcbiAgICBsYXRUb1NwaE1lcmMobGF0KSB7XG4gICAgICAgIHZhciB5ID0gTWF0aC5sb2coTWF0aC50YW4oKDkwK2xhdCkqTWF0aC5QSS8zNjApKSAvIChNYXRoLlBJLzE4MCk7XG4gICAgICAgIHJldHVybiB5KnRoaXMuSEFMRl9FQVJUSC8xODAuMDtcbiAgICB9XG4gICAgXG4gICAgc3BoTWVyY1RvTG9uKHgpIHtcbiAgICAgICAgICAgIHJldHVybiAoeC90aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgfVxuICAgIFxuICAgIHNwaE1lcmNUb0xhdCh5KSB7XG4gICAgICAgIHZhciBsYXQgPSAoeS90aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgICAgIGxhdCA9IDE4MC9NYXRoLlBJICogKDIqTWF0aC5hdGFuKE1hdGguZXhwKGxhdCpNYXRoLlBJLzE4MCkpIC0gTWF0aC5QSS8yKTtcbiAgICAgICAgcmV0dXJuIGxhdDtcbiAgICB9XG4gICAgXG4gICAgZ2V0SUQoKSB7XG4gICAgICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU3BoTWVyY1Byb2plY3Rpb24gfTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuY2xhc3MgV2ViY2FtUmVuZGVyZXIge1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyLCB2aWRlb0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjZW5lV2ViY2FtID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIGxldCB2aWRlbztcbiAgICAgICAgaWYodmlkZW9FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcbiAgICAgICAgICAgIHZpZGVvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZGVvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2aWRlb0VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7IFxuICAgICAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHZpZGVvKTtcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBtYXA6IHRoaXMudGV4dHVyZSB9ICk7XG4gICAgICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnNjZW5lV2ViY2FtLmFkZChtZXNoKTtcbiAgICAgICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKC0wLjUsIDAuNSwgMC41LCAtMC41LCAwLCAxMCk7XG4gICAgICAgIGlmKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0geyBcbiAgICAgICAgICAgICAgICB2aWRlbzoge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTI4MCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA3MjAsXG4gICAgICAgICAgICAgICAgICAgIGZhY2luZ01vZGU6ICdlbnZpcm9ubWVudCcgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKCBzdHJlYW09PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHVzaW5nIHRoZSB3ZWJjYW0gc3VjY2Vzc2Z1bGx5Li4uYCk7XG4gICAgICAgICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtOyAgICBcbiAgICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4geyBhbGVydChgV2ViY2FtIGVycm9yOiAke2V9YCk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ3NvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmVXZWJjYW0sIHRoaXMuY2FtZXJhV2ViY2FtKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gICAgfVxuXG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBXZWJjYW1SZW5kZXJlciB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2F0aW9uQmFzZWQgfSBmcm9tICcuL2pzL2xvY2F0aW9uLWJhc2VkLmpzJztcbmltcG9ydCB7IFdlYmNhbVJlbmRlcmVyIH0gZnJvbSAnLi9qcy93ZWJjYW0tcmVuZGVyZXIuanMnO1xuaW1wb3J0IHsgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB9IGZyb20gJy4vanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzJztcblxuZXhwb3J0IHtcbiAgICBMb2NhdGlvbkJhc2VkLFxuICAgIFdlYmNhbVJlbmRlcmVyLFxuICAgIERldmljZU9yaWVudGF0aW9uQ29udHJvbHNcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=