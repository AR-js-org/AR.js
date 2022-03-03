(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/ArjsDeviceOrientationControls.js":
/*!********************************************************************!*\
  !*** ./aframe/src/location-based/ArjsDeviceOrientationControls.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to 
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */



const ArjsDeviceOrientationControls = function ( object ) {

  var scope = this;

  this.object = object;
  this.object.rotation.reorder( 'YXZ' );

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function ( event ) {

    scope.deviceOrientation = event;

  };

  var onScreenOrientationChangeEvent = function () {

    scope.screenOrientation = window.orientation || 0;

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function () {

    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3( 0, 0, 1 );

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {

      euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler ); // orient the device

      quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

      quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

    };

  }();

  this.connect = function () {
 
    onScreenOrientationChangeEvent();

    window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = true;

  };

  this.disconnect = function () {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;

  };

  this.update = function () {

    if ( scope.enabled === false ) return;

    var device = scope.deviceOrientation;

    if ( device ) {

      var alpha = device.alpha ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.beta ) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.gamma ) : 0; // Y''

      var orient = scope.screenOrientation ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( scope.screenOrientation ) : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if(this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
        beta = this._getSmoothedAngle(beta + Math.PI, this.lastOrientation.beta, k);
        gamma = this._getSmoothedAngle(gamma + this.HALF_PI, this.lastOrientation.gamma, k, Math.PI);
    
      } else {
        beta += Math.PI;
        gamma += this.HALF_PI;
      }

      this.lastOrientation = {
        alpha: alpha,
        beta: beta,
        gamma: gamma
      };
      setObjectQuaternion( scope.object.quaternion, alpha, beta - Math.PI, gamma - this.HALF_PI, orient );

    }
  };

   
   // NW Added
  this._orderAngle = function(a, b, range = this.TWO_PI) {
    if ((b > a && Math.abs(b - a) < range / 2) || (a > b && Math.abs(b - a) > range / 2)) {
      return { left: a, right: b }
    } else { 
      return { left: b, right: a }
    }
  };

   // NW Added
  this._getSmoothedAngle = function(a, b, k, range = this.TWO_PI) {
    const angles = this._orderAngle(a, b, range);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if(angles.right < 0) angles.right += range;
    let newangle = origAnglesRight == b ? (1 - k)*angles.right + k * angles.left : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if(newangle >= range) newangle -= range;
    return newangle;
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArjsDeviceOrientationControls);


/***/ }),

/***/ "./aframe/src/location-based/arjs-look-controls.js":
/*!*********************************************************!*\
  !*** ./aframe/src/location-based/arjs-look-controls.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;


/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

/* NOTE that this is a modified version of A-Frame's look-controls to 
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('arjs-look-controls', {
  dependencies: ['position', 'rotation'],

  schema: {
    enabled: {default: true},
    magicWindowTrackingEnabled: {default: true},
    pointerLockEnabled: {default: false},
    reverseMouseDrag: {default: false},
    reverseTouchDrag: {default: false},
    touchEnabled: {default: true},
    smoothingFactor: { type: 'number', default: 1 }
  },

  init: function () {
    this.deltaYaw = 0;
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.magicWindowAbsoluteEuler = new THREE.Euler();
    this.magicWindowDeltaEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    this.magicWindowObject = new THREE.Object3D();
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();
    this.previousMouseEvent = {};

    this.setupMagicWindowControls();

    // To save / restore camera pose
    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is('vr-mode')) { this.onEnterVR(); }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls = new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__["default"](this.magicWindowObject);
      if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
        magicWindowControls.enabled = false;
        if (this.el.sceneEl.components['device-orientation-permission-ui'].permissionGranted) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener('deviceorientationpermissiongranted', function () {
            magicWindowControls.enabled = data.magicWindowTrackingEnabled;
          });
        }
      }
    }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset magic window eulers if tracking is disabled.
    if (oldData && !data.magicWindowTrackingEnabled && oldData.magicWindowTrackingEnabled) {
      this.magicWindowAbsoluteEuler.set(0, 0, 0);
      this.magicWindowDeltaEuler.set(0, 0, 0);
    }

    // Pass on magic window tracking setting to magicWindowControls.
    if (this.magicWindowControls) {
      this.magicWindowControls.enabled = data.magicWindowTrackingEnabled;
      this.magicWindowControls.smoothingFactor = data.smoothingFactor;
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) { this.exitPointerLock(); }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) { return; }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) { this.exitPointerLock(); }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) { this.exitPointerLock(); }
  },

  bindMethods: function () {
    this.onMouseDown = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseDown, this);
    this.onMouseMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseMove, this);
    this.onMouseUp = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseUp, this);
    this.onTouchStart = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchStart, this);
    this.onTouchMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onEnterVR, this);
    this.onExitVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockChange, this);
    this.onPointerLockError = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockError, this);
  },

 /**
  * Set up states and Object3Ds needed to store rotation data.
  */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this));
      return;
    }

    // Mouse events.
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener('enter-vr', this.onEnterVR);
    sceneEl.addEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener('pointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('mozpointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('pointerlockerror', this.onPointerLockError, false);
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) { return; }

    // Mouse events.
    canvasEl.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener('enter-vr', this.onEnterVR);
    sceneEl.removeEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener('pointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('mozpointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('pointerlockerror', this.onPointerLockError, false);
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: (function () {
    var poseMatrix = new THREE.Matrix4();

    return function () {
      var object3D = this.el.object3D;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var pose;
      var sceneEl = this.el.sceneEl;

      // In VR mode, THREE is in charge of updating the camera pose.
      if (sceneEl.is('vr-mode') && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(object3D.position, object3D.rotation, object3D.scale);
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x = this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
      object3D.rotation.y = this.magicWindowDeltaEuler.y + yawObject.rotation.y;
      object3D.rotation.z = this.magicWindowDeltaEuler.z;
    };
  })(),

  updateMagicWindowOrientation: function () {
    var magicWindowAbsoluteEuler = this.magicWindowAbsoluteEuler;
    var magicWindowDeltaEuler = this.magicWindowDeltaEuler;
    // Calculate magic window HMD quaternion.
    if (this.magicWindowControls && this.magicWindowControls.enabled) {
      this.magicWindowControls.update();
      magicWindowAbsoluteEuler.setFromQuaternion(this.magicWindowObject.quaternion, 'YXZ');
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y += magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
        magicWindowDeltaEuler.z = magicWindowAbsoluteEuler.z;
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
    }
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (evt) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) { return; }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = evt.movementX || evt.mozMovementX || 0;
      movementY = evt.movementY || evt.mozMovementY || 0;
    } else {
      movementX = evt.screenX - previousMouseEvent.screenX;
      movementY = evt.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (!this.data.enabled || (sceneEl.is('vr-mode') && sceneEl.checkHeadsetConnected())) { return; }
    // Handle only primary button.
    if (evt.button !== 0) { return; }

    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;
    this.showGrabbingCursor();

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Shows grabbing cursor on scene
   */
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = 'grabbing';
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = '';
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    this.hideGrabbingCursor();
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (evt.touches.length !== 1 ||
        !this.data.touchEnabled ||
        this.el.sceneEl.is('vr-mode')) { return; }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to Y-axis rotation.
   */
  onTouchMove: function (evt) {
    var direction;
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) { return; }

    deltaY = 2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x) / canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY
    };
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    var sceneEl = this.el.sceneEl;
    if (!sceneEl.checkHeadsetConnected()) { return; }
    this.saveCameraPose();
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    if (sceneEl.hasWebXR) {
      this.el.object3D.matrixAutoUpdate = false;
      this.el.object3D.updateMatrix();
    }
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    if (!this.el.sceneEl.checkHeadsetConnected()) { return; }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(document.pointerLockElement || document.mozPointerLockElement);
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  // Exits pointer-locked mode.
  exitPointerLock: function () {
    document.exitPointerLock();
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor () { sceneEl.canvas.classList.add('a-grab-cursor'); }
    function disableGrabCursor () { sceneEl.canvas.classList.remove('a-grab-cursor'); }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
      } else {
        sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;

    if (!this.hasSavedPose) { return; }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  }
});


/***/ }),

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



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('arjs-webcam-texture', {

    init: function() {
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
        this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial( { map: this.texture } );
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
        this.texScene.add(mesh);
    },

    play: function() {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = { video: {
                facingMode: 'environment' }
            };
            navigator.mediaDevices.getUserMedia(constraints).then( stream=> {
                this.video.srcObject = stream;    
                this.video.play();
            })
            .catch(e => {  
                this.el.sceneEl.systems['arjs']._displayErrorPopup(`Webcam error: ${e}`);
            });
        } else {
            this.el.sceneEl.systems['arjs']._displayErrorPopup('sorry - media devices API not supported');
        }
    },

    tick: function() {
        this.scene.renderer.clear();
        this.scene.renderer.render(this.texScene, this.texCamera);
        this.scene.renderer.clearDepth();
    },

    pause: function() {
        this.video.srcObject.getTracks().forEach ( track => {
            track.stop();
        });
    },

    remove: function() {
        this.material.dispose();
        this.texture.dispose();
        this.geom.dispose();
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-camera.js":
/*!*************************************************!*\
  !*** ./aframe/src/location-based/gps-camera.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-camera', {
    _watchPositionId: null,
    originCoords: null,
    currentCoords: null,
    lookControls: null,
    heading: null,
    schema: {
        simulateLatitude: {
            type: 'number',
            default: 0,
        },
        simulateLongitude: {
            type: 'number',
            default: 0,
        },
        simulateAltitude: {
            type: 'number',
            default: 0,
        },
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        },
        maxDistance: {
            type: 'int',
            default: 0,
        },
        gpsMinDistance: {
            type: 'number',
            default: 5,
        },
        gpsTimeInterval: {
            type: 'number',
            default: 0,
        },
    },
    update: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.longitude = this.data.simulateLongitude;
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.altitude = this.data.simulateAltitude;
            this.currentCoords = localPosition;

            // re-trigger initialization for new origin
            this.originCoords = null;
            this._updatePosition();
        }
    },
    init: function () {      
        if (!this.el.components['arjs-look-controls'] && !this.el.components['look-controls']) {
            return;
        }

        this.lastPosition = {
            latitude: 0,
            longitude: 0
        };

        this.loader = document.createElement('DIV');
        this.loader.classList.add('arjs-loader');
        document.body.appendChild(this.loader);

        this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
        window.addEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);

        this.lookControls = this.el.components['arjs-look-controls'] || this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        // if Safari
        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            // iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function () {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };

                document.addEventListener('touchend', function () { handler() }, false);

                this.el.sceneEl.systems['arjs']._displayErrorPopup( 'After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function () {
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Please enable device orientation in Settings > Safari > Motion & Orientation Access.');
                }, 750);
                window.addEventListener(eventName, function () {
                    clearTimeout(timeout);
                });
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);

    },

    play: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.longitude = this.data.simulateLongitude;
            if (this.data.simulateAltitude !== 0) {
                localPosition.altitude = this.data.simulateAltitude;
            }
            this.currentCoords = localPosition;
            this._updatePosition();
        } else {
            this._watchPositionId = this._initWatchGPS(function (position) {
                var localPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    altitude: position.coords.altitude,
                    accuracy: position.coords.accuracy,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                };
          
                if (this.data.simulateAltitude !== 0) {
                    localPosition.altitude = this.data.simulateAltitude;
                }
               
                this.currentCoords = localPosition;
                var distMoved = this._haversineDist(
                    this.lastPosition,
                    this.currentCoords
                );

                if(distMoved >= this.data.gpsMinDistance || !this.originCoords) {
                    this._updatePosition();
                    this.lastPosition = {
                        longitude: this.currentCoords.longitude,
                        latitude: this.currentCoords.latitude
                    };
                }
            }.bind(this));
        }
    },

    tick: function () {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    pause: function() {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;
    },

    remove: function () {

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);

        window.removeEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function () {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
    _initWatchGPS: function (onSuccess, onError) {
        if (!onError) {
            onError = function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: this.data.gpsTimeInterval,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     *
     * @returns {void}
     */
    _updatePosition: function () {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }

        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        if (!this.originCoords) {
            // first camera initialization
            this.originCoords = this.currentCoords;
            this._setPosition();

            var loader = document.querySelector('.arjs-loader');
            if (loader) {
                loader.remove();
            }
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        } else {
            this._setPosition();
        }
    },
    _setPosition: function () {
        var position = this.el.getAttribute('position');

        // compute position.x
        var dstCoords = {
            longitude: this.currentCoords.longitude,
            latitude: this.originCoords.latitude,
        };

        position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

        // compute position.z
        var dstCoords = {
            longitude: this.originCoords.longitude,
            latitude: this.currentCoords.latitude,
        }

        position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

        // update position
        this.el.setAttribute('position', position);

        window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoords } }));
    },
    /**
     * Returns distance in meters between source and destination inputs.
     *
     *  Calculate distance, bearing and more between Latitude/Longitude points
     *  Details: https://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Position} src
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance | Number.MAX_SAFE_INTEGER
     */
    computeDistanceMeters: function (src, dest, isPlace) {
        var distance = this._haversineDist (src, dest);

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // return max distance possible - to be handled by the caller
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        // if function has been called for a place, and if it's too far and a max distance has been set,
        // return max distance possible - to be handled by the caller
        if (isPlace && this.data.maxDistance && this.data.maxDistance > 0 && distance > this.data.maxDistance) {
            return Number.MAX_SAFE_INTEGER;
        }
    
        return distance;
    },

    _haversineDist: function (src, dest) {
        var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(src.latitude)) * Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return angle * 6371000;
    },

    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function (alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function (event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
    _updateRotation: function () {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(offset);
    },
    
    _onGpsEntityPlaceAdded: function() {
        // if places are added after camera initialization is finished
        if (this.originCoords) {
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        }
        if (this.loader && this.loader.parentElement) {
            document.body.removeChild(this.loader)
        }
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-entity-place.js":
/*!*******************************************************!*\
  !*** ./aframe/src/location-based/gps-entity-place.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-entity-place', {
    _cameraGps: null,
    schema: {
        longitude: {
            type: 'number',
            default: 0,
        },
        latitude: {
            type: 'number',
            default: 0,
        }
    },
    remove: function() {
        // cleaning listeners when the entity is removed from the DOM
        window.removeEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.removeEventListener('gps-camera-update-position', this.updatePositionListener);
    },
    init: function() {
        this.coordSetListener = () => {
            if (!this._cameraGps) {
                var camera = document.querySelector('[gps-camera]');
                if (!camera.components['gps-camera']) {
                    console.error('gps-camera not initialized')
                    return;
                }
                this._cameraGps = camera.components['gps-camera'];
            }
            this._updatePosition();
        };

        this.updatePositionListener = (ev) => {
            if (!this.data || !this._cameraGps) {
                return;
            }

            var dstCoords = {
                longitude: this.data.longitude,
                latitude: this.data.latitude,
            };

            // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
            var distanceForMsg = this._cameraGps.computeDistanceMeters(ev.detail.position, dstCoords);

            this.el.setAttribute('distance', distanceForMsg);
            this.el.setAttribute('distanceMsg', this._formatDistance(distanceForMsg));
            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-position', { detail: { distance: distanceForMsg } }));

            var actualDistance = this._cameraGps.computeDistanceMeters(ev.detail.position, dstCoords, true);

            if (actualDistance === Number.MAX_SAFE_INTEGER) {
                this.hideForMinDistance(this.el, true);
            } else {
                this.hideForMinDistance(this.el, false);
            }
        };

        window.addEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.addEventListener('gps-camera-update-position', this.updatePositionListener);

        this._positionXDebug = 0;

        window.dispatchEvent(new CustomEvent('gps-entity-place-added', { detail: { component: this.el } }));
    },
    /**
     * Hide entity according to minDistance property
     * @returns {void}
     */
    hideForMinDistance: function(el, hideEntity) {
        if (hideEntity) {
            el.setAttribute('visible', 'false');
        } else {
            el.setAttribute('visible', 'true');
        }
    },
    /**
     * Update place position
     * @returns {void}
     */
    _updatePosition: function() {
        var position = { x: 0, y: this.el.getAttribute('position').y || 0, z: 0 }

        // update position.x
        var dstCoords = {
            longitude: this.data.longitude,
            latitude: this._cameraGps.originCoords.latitude,
        };

        position.x = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

        this._positionXDebug = position.x;

        position.x *= this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

        // update position.z
        var dstCoords = {
            longitude: this._cameraGps.originCoords.longitude,
            latitude: this.data.latitude,
        };

        position.z = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

        position.z *= this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

        if (position.y !== 0) {
            var altitude = this._cameraGps.originCoords.altitude !== undefined ? this._cameraGps.originCoords.altitude : 0;
            position.y = position.y - altitude;
        }

        // update element's position in 3D world
        this.el.setAttribute('position', position);
    },

    /**
      * Format distances string
      *
      * @param {String} distance
      */

    _formatDistance: function(distance) {
        distance = distance.toFixed(0);

        if (distance >= 1000) {
            return (distance / 1000) + ' kilometers';
        }

        return distance + ' meters';
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-camera.js":
/*!***********************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-camera.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-camera
 *
 * based on the original gps-camera, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original position (lat/lon) is projected into Spherical Mercator and
 * stored.
 *
 * Then, when we receive a new position (lat/lon), this new position is
 * projected into Spherical Mercator and then its world position calculated
 * by comparing against the original position.
 *
 * The same is also the case for 'entity-places'; when these are added, their
 * Spherical Mercator coords are calculated (see gps-projected-entity-place).
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 *
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-projected-camera', {
    _watchPositionId: null,
    originCoords: null, // original coords now in Spherical Mercator
    currentCoords: null,
    lookControls: null,
    heading: null,
    schema: {
        simulateLatitude: {
            type: 'number',
            default: 0,
        },
        simulateLongitude: {
            type: 'number',
            default: 0,
        },
        simulateAltitude: {
            type: 'number',
            default: 0,
        },
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        },
        gpsMinDistance: {
            type: 'number',
            default: 0
        },
        gpsTimeInterval: {
            type: 'number',
            default: 0
        },
    },
    update: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.longitude = this.data.simulateLongitude;
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.altitude = this.data.simulateAltitude;
            this.currentCoords = localPosition;

            // re-trigger initialization for new origin
            this.originCoords = null;
            this._updatePosition();
        }
    },
    init: function() {
        if (!this.el.components['arjs-look-controls'] && !this.el.components['look-controls']) {
            return;
        }

        this.lastPosition = {
            latitude: 0,
            longitude: 0
        };

        this.loader = document.createElement('DIV');
        this.loader.classList.add('arjs-loader');
        document.body.appendChild(this.loader);

        this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
        window.addEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);

        this.lookControls = this.el.components['arjs-look-controls'] || this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        // if Safari
        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            // iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function() {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };

                document.addEventListener('touchend', function() { handler() }, false);

                this.el.sceneEl.systems['arjs']._displayErrorPopup('After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function() {
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Please enable device orientation in Settings > Safari > Motion & Orientation Access.');
                }, 750);
                window.addEventListener(eventName, function() {
                    clearTimeout(timeout);
                });
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);
    },

    play: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.longitude = this.data.simulateLongitude;
            if (this.data.simulateAltitude !== 0) {
                localPosition.altitude = this.data.simulateAltitude;
            }
            this.currentCoords = localPosition;
            this._updatePosition();
        } else {
            this._watchPositionId = this._initWatchGPS(function (position) {
                var localPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    altitude: position.coords.altitude,
                    accuracy: position.coords.accuracy,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                };
          
                if (this.data.simulateAltitude !== 0) {
                    localPosition.altitude = this.data.simulateAltitude;
                }
               
                this.currentCoords = localPosition;
                var distMoved = this._haversineDist(
                    this.lastPosition,
                    this.currentCoords
                );

                if(distMoved >= this.data.gpsMinDistance || !this.originCoords) {
                    this._updatePosition();
                    this.lastPosition = {
                        longitude: this.currentCoords.longitude,
                        latitude: this.currentCoords.latitude
                    };
                }
            }.bind(this));
        }
    },

    tick: function() {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    pause: function() {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;
    },

    remove: function() {
        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
        window.removeEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function() {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
    _initWatchGPS: function(onSuccess, onError) {
        if (!onError) {
            onError = function(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');  
                    return;
                }

                if (err.code === 3) {
                    this.el.sceneEl.systems['arjs']._displayErrorPopup('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: this.data.gpsTimeInterval,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     *
     * @returns {void}
     */
    _updatePosition: function() {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }

        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        if (!this.originCoords) {
            // first camera initialization
            // Now store originCoords as PROJECTED original lat/lon, so that
            // we can set the world origin to the original position in "metres"
            this.originCoords = this._project(this.currentCoords.latitude, this.currentCoords.longitude);
            this._setPosition();

            var loader = document.querySelector('.arjs-loader');
            if (loader) {
                loader.remove();
            }
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        } else {
            this._setPosition();
        }
    },
    /**
     * Set the current position (in world coords, based on Spherical Mercator)
     *
     * @returns {void}
     */
    _setPosition: function() {
        var position = this.el.getAttribute('position');

        var worldCoords = this.latLonToWorld(this.currentCoords.latitude, this.currentCoords.longitude);

        position.x = worldCoords[0];
        position.z = worldCoords[1];

        // update position
        this.el.setAttribute('position', position);

        // add the sphmerc position to the event (for testing only)
        window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoords } }));
    },
    /**
     * Returns distance in meters between camera and destination input.
     *
     * Assume we are using a metre-based projection. Not all 'metre-based'
     * projections give exact metres, e.g. Spherical Mercator, but it appears
     * close enough to be used for AR at least in middle temperate
     * latitudes (40 - 55). It is heavily distorted near the poles, however.
     *
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance | Number.MAX_SAFE_INTEGER
     */
    computeDistanceMeters: function(dest, isPlace) {
        var src = this.el.getAttribute("position");
        var dx = dest.x - src.x;
        var dz = dest.z - src.z;
        var distance = Math.sqrt(dx * dx + dz * dz);

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // return max distance possible - to be handled by the  method caller
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        return distance;
    },
    /**
     * Converts latitude/longitude to OpenGL world coordinates.
     *
     * First projects lat/lon to absolute Spherical Mercator and then
     * calculates the world coordinates by comparing the Spherical Mercator
     * coordinates with the Spherical Mercator coordinates of the origin point.
     *
     * @param {Number} lat
     * @param {Number} lon
     *
     * @returns {array} world coordinates
     */
    latLonToWorld: function(lat, lon) {
        var projected = this._project(lat, lon);
        // Sign of z needs to be reversed compared to projected coordinates
        return [projected[0] - this.originCoords[0], -(projected[1] - this.originCoords[1])];
    },
    /**
     * Converts latitude/longitude to Spherical Mercator coordinates.
     * Algorithm is used in several OpenStreetMap-related applications.
     *
     * @param {Number} lat
     * @param {Number} lon
     *
     * @returns {array} Spherical Mercator coordinates
     */
    _project: function(lat, lon) {
        const HALF_EARTH = 20037508.34;

        // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
        // known as 'Google Projection', using the algorithm used extensively
        // in various OpenStreetMap software.
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
        return [(lon / 180.0) * HALF_EARTH, y * HALF_EARTH / 180.0];
    },
    /**
     * Converts Spherical Mercator coordinates to latitude/longitude.
     * Algorithm is used in several OpenStreetMap-related applications.
     *
     * @param {Number} spherical mercator easting
     * @param {Number} spherical mercator northing
     *
     * @returns {object} lon/lat
     */
    _unproject: function(e, n) {
        const HALF_EARTH = 20037508.34;
        var yp = (n / HALF_EARTH) * 180.0;
        return {
            longitude: (e / HALF_EARTH) * 180.0,
            latitude: 180.0 / Math.PI * (2 * Math.atan(Math.exp(yp * Math.PI / 180.0)) - Math.PI / 2)
        };
    },
    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function(alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function(event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
    _updateRotation: function() {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
    },

    /**
     * Calculate haversine distance between two lat/lon pairs.
     *
     * Taken from gps-camera
     */
    _haversineDist: function(src, dest) {
        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return angle * 6371000;
    },

    _onGpsEntityPlaceAdded: function() {
        // if places are added after camera initialization is finished
        if (this.originCoords) {
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        }
        if (this.loader && this.loader.parentElement) {
            document.body.removeChild(this.loader)
        }
    }
});



/***/ }),

/***/ "./aframe/src/location-based/gps-projected-entity-place.js":
/*!*****************************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-entity-place.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-entity-place
 *
 * based on the original gps-entity-place, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original location on startup (lat/lon) is projected into Spherical 
 * Mercator and stored.
 *
 * When 'entity-places' are added, their Spherical Mercator coords are 
 * calculated and converted into world coordinates, relative to the original
 * position, using the Spherical Mercator projection calculation in
 * gps-projected-camera.
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-projected-entity-place', {
    _cameraGps: null,
    schema: {
        longitude: {
            type: 'number',
            default: 0,
        },
        latitude: {
            type: 'number',
            default: 0,
        }
    },
    remove: function() {
        // cleaning listeners when the entity is removed from the DOM
        window.removeEventListener('gps-camera-update-position', this.updatePositionListener);
    },
    init: function() {
        // Used now to get the GPS camera when it's been setup
        this.coordSetListener = () => {
            if (!this._cameraGps) {
                var camera = document.querySelector('[gps-projected-camera]');
                if (!camera.components['gps-projected-camera']) {
                    console.error('gps-projected-camera not initialized')
                    return;
                }
                this._cameraGps = camera.components['gps-projected-camera'];
                this._updatePosition();
            }
        };
        


        // update position needs to worry about distance but nothing else?
        this.updatePositionListener = (ev) => {
            if (!this.data || !this._cameraGps) {
                return;
            }

            var dstCoords = this.el.getAttribute('position');

            // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
            // _computeDistanceMeters is now going to use the projected
            var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

            this.el.setAttribute('distance', distanceForMsg);
            this.el.setAttribute('distanceMsg', this._formatDistance(distanceForMsg));

            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-position', { detail: { distance: distanceForMsg } }));

            var actualDistance = this._cameraGps.computeDistanceMeters(dstCoords, true);

            if (actualDistance === Number.MAX_SAFE_INTEGER) {
                this.hideForMinDistance(this.el, true);
            } else {
                this.hideForMinDistance(this.el, false);
            }
        };

        // Retain as this event is fired when the GPS camera is set up
        window.addEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.addEventListener('gps-camera-update-position', this.updatePositionListener);

        this._positionXDebug = 0;

        window.dispatchEvent(new CustomEvent('gps-entity-place-added', { detail: { component: this.el } }));
    },
    /**
     * Hide entity according to minDistance property
     * @returns {void}
     */
    hideForMinDistance: function(el, hideEntity) {
        if (hideEntity) {
            el.setAttribute('visible', 'false');
        } else {
            el.setAttribute('visible', 'true');
        }
    },
    /**
     * Update place position
     * @returns {void}
     */

    // set position to world coords using the lat/lon 
    _updatePosition: function() {
        var worldPos = this._cameraGps.latLonToWorld(this.data.latitude, this.data.longitude);
        var position = this.el.getAttribute('position');

        // update element's position in 3D world
        //this.el.setAttribute('position', position);
        this.el.setAttribute('position', {
            x: worldPos[0],
            y: position.y, 
            z: worldPos[1]
        }); 
    },

    /**
      * Format distances string
      *
      * @param {String} distance
      */

    _formatDistance: function(distance) {
        distance = distance.toFixed(0);

        if (distance >= 1000) {
            return (distance / 1000) + ' kilometers';
        }

        return distance + ' meters';
    }
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
/*!********************************************!*\
  !*** ./aframe/src/location-based/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arjs_look_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arjs-look-controls */ "./aframe/src/location-based/arjs-look-controls.js");
/* harmony import */ var _arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
/* harmony import */ var _gps_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gps-camera */ "./aframe/src/location-based/gps-camera.js");
/* harmony import */ var _gps_entity_place__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gps-entity-place */ "./aframe/src/location-based/gps-entity-place.js");
/* harmony import */ var _gps_projected_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gps-projected-camera */ "./aframe/src/location-based/gps-projected-camera.js");
/* harmony import */ var _gps_projected_entity_place__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gps-projected-entity-place */ "./aframe/src/location-based/gps-projected-entity-place.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUN0SUQ7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QjtBQUNDO0FBQ1U7QUFDbkI7QUFDTTtBQUNJO0FBQ00iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLWxvb2stY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcImFmcmFtZVwiLFwiY29tbW9uanMyXCI6XCJhZnJhbWVcIixcImFtZFwiOlwiYWZyYW1lXCIsXCJyb290XCI6XCJBRlJBTUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhZnJhbWVcIiwgXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJBUmpzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFSanNcIl0gPSBmYWN0b3J5KHJvb3RbXCJBRlJBTUVcIl0sIHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pIHtcbnJldHVybiAiLCJcbi8qKlxuICogQGF1dGhvciByaWNodCAvIGh0dHA6Ly9yaWNodC5tZVxuICogQGF1dGhvciBXZXN0TGFuZ2xleSAvIGh0dHA6Ly9naXRodWIuY29tL1dlc3RMYW5nbGV5XG4gKlxuICogVzNDIERldmljZSBPcmllbnRhdGlvbiBjb250cm9sIChodHRwOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sKVxuICovXG5cbi8qIE5PVEUgdGhhdCB0aGlzIGlzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIHRvIFxuICogYWxsb3cgZXhwb25lbnRpYWwgc21vb3RoaW5nLCBmb3IgdXNlIGluIEFSLmpzLlxuICpcbiAqIE1vZGlmaWNhdGlvbnMgTmljayBXaGl0ZWxlZ2cgKG5pY2t3MSBnaXRodWIpXG4gKi9cblxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmNvbnN0IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzID0gZnVuY3Rpb24gKCBvYmplY3QgKSB7XG5cbiAgdmFyIHNjb3BlID0gdGhpcztcblxuICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlciggJ1lYWicgKTtcblxuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcbiAgdGhpcy5zY3JlZW5PcmllbnRhdGlvbiA9IDA7XG5cbiAgdGhpcy5hbHBoYU9mZnNldCA9IDA7IC8vIHJhZGlhbnNcblxuICB0aGlzLnNtb290aGluZ0ZhY3RvciA9IDE7XG5cbiAgdGhpcy5UV09fUEkgPSAyICogTWF0aC5QSTtcbiAgdGhpcy5IQUxGX1BJID0gMC41ICogTWF0aC5QSTtcblxuICB2YXIgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCBldmVudCApIHtcblxuICAgIHNjb3BlLmRldmljZU9yaWVudGF0aW9uID0gZXZlbnQ7XG5cbiAgfTtcblxuICB2YXIgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb24gfHwgMDtcblxuICB9O1xuXG4gIC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcblxuICB2YXIgc2V0T2JqZWN0UXVhdGVybmlvbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciB6ZWUgPSBuZXcgVEhSRUUuVmVjdG9yMyggMCwgMCwgMSApO1xuXG4gICAgdmFyIGV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG5cbiAgICB2YXIgcTAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuXG4gICAgdmFyIHExID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oIC0gTWF0aC5zcXJ0KCAwLjUgKSwgMCwgMCwgTWF0aC5zcXJ0KCAwLjUgKSApOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcblxuICAgIHJldHVybiBmdW5jdGlvbiAoIHF1YXRlcm5pb24sIGFscGhhLCBiZXRhLCBnYW1tYSwgb3JpZW50ICkge1xuXG4gICAgICBldWxlci5zZXQoIGJldGEsIGFscGhhLCAtIGdhbW1hLCAnWVhaJyApOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlciggZXVsZXIgKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseSggcTEgKTsgLy8gY2FtZXJhIGxvb2tzIG91dCB0aGUgYmFjayBvZiB0aGUgZGV2aWNlLCBub3QgdGhlIHRvcFxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KCBxMC5zZXRGcm9tQXhpc0FuZ2xlKCB6ZWUsIC0gb3JpZW50ICkgKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cblxuICAgIH07XG5cbiAgfSgpO1xuXG4gIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiBcbiAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsIGZhbHNlICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdkZXZpY2VvcmllbnRhdGlvbicsIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCwgZmFsc2UgKTtcblxuICAgIHNjb3BlLmVuYWJsZWQgPSB0cnVlO1xuXG4gIH07XG5cbiAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdvcmllbnRhdGlvbmNoYW5nZScsIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCwgZmFsc2UgKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2RldmljZW9yaWVudGF0aW9uJywgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LCBmYWxzZSApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IGZhbHNlO1xuXG4gIH07XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG4gICAgdmFyIGRldmljZSA9IHNjb3BlLmRldmljZU9yaWVudGF0aW9uO1xuXG4gICAgaWYgKCBkZXZpY2UgKSB7XG5cbiAgICAgIHZhciBhbHBoYSA9IGRldmljZS5hbHBoYSA/IFRIUkVFLk1hdGguZGVnVG9SYWQoIGRldmljZS5hbHBoYSApICsgc2NvcGUuYWxwaGFPZmZzZXQgOiAwOyAvLyBaXG5cbiAgICAgIHZhciBiZXRhID0gZGV2aWNlLmJldGEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKCBkZXZpY2UuYmV0YSApIDogMDsgLy8gWCdcblxuICAgICAgdmFyIGdhbW1hID0gZGV2aWNlLmdhbW1hID8gVEhSRUUuTWF0aC5kZWdUb1JhZCggZGV2aWNlLmdhbW1hICkgOiAwOyAvLyBZJydcblxuICAgICAgdmFyIG9yaWVudCA9IHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uID8gVEhSRUUuTWF0aC5kZWdUb1JhZCggc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gKSA6IDA7IC8vIE9cblxuICAgICAgLy8gTlcgQWRkZWQgc21vb3RoaW5nIGNvZGVcbiAgICAgIHZhciBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XG5cbiAgICAgIGlmKHRoaXMubGFzdE9yaWVudGF0aW9uKSB7XG4gICAgICAgIGFscGhhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShhbHBoYSwgdGhpcy5sYXN0T3JpZW50YXRpb24uYWxwaGEsIGspO1xuICAgICAgICBiZXRhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShiZXRhICsgTWF0aC5QSSwgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSwgayk7XG4gICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShnYW1tYSArIHRoaXMuSEFMRl9QSSwgdGhpcy5sYXN0T3JpZW50YXRpb24uZ2FtbWEsIGssIE1hdGguUEkpO1xuICAgIFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmV0YSArPSBNYXRoLlBJO1xuICAgICAgICBnYW1tYSArPSB0aGlzLkhBTEZfUEk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGFzdE9yaWVudGF0aW9uID0ge1xuICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgIGJldGE6IGJldGEsXG4gICAgICAgIGdhbW1hOiBnYW1tYVxuICAgICAgfTtcbiAgICAgIHNldE9iamVjdFF1YXRlcm5pb24oIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLCBhbHBoYSwgYmV0YSAtIE1hdGguUEksIGdhbW1hIC0gdGhpcy5IQUxGX1BJLCBvcmllbnQgKTtcblxuICAgIH1cbiAgfTtcblxuICAgXG4gICAvLyBOVyBBZGRlZFxuICB0aGlzLl9vcmRlckFuZ2xlID0gZnVuY3Rpb24oYSwgYiwgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgIGlmICgoYiA+IGEgJiYgTWF0aC5hYnMoYiAtIGEpIDwgcmFuZ2UgLyAyKSB8fCAoYSA+IGIgJiYgTWF0aC5hYnMoYiAtIGEpID4gcmFuZ2UgLyAyKSkge1xuICAgICAgcmV0dXJuIHsgbGVmdDogYSwgcmlnaHQ6IGIgfVxuICAgIH0gZWxzZSB7IFxuICAgICAgcmV0dXJuIHsgbGVmdDogYiwgcmlnaHQ6IGEgfVxuICAgIH1cbiAgfTtcblxuICAgLy8gTlcgQWRkZWRcbiAgdGhpcy5fZ2V0U21vb3RoZWRBbmdsZSA9IGZ1bmN0aW9uKGEsIGIsIGssIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICBjb25zdCBhbmdsZXMgPSB0aGlzLl9vcmRlckFuZ2xlKGEsIGIsIHJhbmdlKTtcbiAgICBjb25zdCBhbmdsZXNoaWZ0ID0gYW5nbGVzLmxlZnQ7XG4gICAgY29uc3Qgb3JpZ0FuZ2xlc1JpZ2h0ID0gYW5nbGVzLnJpZ2h0O1xuICAgIGFuZ2xlcy5sZWZ0ID0gMDtcbiAgICBhbmdsZXMucmlnaHQgLT0gYW5nbGVzaGlmdDtcbiAgICBpZihhbmdsZXMucmlnaHQgPCAwKSBhbmdsZXMucmlnaHQgKz0gcmFuZ2U7XG4gICAgbGV0IG5ld2FuZ2xlID0gb3JpZ0FuZ2xlc1JpZ2h0ID09IGIgPyAoMSAtIGspKmFuZ2xlcy5yaWdodCArIGsgKiBhbmdsZXMubGVmdCA6IGsgKiBhbmdsZXMucmlnaHQgKyAoMSAtIGspICogYW5nbGVzLmxlZnQ7XG4gICAgbmV3YW5nbGUgKz0gYW5nbGVzaGlmdDtcbiAgICBpZihuZXdhbmdsZSA+PSByYW5nZSkgbmV3YW5nbGUgLT0gcmFuZ2U7XG4gICAgcmV0dXJuIG5ld2FuZ2xlO1xuICB9O1xuXG4gIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY29wZS5kaXNjb25uZWN0KCk7XG4gIH07XG5cbiAgdGhpcy5jb25uZWN0KCk7XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzO1xuIiwiLy8gVG8gYXZvaWQgcmVjYWxjdWxhdGlvbiBhdCBldmVyeSBtb3VzZSBtb3ZlbWVudCB0aWNrXG52YXIgUElfMiA9IE1hdGguUEkgLyAyO1xuXG5cbi8qKlxuICogbG9vay1jb250cm9scy4gVXBkYXRlIGVudGl0eSBwb3NlLCBmYWN0b3JpbmcgbW91c2UsIHRvdWNoLCBhbmQgV2ViVlIgQVBJIGRhdGEuXG4gKi9cblxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIEEtRnJhbWUncyBsb29rLWNvbnRyb2xzIHRvIFxuICogYWxsb3cgZXhwb25lbnRpYWwgc21vb3RoaW5nLCBmb3IgdXNlIGluIEFSLmpzLlxuICpcbiAqIE1vZGlmaWNhdGlvbnMgTmljayBXaGl0ZWxlZ2cgKG5pY2t3MSBnaXRodWIpXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSdcbmltcG9ydCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tICcuL0FyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzJ1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2FyanMtbG9vay1jb250cm9scycsIHtcbiAgZGVwZW5kZW5jaWVzOiBbJ3Bvc2l0aW9uJywgJ3JvdGF0aW9uJ10sXG5cbiAgc2NoZW1hOiB7XG4gICAgZW5hYmxlZDoge2RlZmF1bHQ6IHRydWV9LFxuICAgIG1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkOiB7ZGVmYXVsdDogdHJ1ZX0sXG4gICAgcG9pbnRlckxvY2tFbmFibGVkOiB7ZGVmYXVsdDogZmFsc2V9LFxuICAgIHJldmVyc2VNb3VzZURyYWc6IHtkZWZhdWx0OiBmYWxzZX0sXG4gICAgcmV2ZXJzZVRvdWNoRHJhZzoge2RlZmF1bHQ6IGZhbHNlfSxcbiAgICB0b3VjaEVuYWJsZWQ6IHtkZWZhdWx0OiB0cnVlfSxcbiAgICBzbW9vdGhpbmdGYWN0b3I6IHsgdHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDEgfVxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmRlbHRhWWF3ID0gMDtcbiAgICB0aGlzLnByZXZpb3VzSE1EUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMuaG1kUXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlciA9IG5ldyBUSFJFRS5FdWxlcigpO1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0ge307XG4gICAgdGhpcy5kZWx0YVJvdGF0aW9uID0ge307XG4gICAgdGhpcy5zYXZlZFBvc2UgPSBudWxsO1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2V0dXBNb3VzZUNvbnRyb2xzKCk7XG4gICAgdGhpcy5iaW5kTWV0aG9kcygpO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50ID0ge307XG5cbiAgICB0aGlzLnNldHVwTWFnaWNXaW5kb3dDb250cm9scygpO1xuXG4gICAgLy8gVG8gc2F2ZSAvIHJlc3RvcmUgY2FtZXJhIHBvc2VcbiAgICB0aGlzLnNhdmVkUG9zZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygpLFxuICAgICAgcm90YXRpb246IG5ldyBUSFJFRS5FdWxlcigpXG4gICAgfTtcblxuICAgIC8vIENhbGwgZW50ZXIgVlIgaGFuZGxlciBpZiB0aGUgc2NlbmUgaGFzIGVudGVyZWQgVlIgYmVmb3JlIHRoZSBldmVudCBsaXN0ZW5lcnMgYXR0YWNoZWQuXG4gICAgaWYgKHRoaXMuZWwuc2NlbmVFbC5pcygndnItbW9kZScpKSB7IHRoaXMub25FbnRlclZSKCk7IH1cbiAgfSxcblxuICBzZXR1cE1hZ2ljV2luZG93Q29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFnaWNXaW5kb3dDb250cm9scztcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIC8vIE9ubHkgb24gbW9iaWxlIGRldmljZXMgYW5kIG9ubHkgZW5hYmxlZCBpZiBEZXZpY2VPcmllbnRhdGlvbiBwZXJtaXNzaW9uIGhhcyBiZWVuIGdyYW50ZWQuXG4gICAgaWYgKEFGUkFNRS51dGlscy5kZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgbWFnaWNXaW5kb3dDb250cm9scyA9IHRoaXMubWFnaWNXaW5kb3dDb250cm9scyA9IG5ldyBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyh0aGlzLm1hZ2ljV2luZG93T2JqZWN0KTtcbiAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbikge1xuICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuZWwuc2NlbmVFbC5jb21wb25lbnRzWydkZXZpY2Utb3JpZW50YXRpb24tcGVybWlzc2lvbi11aSddLnBlcm1pc3Npb25HcmFudGVkKSB7XG4gICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb25wZXJtaXNzaW9uZ3JhbnRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAob2xkRGF0YSkge1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgLy8gRGlzYWJsZSBncmFiIGN1cnNvciBjbGFzc2VzIGlmIG5vIGxvbmdlciBlbmFibGVkLlxuICAgIGlmIChkYXRhLmVuYWJsZWQgIT09IG9sZERhdGEuZW5hYmxlZCkge1xuICAgICAgdGhpcy51cGRhdGVHcmFiQ3Vyc29yKGRhdGEuZW5hYmxlZCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgbWFnaWMgd2luZG93IGV1bGVycyBpZiB0cmFja2luZyBpcyBkaXNhYmxlZC5cbiAgICBpZiAob2xkRGF0YSAmJiAhZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZCAmJiBvbGREYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci5zZXQoMCwgMCwgMCk7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci5zZXQoMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgLy8gUGFzcyBvbiBtYWdpYyB3aW5kb3cgdHJhY2tpbmcgc2V0dGluZyB0byBtYWdpY1dpbmRvd0NvbnRyb2xzLlxuICAgIGlmICh0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMpIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5zbW9vdGhpbmdGYWN0b3IgPSBkYXRhLnNtb290aGluZ0ZhY3RvcjtcbiAgICB9XG5cbiAgICBpZiAob2xkRGF0YSAmJiAhZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgIT09IG9sZERhdGEucG9pbnRlckxvY2tFbmFibGVkKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7IHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7IH1cbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBpZiAoIWRhdGEuZW5hYmxlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnVwZGF0ZU9yaWVudGF0aW9uKCk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7IHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7IH1cbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkgeyB0aGlzLmV4aXRQb2ludGVyTG9jaygpOyB9XG4gIH0sXG5cbiAgYmluZE1ldGhvZHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uTW91c2VEb3duID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlRG93biwgdGhpcyk7XG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZU1vdmUsIHRoaXMpO1xuICAgIHRoaXMub25Nb3VzZVVwID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlVXAsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xuICAgIHRoaXMub25FbnRlclZSID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbkVudGVyVlIsIHRoaXMpO1xuICAgIHRoaXMub25FeGl0VlIgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uRXhpdFZSLCB0aGlzKTtcbiAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsIHRoaXMpO1xuICAgIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsIHRoaXMpO1xuICB9LFxuXG4gLyoqXG4gICogU2V0IHVwIHN0YXRlcyBhbmQgT2JqZWN0M0RzIG5lZWRlZCB0byBzdG9yZSByb3RhdGlvbiBkYXRhLlxuICAqL1xuICBzZXR1cE1vdXNlQ29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMucGl0Y2hPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnlhd09iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMueWF3T2JqZWN0LnBvc2l0aW9uLnkgPSAxMDtcbiAgICB0aGlzLnlhd09iamVjdC5hZGQodGhpcy5waXRjaE9iamVjdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBtb3VzZSBhbmQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNhbnZhcy5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbC5jYW52YXM7XG5cbiAgICAvLyBXYWl0IGZvciBjYW52YXMgdG8gbG9hZC5cbiAgICBpZiAoIWNhbnZhc0VsKSB7XG4gICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ3JlbmRlci10YXJnZXQtbG9hZGVkJywgQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5hZGRFdmVudExpc3RlbmVycywgdGhpcykpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1vdXNlIGV2ZW50cy5cbiAgICBjYW52YXNFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLCBmYWxzZSk7XG5cbiAgICAvLyBUb3VjaCBldmVudHMuXG4gICAgY2FudmFzRWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIC8vIHNjZW5lRWwgZXZlbnRzLlxuICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcignZW50ZXItdnInLCB0aGlzLm9uRW50ZXJWUik7XG4gICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdleGl0LXZyJywgdGhpcy5vbkV4aXRWUik7XG5cbiAgICAvLyBQb2ludGVyIExvY2sgZXZlbnRzLlxuICAgIGlmICh0aGlzLmRhdGEucG9pbnRlckxvY2tFbmFibGVkKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybG9ja2NoYW5nZScsIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSwgZmFsc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96cG9pbnRlcmxvY2tjaGFuZ2UnLCB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrZXJyb3InLCB0aGlzLm9uUG9pbnRlckxvY2tFcnJvciwgZmFsc2UpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIG1vdXNlIGFuZCB0b3VjaCBldmVudCBsaXN0ZW5lcnMgZnJvbSBjYW52YXMuXG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwgJiYgc2NlbmVFbC5jYW52YXM7XG5cbiAgICBpZiAoIWNhbnZhc0VsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gTW91c2UgZXZlbnRzLlxuICAgIGNhbnZhc0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIC8vIFRvdWNoIGV2ZW50cy5cbiAgICBjYW52YXNFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXG4gICAgc2NlbmVFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdlbnRlci12cicsIHRoaXMub25FbnRlclZSKTtcbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2V4aXQtdnInLCB0aGlzLm9uRXhpdFZSKTtcblxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxvY2tjaGFuZ2UnLCB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3pwb2ludGVybG9ja2NoYW5nZScsIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrZXJyb3InLCB0aGlzLm9uUG9pbnRlckxvY2tFcnJvciwgZmFsc2UpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgb3JpZW50YXRpb24gZm9yIG1vYmlsZSwgbW91c2UgZHJhZywgYW5kIGhlYWRzZXQuXG4gICAqIE1vdXNlLWRyYWcgb25seSBlbmFibGVkIGlmIEhNRCBpcyBub3QgYWN0aXZlLlxuICAgKi9cbiAgdXBkYXRlT3JpZW50YXRpb246IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvc2VNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvYmplY3QzRCA9IHRoaXMuZWwub2JqZWN0M0Q7XG4gICAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xuICAgICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuICAgICAgdmFyIHBvc2U7XG4gICAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcblxuICAgICAgLy8gSW4gVlIgbW9kZSwgVEhSRUUgaXMgaW4gY2hhcmdlIG9mIHVwZGF0aW5nIHRoZSBjYW1lcmEgcG9zZS5cbiAgICAgIGlmIChzY2VuZUVsLmlzKCd2ci1tb2RlJykgJiYgc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkge1xuICAgICAgICAvLyBXaXRoIFdlYlhSIFRIUkVFIGFwcGxpZXMgaGVhZHNldCBwb3NlIHRvIHRoZSBvYmplY3QzRCBtYXRyaXhXb3JsZCBpbnRlcm5hbGx5LlxuICAgICAgICAvLyBSZWZsZWN0IHZhbHVlcyBiYWNrIG9uIHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUgZm9yIGdldEF0dHJpYnV0ZSB0byByZXR1cm4gdGhlIGV4cGVjdGVkIHZhbHVlcy5cbiAgICAgICAgaWYgKHNjZW5lRWwuaGFzV2ViWFIpIHtcbiAgICAgICAgICBwb3NlID0gc2NlbmVFbC5yZW5kZXJlci54ci5nZXRDYW1lcmFQb3NlKCk7XG4gICAgICAgICAgaWYgKHBvc2UpIHtcbiAgICAgICAgICAgIHBvc2VNYXRyaXguZWxlbWVudHMgPSBwb3NlLnRyYW5zZm9ybS5tYXRyaXg7XG4gICAgICAgICAgICBwb3NlTWF0cml4LmRlY29tcG9zZShvYmplY3QzRC5wb3NpdGlvbiwgb2JqZWN0M0Qucm90YXRpb24sIG9iamVjdDNELnNjYWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb24oKTtcblxuICAgICAgLy8gT24gbW9iaWxlLCBkbyBjYW1lcmEgcm90YXRpb24gd2l0aCB0b3VjaCBldmVudHMgYW5kIHNlbnNvcnMuXG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi54ID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIueCArIHBpdGNoT2JqZWN0LnJvdGF0aW9uLng7XG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi55ID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIueSArIHlhd09iamVjdC5yb3RhdGlvbi55O1xuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueiA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLno7XG4gICAgfTtcbiAgfSkoKSxcblxuICB1cGRhdGVNYWdpY1dpbmRvd09yaWVudGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlciA9IHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyO1xuICAgIHZhciBtYWdpY1dpbmRvd0RlbHRhRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlcjtcbiAgICAvLyBDYWxjdWxhdGUgbWFnaWMgd2luZG93IEhNRCBxdWF0ZXJuaW9uLlxuICAgIGlmICh0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMgJiYgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy51cGRhdGUoKTtcbiAgICAgIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci5zZXRGcm9tUXVhdGVybmlvbih0aGlzLm1hZ2ljV2luZG93T2JqZWN0LnF1YXRlcm5pb24sICdZWFonKTtcbiAgICAgIGlmICghdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ICYmIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55ICE9PSAwKSB7XG4gICAgICAgIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdykge1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueCA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci54O1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueSArPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueSAtIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdztcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnogPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuejtcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgbW91c2UgZHJhZyBpbnRvIHJvdGF0aW9uLlxuICAgKlxuICAgKiBEcmFnZ2luZyB1cCBhbmQgZG93biByb3RhdGVzIHRoZSBjYW1lcmEgYXJvdW5kIHRoZSBYLWF4aXMgKHlhdykuXG4gICAqIERyYWdnaW5nIGxlZnQgYW5kIHJpZ2h0IHJvdGF0ZXMgdGhlIGNhbWVyYSBhcm91bmQgdGhlIFktYXhpcyAocGl0Y2gpLlxuICAgKi9cbiAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIHZhciBtb3ZlbWVudFg7XG4gICAgdmFyIG1vdmVtZW50WTtcbiAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xuICAgIHZhciBwcmV2aW91c01vdXNlRXZlbnQgPSB0aGlzLnByZXZpb3VzTW91c2VFdmVudDtcbiAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG5cbiAgICAvLyBOb3QgZHJhZ2dpbmcgb3Igbm90IGVuYWJsZWQuXG4gICAgaWYgKCF0aGlzLmRhdGEuZW5hYmxlZCB8fCAoIXRoaXMubW91c2VEb3duICYmICF0aGlzLnBvaW50ZXJMb2NrZWQpKSB7IHJldHVybjsgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGRlbHRhLlxuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIG1vdmVtZW50WCA9IGV2dC5tb3ZlbWVudFggfHwgZXZ0Lm1vek1vdmVtZW50WCB8fCAwO1xuICAgICAgbW92ZW1lbnRZID0gZXZ0Lm1vdmVtZW50WSB8fCBldnQubW96TW92ZW1lbnRZIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdmVtZW50WCA9IGV2dC5zY3JlZW5YIC0gcHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblg7XG4gICAgICBtb3ZlbWVudFkgPSBldnQuc2NyZWVuWSAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZO1xuICAgIH1cbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YID0gZXZ0LnNjcmVlblg7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWSA9IGV2dC5zY3JlZW5ZO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHJvdGF0aW9uLlxuICAgIGRpcmVjdGlvbiA9IHRoaXMuZGF0YS5yZXZlcnNlTW91c2VEcmFnID8gMSA6IC0xO1xuICAgIHlhd09iamVjdC5yb3RhdGlvbi55ICs9IG1vdmVtZW50WCAqIDAuMDAyICogZGlyZWN0aW9uO1xuICAgIHBpdGNoT2JqZWN0LnJvdGF0aW9uLnggKz0gbW92ZW1lbnRZICogMC4wMDIgKiBkaXJlY3Rpb247XG4gICAgcGl0Y2hPYmplY3Qucm90YXRpb24ueCA9IE1hdGgubWF4KC1QSV8yLCBNYXRoLm1pbihQSV8yLCBwaXRjaE9iamVjdC5yb3RhdGlvbi54KSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIG1vdXNlIGRvd24gdG8gZGV0ZWN0IG1vdXNlIGRyYWcuXG4gICAqL1xuICBvbk1vdXNlRG93bjogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIGlmICghdGhpcy5kYXRhLmVuYWJsZWQgfHwgKHNjZW5lRWwuaXMoJ3ZyLW1vZGUnKSAmJiBzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSkgeyByZXR1cm47IH1cbiAgICAvLyBIYW5kbGUgb25seSBwcmltYXJ5IGJ1dHRvbi5cbiAgICBpZiAoZXZ0LmJ1dHRvbiAhPT0gMCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwgJiYgc2NlbmVFbC5jYW52YXM7XG5cbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWCA9IGV2dC5zY3JlZW5YO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblkgPSBldnQuc2NyZWVuWTtcbiAgICB0aGlzLnNob3dHcmFiYmluZ0N1cnNvcigpO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgJiYgIXRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgaWYgKGNhbnZhc0VsLnJlcXVlc3RQb2ludGVyTG9jaykge1xuICAgICAgICBjYW52YXNFbC5yZXF1ZXN0UG9pbnRlckxvY2soKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKSB7XG4gICAgICAgIGNhbnZhc0VsLm1velJlcXVlc3RQb2ludGVyTG9jaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2hvd3MgZ3JhYmJpbmcgY3Vyc29yIG9uIHNjZW5lXG4gICAqL1xuICBzaG93R3JhYmJpbmdDdXJzb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNjZW5lRWwuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdncmFiYmluZyc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEhpZGVzIGdyYWJiaW5nIGN1cnNvciBvbiBzY2VuZVxuICAgKi9cbiAgaGlkZUdyYWJiaW5nQ3Vyc29yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnJztcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgbW91c2UgdXAgdG8gZGV0ZWN0IHJlbGVhc2Ugb2YgbW91c2UgZHJhZy5cbiAgICovXG4gIG9uTW91c2VVcDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlR3JhYmJpbmdDdXJzb3IoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdG91Y2ggZG93biB0byBkZXRlY3QgdG91Y2ggZHJhZy5cbiAgICovXG4gIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQudG91Y2hlcy5sZW5ndGggIT09IDEgfHxcbiAgICAgICAgIXRoaXMuZGF0YS50b3VjaEVuYWJsZWQgfHxcbiAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmlzKCd2ci1tb2RlJykpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xuICAgICAgeDogZXZ0LnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICB5OiBldnQudG91Y2hlc1swXS5wYWdlWVxuICAgIH07XG4gICAgdGhpcy50b3VjaFN0YXJ0ZWQgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgdG91Y2ggbW92ZSB0byBZLWF4aXMgcm90YXRpb24uXG4gICAqL1xuICBvblRvdWNoTW92ZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuZWwuc2NlbmVFbC5jYW52YXM7XG4gICAgdmFyIGRlbHRhWTtcbiAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG5cbiAgICBpZiAoIXRoaXMudG91Y2hTdGFydGVkIHx8ICF0aGlzLmRhdGEudG91Y2hFbmFibGVkKSB7IHJldHVybjsgfVxuXG4gICAgZGVsdGFZID0gMiAqIE1hdGguUEkgKiAoZXZ0LnRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLnRvdWNoU3RhcnQueCkgLyBjYW52YXMuY2xpZW50V2lkdGg7XG5cbiAgICBkaXJlY3Rpb24gPSB0aGlzLmRhdGEucmV2ZXJzZVRvdWNoRHJhZyA/IDEgOiAtMTtcbiAgICAvLyBMaW1pdCB0b3VjaCBvcmllbnRhaW9uIHRvIHRvIHlhdyAoeSBheGlzKS5cbiAgICB5YXdPYmplY3Qucm90YXRpb24ueSAtPSBkZWx0YVkgKiAwLjUgKiBkaXJlY3Rpb247XG4gICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xuICAgICAgeDogZXZ0LnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICB5OiBldnQudG91Y2hlc1swXS5wYWdlWVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvdWNoIGVuZCB0byBkZXRlY3QgcmVsZWFzZSBvZiB0b3VjaCBkcmFnLlxuICAgKi9cbiAgb25Ub3VjaEVuZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudG91Y2hTdGFydGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmUgcG9zZS5cbiAgICovXG4gIG9uRW50ZXJWUjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIGlmICghc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLnNhdmVDYW1lcmFQb3NlKCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgaWYgKHNjZW5lRWwuaGFzV2ViWFIpIHtcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbC5vYmplY3QzRC51cGRhdGVNYXRyaXgoKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc3RvcmUgdGhlIHBvc2UuXG4gICAqL1xuICBvbkV4aXRWUjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbC5zY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7IHJldHVybjsgfVxuICAgIHRoaXMucmVzdG9yZUNhbWVyYVBvc2UoKTtcbiAgICB0aGlzLnByZXZpb3VzSE1EUG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMuZWwub2JqZWN0M0QubWF0cml4QXV0b1VwZGF0ZSA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBQb2ludGVyIExvY2sgc3RhdGUuXG4gICAqL1xuICBvblBvaW50ZXJMb2NrQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gISEoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50IHx8IGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlY292ZXIgZnJvbSBQb2ludGVyIExvY2sgZXJyb3IuXG4gICAqL1xuICBvblBvaW50ZXJMb2NrRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvLyBFeGl0cyBwb2ludGVyLWxvY2tlZCBtb2RlLlxuICBleGl0UG9pbnRlckxvY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBmZWF0dXJlIG9mIHNob3dpbmcvaGlkaW5nIHRoZSBncmFiIGN1cnNvci5cbiAgICovXG4gIHVwZGF0ZUdyYWJDdXJzb3I6IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG5cbiAgICBmdW5jdGlvbiBlbmFibGVHcmFiQ3Vyc29yICgpIHsgc2NlbmVFbC5jYW52YXMuY2xhc3NMaXN0LmFkZCgnYS1ncmFiLWN1cnNvcicpOyB9XG4gICAgZnVuY3Rpb24gZGlzYWJsZUdyYWJDdXJzb3IgKCkgeyBzY2VuZUVsLmNhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKCdhLWdyYWItY3Vyc29yJyk7IH1cblxuICAgIGlmICghc2NlbmVFbC5jYW52YXMpIHtcbiAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcigncmVuZGVyLXRhcmdldC1sb2FkZWQnLCBlbmFibGVHcmFiQ3Vyc29yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcigncmVuZGVyLXRhcmdldC1sb2FkZWQnLCBkaXNhYmxlR3JhYkN1cnNvcik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIGVuYWJsZUdyYWJDdXJzb3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGlzYWJsZUdyYWJDdXJzb3IoKTtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZSBjYW1lcmEgcG9zZSBiZWZvcmUgZW50ZXJpbmcgVlIgdG8gcmVzdG9yZSBsYXRlciBpZiBleGl0aW5nLlxuICAgKi9cbiAgc2F2ZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuXG4gICAgdGhpcy5zYXZlZFBvc2UucG9zaXRpb24uY29weShlbC5vYmplY3QzRC5wb3NpdGlvbik7XG4gICAgdGhpcy5zYXZlZFBvc2Uucm90YXRpb24uY29weShlbC5vYmplY3QzRC5yb3RhdGlvbik7XG4gICAgdGhpcy5oYXNTYXZlZFBvc2UgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNldCBjYW1lcmEgcG9zZSB0byBiZWZvcmUgZW50ZXJpbmcgVlIuXG4gICAqL1xuICByZXN0b3JlQ2FtZXJhUG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG4gICAgdmFyIHNhdmVkUG9zZSA9IHRoaXMuc2F2ZWRQb3NlO1xuXG4gICAgaWYgKCF0aGlzLmhhc1NhdmVkUG9zZSkgeyByZXR1cm47IH1cblxuICAgIC8vIFJlc2V0IGNhbWVyYSBvcmllbnRhdGlvbi5cbiAgICBlbC5vYmplY3QzRC5wb3NpdGlvbi5jb3B5KHNhdmVkUG9zZS5wb3NpdGlvbik7XG4gICAgZWwub2JqZWN0M0Qucm90YXRpb24uY29weShzYXZlZFBvc2Uucm90YXRpb24pO1xuICAgIHRoaXMuaGFzU2F2ZWRQb3NlID0gZmFsc2U7XG4gIH1cbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSdcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJ1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2FyanMtd2ViY2FtLXRleHR1cmUnLCB7XG5cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICAgICAgdGhpcy50ZXhDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKC0wLjUsIDAuNSwgMC41LCAtMC41LCAwLCAxMCk7XG4gICAgICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpO1xuICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xuICAgICAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgICAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpOyAvLzAuNSwgMC41KTtcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh0aGlzLnZpZGVvKTtcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBtYXA6IHRoaXMudGV4dHVyZSB9ICk7XG4gICAgICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnRleFNjZW5lLmFkZChtZXNoKTtcbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKG5hdmlnYXRvci5tZWRpYURldmljZXMgJiYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0geyB2aWRlbzoge1xuICAgICAgICAgICAgICAgIGZhY2luZ01vZGU6ICdlbnZpcm9ubWVudCcgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKCBzdHJlYW09PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBzdHJlYW07ICAgIFxuICAgICAgICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHsgIFxuICAgICAgICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydhcmpzJ10uX2Rpc3BsYXlFcnJvclBvcHVwKGBXZWJjYW0gZXJyb3I6ICR7ZX1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbJ2FyanMnXS5fZGlzcGxheUVycm9yUG9wdXAoJ3NvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuc2NlbmUucmVuZGVyZXIucmVuZGVyKHRoaXMudGV4U2NlbmUsIHRoaXMudGV4Q2FtZXJhKTtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gICAgfSxcblxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QuZ2V0VHJhY2tzKCkuZm9yRWFjaCAoIHRyYWNrID0+IHtcbiAgICAgICAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICAgIH1cbn0pO1xuIiwiLypcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLWNhbWVyYScsIHtcbiAgICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxuICAgIG9yaWdpbkNvb3JkczogbnVsbCxcbiAgICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICAgIGxvb2tDb250cm9sczogbnVsbCxcbiAgICBoZWFkaW5nOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBzaW11bGF0ZUxhdGl0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgIH0sXG4gICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbWF4RGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG5cbiAgICAgICAgICAgIC8vIHJlLXRyaWdnZXIgaW5pdGlhbGl6YXRpb24gZm9yIG5ldyBvcmlnaW5cbiAgICAgICAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHsgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLmVsLmNvbXBvbmVudHNbJ2FyanMtbG9vay1jb250cm9scyddICYmICF0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2FyanMtbG9hZGVyJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5sb2FkZXIpO1xuXG4gICAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQpO1xuXG4gICAgICAgIHRoaXMubG9va0NvbnRyb2xzID0gdGhpcy5lbC5jb21wb25lbnRzWydhcmpzLWxvb2stY29udHJvbHMnXSB8fCB0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXTtcblxuICAgICAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gaWYgU2FmYXJpXG4gICAgICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgICAgICAgLy8gaU9TIDEzK1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLicpXG4gICAgICAgICAgICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7IGhhbmRsZXIoKSB9LCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1snYXJqcyddLl9kaXNwbGF5RXJyb3JQb3B1cCggJ0FmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1snYXJqcyddLl9kaXNwbGF5RXJyb3JQb3B1cCgnUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuJyk7XG4gICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG5cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSB0aGlzLl9pbml0V2F0Y2hHUFMoZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgYWx0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgICAgICAgICAgICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhlYWRpbmcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVSb3RhdGlvbigpO1xuICAgIH0sXG5cbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQpIHtcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50IG5hbWUsIGRlcGVuZHMgb24gYnJvd3NlciBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBldmVudCBuYW1lXG4gICAgICovXG4gICAgX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgnb25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSdcbiAgICAgICAgfSBlbHNlIGlmICgnb25kZXZpY2VvcmllbnRhdGlvbicgaW4gd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2RldmljZW9yaWVudGF0aW9uJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICcnXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb21wYXNzIG5vdCBzdXBwb3J0ZWQnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV2ZW50TmFtZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCB1c2VyIHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25TdWNjZXNzXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25FcnJvclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIF9pbml0V2F0Y2hHUFM6IGZ1bmN0aW9uIChvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICAgICAgICBvbkVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRVJST1IoJyArIGVyci5jb2RlICsgJyk6ICcgKyBlcnIubWVzc2FnZSlcblxuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBVc2VyIGRlbmllZCBHZW9Mb2NhdGlvbiwgbGV0IHRoZWlyIGtub3cgdGhhdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1snYXJqcyddLl9kaXNwbGF5RXJyb3JQb3B1cCgnUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbJ2FyanMnXS5fZGlzcGxheUVycm9yUG9wdXAoJ0Nhbm5vdCByZXRyaWV2ZSBHUFMgcG9zaXRpb24uIFNpZ25hbCBpcyBhYnNlbnQuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdnZW9sb2NhdGlvbicgaW4gbmF2aWdhdG9yID09PSBmYWxzZSkge1xuICAgICAgICAgICAgb25FcnJvcih7IGNvZGU6IDAsIG1lc3NhZ2U6ICdHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlcicgfSk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2VvbG9jYXRpb24vd2F0Y2hQb3NpdGlvblxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XG4gICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgICAgICAgICAgdGltZW91dDogMjcwMDAsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBkb24ndCB1cGRhdGUgaWYgYWNjdXJhY3kgaXMgbm90IGdvb2QgZW5vdWdoXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5hbGVydCAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsZXJ0LXBvcHVwJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBwb3B1cC5pbm5lckhUTUwgPSAnR1BTIHNpZ25hbCBpcyB2ZXJ5IHBvb3IuIFRyeSBtb3ZlIG91dGRvb3Igb3IgdG8gYW4gYXJlYSB3aXRoIGEgYmV0dGVyIHNpZ25hbC4nXG4gICAgICAgICAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKCdpZCcsICdhbGVydC1wb3B1cCcpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxlcnQtcG9wdXAnKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSAmJiBhbGVydFBvcHVwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGFsZXJ0UG9wdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgICAgICAgLy8gZmlyc3QgY2FtZXJhIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IHRoaXMuY3VycmVudENvb3JkcztcbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXJqcy1sb2FkZXInKTtcbiAgICAgICAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9zZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTtcblxuICAgICAgICAvLyBjb21wdXRlIHBvc2l0aW9uLnhcbiAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgfTtcblxuICAgICAgICBwb3NpdGlvbi54ID0gdGhpcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XG4gICAgICAgIHBvc2l0aW9uLnggKj0gdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSA+IHRoaXMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSA/IDEgOiAtMTtcblxuICAgICAgICAvLyBjb21wdXRlIHBvc2l0aW9uLnpcbiAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgfVxuXG4gICAgICAgIHBvc2l0aW9uLnogPSB0aGlzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcbiAgICAgICAgcG9zaXRpb24ueiAqPSB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSA/IC0xIDogMTtcblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb25cbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb24nLCB7IGRldGFpbDogeyBwb3NpdGlvbjogdGhpcy5jdXJyZW50Q29vcmRzLCBvcmlnaW46IHRoaXMub3JpZ2luQ29vcmRzIH0gfSkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkaXN0YW5jZSBpbiBtZXRlcnMgYmV0d2VlbiBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGlucHV0cy5cbiAgICAgKlxuICAgICAqICBDYWxjdWxhdGUgZGlzdGFuY2UsIGJlYXJpbmcgYW5kIG1vcmUgYmV0d2VlbiBMYXRpdHVkZS9Mb25naXR1ZGUgcG9pbnRzXG4gICAgICogIERldGFpbHM6IGh0dHBzOi8vd3d3Lm1vdmFibGUtdHlwZS5jby51ay9zY3JpcHRzL2xhdGxvbmcuaHRtbFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQb3NpdGlvbn0gc3JjXG4gICAgICogQHBhcmFtIHtQb3NpdGlvbn0gZGVzdFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNQbGFjZVxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcn0gZGlzdGFuY2UgfCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqL1xuICAgIGNvbXB1dGVEaXN0YW5jZU1ldGVyczogZnVuY3Rpb24gKHNyYywgZGVzdCwgaXNQbGFjZSkge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLl9oYXZlcnNpbmVEaXN0IChzcmMsIGRlc3QpO1xuXG4gICAgICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIG5lYXIgYW5kIGEgbWluIGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAgICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxuICAgICAgICBpZiAoaXNQbGFjZSAmJiB0aGlzLmRhdGEubWluRGlzdGFuY2UgJiYgdGhpcy5kYXRhLm1pbkRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IHRoaXMuZGF0YS5taW5EaXN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gZmFyIGFuZCBhIG1heCBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSBjYWxsZXJcbiAgICAgICAgaWYgKGlzUGxhY2UgJiYgdGhpcy5kYXRhLm1heERpc3RhbmNlICYmIHRoaXMuZGF0YS5tYXhEaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPiB0aGlzLmRhdGEubWF4RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gZGlzdGFuY2U7XG4gICAgfSxcblxuICAgIF9oYXZlcnNpbmVEaXN0OiBmdW5jdGlvbiAoc3JjLCBkZXN0KSB7XG4gICAgICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgICAgICB2YXIgYSA9IChNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpKSArIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKiBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgICAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgICAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIGNvbXBhc3MgaGVhZGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXRhXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb21wYXNzIGhlYWRpbmdcbiAgICAgKi9cbiAgICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hKSB7XG5cbiAgICAgICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAgICAgICAgdmFyIGFscGhhUmFkID0gYWxwaGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBiZXRhUmFkID0gYmV0YSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGVxdWF0aW9uIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIGNBID0gTWF0aC5jb3MoYWxwaGFSYWQpO1xuICAgICAgICB2YXIgc0EgPSBNYXRoLnNpbihhbHBoYVJhZCk7XG4gICAgICAgIHZhciBzQiA9IE1hdGguc2luKGJldGFSYWQpO1xuICAgICAgICB2YXIgY0cgPSBNYXRoLmNvcyhnYW1tYVJhZCk7XG4gICAgICAgIHZhciBzRyA9IE1hdGguc2luKGdhbW1hUmFkKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgQSwgQiwgQyByb3RhdGlvbiBjb21wb25lbnRzXG4gICAgICAgIHZhciByQSA9IC0gY0EgKiBzRyAtIHNBICogc0IgKiBjRztcbiAgICAgICAgdmFyIHJCID0gLSBzQSAqIHNHICsgY0EgKiBzQiAqIGNHO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBjb21wYXNzIGhlYWRpbmdcbiAgICAgICAgdmFyIGNvbXBhc3NIZWFkaW5nID0gTWF0aC5hdGFuKHJBIC8gckIpO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSBoYWxmIHVuaXQgY2lyY2xlIHRvIHdob2xlIHVuaXQgY2lyY2xlXG4gICAgICAgIGlmIChyQiA8IDApIHtcbiAgICAgICAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XG4gICAgICAgIH0gZWxzZSBpZiAockEgPCAwKSB7XG4gICAgICAgICAgICBjb21wYXNzSGVhZGluZyArPSAyICogTWF0aC5QSTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXG4gICAgICAgIGNvbXBhc3NIZWFkaW5nICo9IDE4MCAvIE1hdGguUEk7XG5cbiAgICAgICAgcmV0dXJuIGNvbXBhc3NIZWFkaW5nO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyIGZvciBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3kgPCA1MCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZyA9IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3dlYmtpdENvbXBhc3NBY2N1cmFjeSBpcyBldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5hbHBoYSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmFic29sdXRlID09PSB0cnVlIHx8IGV2ZW50LmFic29sdXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmcgPSB0aGlzLl9jb21wdXRlQ29tcGFzc0hlYWRpbmcoZXZlbnQuYWxwaGEsIGV2ZW50LmJldGEsIGV2ZW50LmdhbW1hKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdldmVudC5hYnNvbHV0ZSA9PT0gZmFsc2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignZXZlbnQuYWxwaGEgPT09IG51bGwnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdXNlciByb3RhdGlvbiBkYXRhLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3VwZGF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoZWFkaW5nID0gMzYwIC0gdGhpcy5oZWFkaW5nO1xuICAgICAgICB2YXIgY2FtZXJhUm90YXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncm90YXRpb24nKS55O1xuICAgICAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoLnJhZFRvRGVnKHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55KTtcbiAgICAgICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcbiAgICAgICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKG9mZnNldCk7XG4gICAgfSxcbiAgICBcbiAgICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcilcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSc7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLWVudGl0eS1wbGFjZScsIHtcbiAgICBfY2FtZXJhR3BzOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBsb25naXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JywgdGhpcy5jb29yZFNldExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZ3BzLWNhbWVyYV0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ3BzLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlRm9yTXNnID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhldi5kZXRhaWwucG9zaXRpb24sIGRzdENvb3Jkcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZScsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZU1zZycsIHRoaXMuX2Zvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG4gICAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdGlvbicsIHsgZGV0YWlsOiB7IGRpc3RhbmNlOiBkaXN0YW5jZUZvck1zZyB9IH0pKTtcblxuICAgICAgICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhldi5kZXRhaWwucG9zaXRpb24sIGRzdENvb3JkcywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChhY3R1YWxEaXN0YW5jZSA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXQnLCB0aGlzLmNvb3JkU2V0TGlzdGVuZXIpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb24nLCB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIpO1xuXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gMDtcblxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB7IGRldGFpbDogeyBjb21wb25lbnQ6IHRoaXMuZWwgfSB9KSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBIaWRlIGVudGl0eSBhY2NvcmRpbmcgdG8gbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBoaWRlRm9yTWluRGlzdGFuY2U6IGZ1bmN0aW9uKGVsLCBoaWRlRW50aXR5KSB7XG4gICAgICAgIGlmIChoaWRlRW50aXR5KSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAnZmFsc2UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBwbGFjZSBwb3NpdGlvblxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHsgeDogMCwgeTogdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJykueSB8fCAwLCB6OiAwIH1cblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24ueFxuICAgICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmRhdGEubG9uZ2l0dWRlLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgcG9zaXRpb24ueCA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcblxuICAgICAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IHBvc2l0aW9uLng7XG5cbiAgICAgICAgcG9zaXRpb24ueCAqPSB0aGlzLmRhdGEubG9uZ2l0dWRlID4gdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUgPyAxIDogLTE7XG5cbiAgICAgICAgLy8gdXBkYXRlIHBvc2l0aW9uLnpcbiAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLmxhdGl0dWRlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHBvc2l0aW9uLnogPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XG5cbiAgICAgICAgcG9zaXRpb24ueiAqPSB0aGlzLmRhdGEubGF0aXR1ZGUgPiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxhdGl0dWRlID8gLTEgOiAxO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbi55ICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgYWx0aXR1ZGUgPSB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmFsdGl0dWRlICE9PSB1bmRlZmluZWQgPyB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmFsdGl0dWRlIDogMDtcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBwb3NpdGlvbi55IC0gYWx0aXR1ZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIDNEIHdvcmxkXG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIEZvcm1hdCBkaXN0YW5jZXMgc3RyaW5nXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxuICAgICAgKi9cblxuICAgIF9mb3JtYXREaXN0YW5jZTogZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDApO1xuXG4gICAgICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gKGRpc3RhbmNlIC8gMTAwMCkgKyAnIGtpbG9tZXRlcnMnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlICsgJyBtZXRlcnMnO1xuICAgIH1cbn0pO1xuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtY2FtZXJhXG4gKlxuICogYmFzZWQgb24gdGhlIG9yaWdpbmFsIGdwcy1jYW1lcmEsIG1vZGlmaWVkIGJ5IG5pY2t3IDAyLzA0LzIwXG4gKlxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcbiAqIGVudGl0aWVzIG9yIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiwgdGhpcyB2ZXJzaW9uXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxuICpcbiAqIFRoZSBvcmlnaW5hbCBwb3NpdGlvbiAobGF0L2xvbikgaXMgcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZFxuICogc3RvcmVkLlxuICpcbiAqIFRoZW4sIHdoZW4gd2UgcmVjZWl2ZSBhIG5ldyBwb3NpdGlvbiAobGF0L2xvbiksIHRoaXMgbmV3IHBvc2l0aW9uIGlzXG4gKiBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgTWVyY2F0b3IgYW5kIHRoZW4gaXRzIHdvcmxkIHBvc2l0aW9uIGNhbGN1bGF0ZWRcbiAqIGJ5IGNvbXBhcmluZyBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBwb3NpdGlvbi5cbiAqXG4gKiBUaGUgc2FtZSBpcyBhbHNvIHRoZSBjYXNlIGZvciAnZW50aXR5LXBsYWNlcyc7IHdoZW4gdGhlc2UgYXJlIGFkZGVkLCB0aGVpclxuICogU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmUgY2FsY3VsYXRlZCAoc2VlIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlKS5cbiAqXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXG4gKiBmb3IgbWFueSBhcmVhcyBvZiB0aGUgd29ybGQgYW5kIGFwcGVhciBub3QgdG8gY2F1c2UgdW5hY2NlcHRhYmxlIGRpc3RvcnRpb25zXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxuICpcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSdcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdncHMtcHJvamVjdGVkLWNhbWVyYScsIHtcbiAgICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxuICAgIG9yaWdpbkNvb3JkczogbnVsbCwgLy8gb3JpZ2luYWwgY29vcmRzIG5vdyBpbiBTcGhlcmljYWwgTWVyY2F0b3JcbiAgICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICAgIGxvb2tDb250cm9sczogbnVsbCxcbiAgICBoZWFkaW5nOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBzaW11bGF0ZUxhdGl0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgIH0sXG4gICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9LFxuICAgICAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuXG4gICAgICAgICAgICAvLyByZS10cmlnZ2VyIGluaXRpYWxpemF0aW9uIGZvciBuZXcgb3JpZ2luXG4gICAgICAgICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsLmNvbXBvbmVudHNbJ2FyanMtbG9vay1jb250cm9scyddICYmICF0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2FyanMtbG9hZGVyJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5sb2FkZXIpO1xuXG4gICAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQpO1xuXG4gICAgICAgIHRoaXMubG9va0NvbnRyb2xzID0gdGhpcy5lbC5jb21wb25lbnRzWydhcmpzLWxvb2stY29udHJvbHMnXSB8fCB0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXTtcblxuICAgICAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gaWYgU2FmYXJpXG4gICAgICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgICAgICAgLy8gaU9TIDEzK1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uJylcbiAgICAgICAgICAgICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKCkgeyBoYW5kbGVyKCkgfSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbJ2FyanMnXS5fZGlzcGxheUVycm9yUG9wdXAoJ0FmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydhcmpzJ10uX2Rpc3BsYXlFcnJvclBvcHVwKCdQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy4nKTtcbiAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IHRoaXMuX2luaXRXYXRjaEdQUyhmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgICAgICBhbHRpdHVkZTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgICAgICAgICAgICAgICBhbHRpdHVkZUFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGVBY2N1cmFjeSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3Jkc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZihkaXN0TW92ZWQgPj0gdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlIHx8ICF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUm90YXRpb24oKTtcbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQgbmFtZSwgZGVwZW5kcyBvbiBicm93c2VyIGltcGxlbWVudGF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICAgKi9cbiAgICBfZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScgaW4gd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2RldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnXG4gICAgICAgIH0gZWxzZSBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb24nIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnJ1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tcGFzcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBldmVudE5hbWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uU3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICAgICAgICBvbkVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFUlJPUignICsgZXJyLmNvZGUgKyAnKTogJyArIGVyci5tZXNzYWdlKVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgZGVuaWVkIEdlb0xvY2F0aW9uLCBsZXQgdGhlaXIga25vdyB0aGF0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydhcmpzJ10uX2Rpc3BsYXlFcnJvclBvcHVwKCdQbGVhc2UgYWN0aXZhdGUgR2VvbG9jYXRpb24gYW5kIHJlZnJlc2ggdGhlIHBhZ2UuIElmIGl0IGlzIGFscmVhZHkgYWN0aXZlLCBwbGVhc2UgY2hlY2sgcGVybWlzc2lvbnMgZm9yIHRoaXMgd2Vic2l0ZS4nKTsgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zWydhcmpzJ10uX2Rpc3BsYXlFcnJvclBvcHVwKCdDYW5ub3QgcmV0cmlldmUgR1BTIHBvc2l0aW9uLiBTaWduYWwgaXMgYWJzZW50LicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnZ2VvbG9jYXRpb24nIGluIG5hdmlnYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG9uRXJyb3IoeyBjb2RlOiAwLCBtZXNzYWdlOiAnR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXInIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dlb2xvY2F0aW9uL3dhdGNoUG9zaXRpb25cbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwge1xuICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDI3MDAwLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHVzZXIgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBkb24ndCB1cGRhdGUgaWYgYWNjdXJhY3kgaXMgbm90IGdvb2QgZW5vdWdoXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPiB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5hbGVydCAmJiAhZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsZXJ0LXBvcHVwJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBwb3B1cC5pbm5lckhUTUwgPSAnR1BTIHNpZ25hbCBpcyB2ZXJ5IHBvb3IuIFRyeSBtb3ZlIG91dGRvb3Igb3IgdG8gYW4gYXJlYSB3aXRoIGEgYmV0dGVyIHNpZ25hbC4nXG4gICAgICAgICAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKCdpZCcsICdhbGVydC1wb3B1cCcpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxlcnQtcG9wdXAnKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA8PSB0aGlzLmRhdGEucG9zaXRpb25NaW5BY2N1cmFjeSAmJiBhbGVydFBvcHVwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGFsZXJ0UG9wdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgICAgICAgLy8gZmlyc3QgY2FtZXJhIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICAvLyBOb3cgc3RvcmUgb3JpZ2luQ29vcmRzIGFzIFBST0pFQ1RFRCBvcmlnaW5hbCBsYXQvbG9uLCBzbyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBjYW4gc2V0IHRoZSB3b3JsZCBvcmlnaW4gdG8gdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIFwibWV0cmVzXCJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gdGhpcy5fcHJvamVjdCh0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcmpzLWxvYWRlcicpO1xuICAgICAgICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICAgICAgICAgIGxvYWRlci5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjdXJyZW50IHBvc2l0aW9uIChpbiB3b3JsZCBjb29yZHMsIGJhc2VkIG9uIFNwaGVyaWNhbCBNZXJjYXRvcilcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF9zZXRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xuXG4gICAgICAgIHZhciB3b3JsZENvb3JkcyA9IHRoaXMubGF0TG9uVG9Xb3JsZCh0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUpO1xuXG4gICAgICAgIHBvc2l0aW9uLnggPSB3b3JsZENvb3Jkc1swXTtcbiAgICAgICAgcG9zaXRpb24ueiA9IHdvcmxkQ29vcmRzWzFdO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBwb3NpdGlvblxuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBwb3NpdGlvbik7XG5cbiAgICAgICAgLy8gYWRkIHRoZSBzcGhtZXJjIHBvc2l0aW9uIHRvIHRoZSBldmVudCAoZm9yIHRlc3Rpbmcgb25seSlcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHsgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSB9KSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIGNhbWVyYSBhbmQgZGVzdGluYXRpb24gaW5wdXQuXG4gICAgICpcbiAgICAgKiBBc3N1bWUgd2UgYXJlIHVzaW5nIGEgbWV0cmUtYmFzZWQgcHJvamVjdGlvbi4gTm90IGFsbCAnbWV0cmUtYmFzZWQnXG4gICAgICogcHJvamVjdGlvbnMgZ2l2ZSBleGFjdCBtZXRyZXMsIGUuZy4gU3BoZXJpY2FsIE1lcmNhdG9yLCBidXQgaXQgYXBwZWFyc1xuICAgICAqIGNsb3NlIGVub3VnaCB0byBiZSB1c2VkIGZvciBBUiBhdCBsZWFzdCBpbiBtaWRkbGUgdGVtcGVyYXRlXG4gICAgICogbGF0aXR1ZGVzICg0MCAtIDU1KS4gSXQgaXMgaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMsIGhvd2V2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICovXG4gICAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbihkZXN0LCBpc1BsYWNlKSB7XG4gICAgICAgIHZhciBzcmMgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuICAgICAgICB2YXIgZHggPSBkZXN0LnggLSBzcmMueDtcbiAgICAgICAgdmFyIGR6ID0gZGVzdC56IC0gc3JjLno7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHogKiBkeik7XG5cbiAgICAgICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gbmVhciBhbmQgYSBtaW4gZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgICAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgIG1ldGhvZCBjYWxsZXJcbiAgICAgICAgaWYgKGlzUGxhY2UgJiYgdGhpcy5kYXRhLm1pbkRpc3RhbmNlICYmIHRoaXMuZGF0YS5taW5EaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB0aGlzLmRhdGEubWluRGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGxhdGl0dWRlL2xvbmdpdHVkZSB0byBPcGVuR0wgd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICpcbiAgICAgKiBGaXJzdCBwcm9qZWN0cyBsYXQvbG9uIHRvIGFic29sdXRlIFNwaGVyaWNhbCBNZXJjYXRvciBhbmQgdGhlblxuICAgICAqIGNhbGN1bGF0ZXMgdGhlIHdvcmxkIGNvb3JkaW5hdGVzIGJ5IGNvbXBhcmluZyB0aGUgU3BoZXJpY2FsIE1lcmNhdG9yXG4gICAgICogY29vcmRpbmF0ZXMgd2l0aCB0aGUgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzIG9mIHRoZSBvcmlnaW4gcG9pbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGF0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2FycmF5fSB3b3JsZCBjb29yZGluYXRlc1xuICAgICAqL1xuICAgIGxhdExvblRvV29ybGQ6IGZ1bmN0aW9uKGxhdCwgbG9uKSB7XG4gICAgICAgIHZhciBwcm9qZWN0ZWQgPSB0aGlzLl9wcm9qZWN0KGxhdCwgbG9uKTtcbiAgICAgICAgLy8gU2lnbiBvZiB6IG5lZWRzIHRvIGJlIHJldmVyc2VkIGNvbXBhcmVkIHRvIHByb2plY3RlZCBjb29yZGluYXRlc1xuICAgICAgICByZXR1cm4gW3Byb2plY3RlZFswXSAtIHRoaXMub3JpZ2luQ29vcmRzWzBdLCAtKHByb2plY3RlZFsxXSAtIHRoaXMub3JpZ2luQ29vcmRzWzFdKV07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzLlxuICAgICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YXJyYXl9IFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlc1xuICAgICAqL1xuICAgIF9wcm9qZWN0OiBmdW5jdGlvbihsYXQsIGxvbikge1xuICAgICAgICBjb25zdCBIQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG5cbiAgICAgICAgLy8gQ29udmVydCB0aGUgc3VwcGxpZWQgY29vcmRzIHRvIFNwaGVyaWNhbCBNZXJjYXRvciAoRVBTRzozODU3KSwgYWxzb1xuICAgICAgICAvLyBrbm93biBhcyAnR29vZ2xlIFByb2plY3Rpb24nLCB1c2luZyB0aGUgYWxnb3JpdGhtIHVzZWQgZXh0ZW5zaXZlbHlcbiAgICAgICAgLy8gaW4gdmFyaW91cyBPcGVuU3RyZWV0TWFwIHNvZnR3YXJlLlxuICAgICAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCg5MCArIGxhdCkgKiBNYXRoLlBJIC8gMzYwLjApKSAvIChNYXRoLlBJIC8gMTgwLjApO1xuICAgICAgICByZXR1cm4gWyhsb24gLyAxODAuMCkgKiBIQUxGX0VBUlRILCB5ICogSEFMRl9FQVJUSCAvIDE4MC4wXTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyB0byBsYXRpdHVkZS9sb25naXR1ZGUuXG4gICAgICogQWxnb3JpdGhtIGlzIHVzZWQgaW4gc2V2ZXJhbCBPcGVuU3RyZWV0TWFwLXJlbGF0ZWQgYXBwbGljYXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBlYXN0aW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBub3J0aGluZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gbG9uL2xhdFxuICAgICAqL1xuICAgIF91bnByb2plY3Q6IGZ1bmN0aW9uKGUsIG4pIHtcbiAgICAgICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuICAgICAgICB2YXIgeXAgPSAobiAvIEhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IChlIC8gSEFMRl9FQVJUSCkgKiAxODAuMCxcbiAgICAgICAgICAgIGxhdGl0dWRlOiAxODAuMCAvIE1hdGguUEkgKiAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCh5cCAqIE1hdGguUEkgLyAxODAuMCkpIC0gTWF0aC5QSSAvIDIpXG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb21wdXRlIGNvbXBhc3MgaGVhZGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXRhXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb21wYXNzIGhlYWRpbmdcbiAgICAgKi9cbiAgICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbihhbHBoYSwgYmV0YSwgZ2FtbWEpIHtcblxuICAgICAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICAgICAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgZ2FtbWFSYWQgPSBnYW1tYSAqIChNYXRoLlBJIC8gMTgwKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgICAgICB2YXIgY0EgPSBNYXRoLmNvcyhhbHBoYVJhZCk7XG4gICAgICAgIHZhciBzQSA9IE1hdGguc2luKGFscGhhUmFkKTtcbiAgICAgICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgICAgIHZhciBjRyA9IE1hdGguY29zKGdhbW1hUmFkKTtcbiAgICAgICAgdmFyIHNHID0gTWF0aC5zaW4oZ2FtbWFSYWQpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIHJBID0gLSBjQSAqIHNHIC0gc0EgKiBzQiAqIGNHO1xuICAgICAgICB2YXIgckIgPSAtIHNBICogc0cgKyBjQSAqIHNCICogY0c7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNvbXBhc3MgaGVhZGluZ1xuICAgICAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcbiAgICAgICAgaWYgKHJCIDwgMCkge1xuICAgICAgICAgICAgY29tcGFzc0hlYWRpbmcgKz0gTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgICAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAgICAgICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgICAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgZm9yIGRldmljZSBvcmllbnRhdGlvbiBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX29uRGV2aWNlT3JpZW50YXRpb246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5IDwgNTApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCd3ZWJraXRDb21wYXNzQWNjdXJhY3kgaXMgZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWxwaGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBldmVudC5hYnNvbHV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKGV2ZW50LmFscGhhLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2V2ZW50LmFscGhhID09PSBudWxsJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHVzZXIgcm90YXRpb24gZGF0YS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWFkaW5nID0gMzYwIC0gdGhpcy5oZWFkaW5nO1xuICAgICAgICB2YXIgY2FtZXJhUm90YXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncm90YXRpb24nKS55O1xuICAgICAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoLnJhZFRvRGVnKHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55KTtcbiAgICAgICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcbiAgICAgICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKG9mZnNldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICAgKlxuICAgICAqIFRha2VuIGZyb20gZ3BzLWNhbWVyYVxuICAgICAqL1xuICAgIF9oYXZlcnNpbmVEaXN0OiBmdW5jdGlvbihzcmMsIGRlc3QpIHtcbiAgICAgICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgICAgIHZhciBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgICAgIHZhciBhID0gKE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikpICsgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICogKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgICAgIHZhciBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gICAgfSxcblxuICAgIF9vbkdwc0VudGl0eVBsYWNlQWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBpZiBwbGFjZXMgYXJlIGFkZGVkIGFmdGVyIGNhbWVyYSBpbml0aWFsaXphdGlvbiBpcyBmaW5pc2hlZFxuICAgICAgICBpZiAodGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxvYWRlciAmJiB0aGlzLmxvYWRlci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubG9hZGVyKVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbiIsIi8qKiBncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZVxuICpcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtZW50aXR5LXBsYWNlLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxuICpcbiAqIFJhdGhlciB0aGFuIGtlZXBpbmcgdHJhY2sgb2YgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlIGRpc3RhbmNlIG9mXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgbG9jYXRpb24gb24gc3RhcnR1cCAobGF0L2xvbikgaXMgcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIFxuICogTWVyY2F0b3IgYW5kIHN0b3JlZC5cbiAqXG4gKiBXaGVuICdlbnRpdHktcGxhY2VzJyBhcmUgYWRkZWQsIHRoZWlyIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZHMgYXJlIFxuICogY2FsY3VsYXRlZCBhbmQgY29udmVydGVkIGludG8gd29ybGQgY29vcmRpbmF0ZXMsIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbFxuICogcG9zaXRpb24sIHVzaW5nIHRoZSBTcGhlcmljYWwgTWVyY2F0b3IgcHJvamVjdGlvbiBjYWxjdWxhdGlvbiBpblxuICogZ3BzLXByb2plY3RlZC1jYW1lcmEuXG4gKlxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcbiAqIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLiBOb25ldGhlbGVzcyB0aGV5IGFyZSBhIGdvb2QgYXBwcm94aW1hdGlvblxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cbiAqL1xuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSdcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZScsIHtcbiAgICBfY2FtZXJhR3BzOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBsb25naXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb24nLCB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIpO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFVzZWQgbm93IHRvIGdldCB0aGUgR1BTIGNhbWVyYSB3aGVuIGl0J3MgYmVlbiBzZXR1cFxuICAgICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZ3BzLXByb2plY3RlZC1jYW1lcmFdJyk7XG4gICAgICAgICAgICAgICAgaWYgKCFjYW1lcmEuY29tcG9uZW50c1snZ3BzLXByb2plY3RlZC1jYW1lcmEnXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdncHMtcHJvamVjdGVkLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzWydncHMtcHJvamVjdGVkLWNhbWVyYSddO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuXG5cbiAgICAgICAgLy8gdXBkYXRlIHBvc2l0aW9uIG5lZWRzIHRvIHdvcnJ5IGFib3V0IGRpc3RhbmNlIGJ1dCBub3RoaW5nIGVsc2U/XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRzdENvb3JkcyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xuXG4gICAgICAgICAgICAvLyBpdCdzIGFjdHVhbGx5IGEgJ2Rpc3RhbmNlIHBsYWNlJywgYnV0IHdlIGRvbid0IGNhbGwgaXQgd2l0aCBsYXN0IHBhcmFtLCBiZWNhdXNlIHdlIHdhbnQgdG8gcmV0cmlldmUgZGlzdGFuY2UgZXZlbiBpZiBpdCdzIDwgbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICAgICAgICAgIC8vIF9jb21wdXRlRGlzdGFuY2VNZXRlcnMgaXMgbm93IGdvaW5nIHRvIHVzZSB0aGUgcHJvamVjdGVkXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2VGb3JNc2cgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGRzdENvb3Jkcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZScsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZU1zZycsIHRoaXMuX2Zvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1lbnRpdHktcGxhY2UtdXBkYXRlLXBvc2l0aW9uJywgeyBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0gfSkpO1xuXG4gICAgICAgICAgICB2YXIgYWN0dWFsRGlzdGFuY2UgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGRzdENvb3JkcywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChhY3R1YWxEaXN0YW5jZSA9PT0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldGFpbiBhcyB0aGlzIGV2ZW50IGlzIGZpcmVkIHdoZW4gdGhlIEdQUyBjYW1lcmEgaXMgc2V0IHVwXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXQnLCB0aGlzLmNvb3JkU2V0TGlzdGVuZXIpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb24nLCB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIpO1xuXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gMDtcblxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB7IGRldGFpbDogeyBjb21wb25lbnQ6IHRoaXMuZWwgfSB9KSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBIaWRlIGVudGl0eSBhY2NvcmRpbmcgdG8gbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBoaWRlRm9yTWluRGlzdGFuY2U6IGZ1bmN0aW9uKGVsLCBoaWRlRW50aXR5KSB7XG4gICAgICAgIGlmIChoaWRlRW50aXR5KSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAnZmFsc2UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBwbGFjZSBwb3NpdGlvblxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuXG4gICAgLy8gc2V0IHBvc2l0aW9uIHRvIHdvcmxkIGNvb3JkcyB1c2luZyB0aGUgbGF0L2xvbiBcbiAgICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgd29ybGRQb3MgPSB0aGlzLl9jYW1lcmFHcHMubGF0TG9uVG9Xb3JsZCh0aGlzLmRhdGEubGF0aXR1ZGUsIHRoaXMuZGF0YS5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTtcblxuICAgICAgICAvLyB1cGRhdGUgZWxlbWVudCdzIHBvc2l0aW9uIGluIDNEIHdvcmxkXG4gICAgICAgIC8vdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCB7XG4gICAgICAgICAgICB4OiB3b3JsZFBvc1swXSxcbiAgICAgICAgICAgIHk6IHBvc2l0aW9uLnksIFxuICAgICAgICAgICAgejogd29ybGRQb3NbMV1cbiAgICAgICAgfSk7IFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRpc3RhbmNlXG4gICAgICAqL1xuXG4gICAgX2Zvcm1hdERpc3RhbmNlOiBmdW5jdGlvbihkaXN0YW5jZSkge1xuICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMCk7XG5cbiAgICAgICAgaWYgKGRpc3RhbmNlID49IDEwMDApIHtcbiAgICAgICAgICAgIHJldHVybiAoZGlzdGFuY2UgLyAxMDAwKSArICcga2lsb21ldGVycyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzdGFuY2UgKyAnIG1ldGVycyc7XG4gICAgfVxufSk7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL2FyanMtbG9vay1jb250cm9scydcbmltcG9ydCAnLi9hcmpzLXdlYmNhbS10ZXh0dXJlJ1xuaW1wb3J0ICcuL0FyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzJ1xuaW1wb3J0ICcuL2dwcy1jYW1lcmEnXG5pbXBvcnQgJy4vZ3BzLWVudGl0eS1wbGFjZSdcbmltcG9ydCAnLi9ncHMtcHJvamVjdGVkLWNhbWVyYSdcbmltcG9ydCAnLi9ncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZSdcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==