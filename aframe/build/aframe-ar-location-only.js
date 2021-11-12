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
      magicWindowControls = this.magicWindowControls = new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__.default(this.magicWindowObject);
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
            .catch(e => { alert(`Webcam error: ${e}`); });
        } else {
            alert('sorry - media devices API not supported');
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

                alert('After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function () {
                    alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
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
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
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
            this.el.setAttribute('distanceMsg', formatDistance(distanceForMsg));
            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-positon', { detail: { distance: distanceForMsg } }));

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
});

/**
 * Format distances string
 *
 * @param {String} distance
 */
function formatDistance(distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
        return (distance / 1000) + ' kilometers';
    }

    return distance + ' meters';
};


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

                alert('After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function() {
                    alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
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
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
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
            this.el.setAttribute('distanceMsg', formatDistance(distanceForMsg));

            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-positon', { detail: { distance: distanceForMsg } }));

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
});

/**
 * Format distances string
 *
 * @param {String} distance
 */
function formatDistance(distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
        return (distance / 1000) + ' kilometers';
    }

    return distance + ' meters';
};


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLWxvb2stY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiYWZyYW1lXCIsXCJjb21tb25qczJcIjpcImFmcmFtZVwiLFwiYW1kXCI6XCJhZnJhbWVcIixcInJvb3RcIjpcIkFGUkFNRVwifSIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRStCOztBQUUvQjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsdUJBQXVCOztBQUV2Qjs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLGtCQUFrQiwwQ0FBYTs7QUFFL0Isb0JBQW9CLHdDQUFXOztBQUUvQixpQkFBaUIsNkNBQWdCOztBQUVqQyxpQkFBaUIsNkNBQWdCLCtDQUErQzs7QUFFaEY7O0FBRUEsK0NBQStDOztBQUUvQyx1Q0FBdUM7O0FBRXZDLGdDQUFnQzs7QUFFaEMsa0VBQWtFOztBQUVsRTs7QUFFQSxHQUFHOztBQUVIOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpQ0FBaUMsZ0RBQW1CLHlDQUF5Qzs7QUFFN0YsK0JBQStCLGdEQUFtQixvQkFBb0I7O0FBRXRFLGlDQUFpQyxnREFBbUIscUJBQXFCOztBQUV6RSw2Q0FBNkMsZ0RBQW1CLGdDQUFnQzs7QUFFaEc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FB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Q0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzRkFBc0YsVUFBVSwyQkFBMkIsRUFBRTs7QUFFN0g7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHdFQUF3RSxVQUFVLHFCQUFxQixFQUFFO0FBQ3pHLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLEU7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3JJQSxvRDs7Ozs7Ozs7OztBQ0FBLG1EOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBQ0M7QUFDVTtBQUNuQjtBQUNNO0FBQ0k7QUFDTSIsImZpbGUiOiJhZnJhbWUtYXItbG9jYXRpb24tb25seS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImFmcmFtZVwiLCBcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkFSanNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiQVJqc1wiXSA9IGZhY3Rvcnkocm9vdFtcIkFGUkFNRVwiXSwgcm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykge1xucmV0dXJuICIsIlxuLyoqXG4gKiBAYXV0aG9yIHJpY2h0IC8gaHR0cDovL3JpY2h0Lm1lXG4gKiBAYXV0aG9yIFdlc3RMYW5nbGV5IC8gaHR0cDovL2dpdGh1Yi5jb20vV2VzdExhbmdsZXlcbiAqXG4gKiBXM0MgRGV2aWNlIE9yaWVudGF0aW9uIGNvbnRyb2wgKGh0dHA6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWwpXG4gKi9cblxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdG8gXG4gKiBhbGxvdyBleHBvbmVudGlhbCBzbW9vdGhpbmcsIGZvciB1c2UgaW4gQVIuanMuXG4gKlxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcbiAqL1xuXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY29uc3QgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgPSBmdW5jdGlvbiAoIG9iamVjdCApIHtcblxuICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICB0aGlzLm9iamVjdC5yb3RhdGlvbi5yZW9yZGVyKCAnWVhaJyApO1xuXG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgdGhpcy5kZXZpY2VPcmllbnRhdGlvbiA9IHt9O1xuICB0aGlzLnNjcmVlbk9yaWVudGF0aW9uID0gMDtcblxuICB0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xuXG4gIHRoaXMuc21vb3RoaW5nRmFjdG9yID0gMTtcblxuICB0aGlzLlRXT19QSSA9IDIgKiBNYXRoLlBJO1xuICB0aGlzLkhBTEZfUEkgPSAwLjUgKiBNYXRoLlBJO1xuXG4gIHZhciBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXG4gICAgc2NvcGUuZGV2aWNlT3JpZW50YXRpb24gPSBldmVudDtcblxuICB9O1xuXG4gIHZhciBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuXG4gIH07XG5cbiAgLy8gVGhlIGFuZ2xlcyBhbHBoYSwgYmV0YSBhbmQgZ2FtbWEgZm9ybSBhIHNldCBvZiBpbnRyaW5zaWMgVGFpdC1CcnlhbiBhbmdsZXMgb2YgdHlwZSBaLVgnLVknJ1xuXG4gIHZhciBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHplZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAxICk7XG5cbiAgICB2YXIgZXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcblxuICAgIHZhciBxMCA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XG5cbiAgICB2YXIgcTEgPSBuZXcgVEhSRUUuUXVhdGVybmlvbiggLSBNYXRoLnNxcnQoIDAuNSApLCAwLCAwLCBNYXRoLnNxcnQoIDAuNSApICk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICggcXVhdGVybmlvbiwgYWxwaGEsIGJldGEsIGdhbW1hLCBvcmllbnQgKSB7XG5cbiAgICAgIGV1bGVyLnNldCggYmV0YSwgYWxwaGEsIC0gZ2FtbWEsICdZWFonICk7IC8vICdaWFknIGZvciB0aGUgZGV2aWNlLCBidXQgJ1lYWicgZm9yIHVzXG5cbiAgICAgIHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKCBldWxlciApOyAvLyBvcmllbnQgdGhlIGRldmljZVxuXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KCBxMSApOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkoIHEwLnNldEZyb21BeGlzQW5nbGUoIHplZSwgLSBvcmllbnQgKSApOyAvLyBhZGp1c3QgZm9yIHNjcmVlbiBvcmllbnRhdGlvblxuXG4gICAgfTtcblxuICB9KCk7XG5cbiAgdGhpcy5jb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuIFxuICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdvcmllbnRhdGlvbmNoYW5nZScsIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCwgZmFsc2UgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2RldmljZW9yaWVudGF0aW9uJywgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LCBmYWxzZSApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG5cbiAgfTtcblxuICB0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ29yaWVudGF0aW9uY2hhbmdlJywgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LCBmYWxzZSApO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnZGV2aWNlb3JpZW50YXRpb24nLCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsIGZhbHNlICk7XG5cbiAgICBzY29wZS5lbmFibGVkID0gZmFsc2U7XG5cbiAgfTtcblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICggc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cbiAgICB2YXIgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XG5cbiAgICBpZiAoIGRldmljZSApIHtcblxuICAgICAgdmFyIGFscGhhID0gZGV2aWNlLmFscGhhID8gVEhSRUUuTWF0aC5kZWdUb1JhZCggZGV2aWNlLmFscGhhICkgKyBzY29wZS5hbHBoYU9mZnNldCA6IDA7IC8vIFpcblxuICAgICAgdmFyIGJldGEgPSBkZXZpY2UuYmV0YSA/IFRIUkVFLk1hdGguZGVnVG9SYWQoIGRldmljZS5iZXRhICkgOiAwOyAvLyBYJ1xuXG4gICAgICB2YXIgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKCBkZXZpY2UuZ2FtbWEgKSA6IDA7IC8vIFknJ1xuXG4gICAgICB2YXIgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKCBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiApIDogMDsgLy8gT1xuXG4gICAgICAvLyBOVyBBZGRlZCBzbW9vdGhpbmcgY29kZVxuICAgICAgdmFyIGsgPSB0aGlzLnNtb290aGluZ0ZhY3RvcjtcblxuICAgICAgaWYodGhpcy5sYXN0T3JpZW50YXRpb24pIHtcbiAgICAgICAgYWxwaGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKGFscGhhLCB0aGlzLmxhc3RPcmllbnRhdGlvbi5hbHBoYSwgayk7XG4gICAgICAgIGJldGEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKGJldGEgKyBNYXRoLlBJLCB0aGlzLmxhc3RPcmllbnRhdGlvbi5iZXRhLCBrKTtcbiAgICAgICAgZ2FtbWEgPSB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlKGdhbW1hICsgdGhpcy5IQUxGX1BJLCB0aGlzLmxhc3RPcmllbnRhdGlvbi5nYW1tYSwgaywgTWF0aC5QSSk7XG4gICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZXRhICs9IE1hdGguUEk7XG4gICAgICAgIGdhbW1hICs9IHRoaXMuSEFMRl9QSTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XG4gICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgYmV0YTogYmV0YSxcbiAgICAgICAgZ2FtbWE6IGdhbW1hXG4gICAgICB9O1xuICAgICAgc2V0T2JqZWN0UXVhdGVybmlvbiggc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sIGFscGhhLCBiZXRhIC0gTWF0aC5QSSwgZ2FtbWEgLSB0aGlzLkhBTEZfUEksIG9yaWVudCApO1xuXG4gICAgfVxuICB9O1xuXG4gICBcbiAgIC8vIE5XIEFkZGVkXG4gIHRoaXMuX29yZGVyQW5nbGUgPSBmdW5jdGlvbihhLCBiLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgaWYgKChiID4gYSAmJiBNYXRoLmFicyhiIC0gYSkgPCByYW5nZSAvIDIpIHx8IChhID4gYiAmJiBNYXRoLmFicyhiIC0gYSkgPiByYW5nZSAvIDIpKSB7XG4gICAgICByZXR1cm4geyBsZWZ0OiBhLCByaWdodDogYiB9XG4gICAgfSBlbHNlIHsgXG4gICAgICByZXR1cm4geyBsZWZ0OiBiLCByaWdodDogYSB9XG4gICAgfVxuICB9O1xuXG4gICAvLyBOVyBBZGRlZFxuICB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlID0gZnVuY3Rpb24oYSwgYiwgaywgcmFuZ2UgPSB0aGlzLlRXT19QSSkge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHRoaXMuX29yZGVyQW5nbGUoYSwgYiwgcmFuZ2UpO1xuICAgIGNvbnN0IGFuZ2xlc2hpZnQgPSBhbmdsZXMubGVmdDtcbiAgICBjb25zdCBvcmlnQW5nbGVzUmlnaHQgPSBhbmdsZXMucmlnaHQ7XG4gICAgYW5nbGVzLmxlZnQgPSAwO1xuICAgIGFuZ2xlcy5yaWdodCAtPSBhbmdsZXNoaWZ0O1xuICAgIGlmKGFuZ2xlcy5yaWdodCA8IDApIGFuZ2xlcy5yaWdodCArPSByYW5nZTtcbiAgICBsZXQgbmV3YW5nbGUgPSBvcmlnQW5nbGVzUmlnaHQgPT0gYiA/ICgxIC0gaykqYW5nbGVzLnJpZ2h0ICsgayAqIGFuZ2xlcy5sZWZ0IDogayAqIGFuZ2xlcy5yaWdodCArICgxIC0gaykgKiBhbmdsZXMubGVmdDtcbiAgICBuZXdhbmdsZSArPSBhbmdsZXNoaWZ0O1xuICAgIGlmKG5ld2FuZ2xlID49IHJhbmdlKSBuZXdhbmdsZSAtPSByYW5nZTtcbiAgICByZXR1cm4gbmV3YW5nbGU7XG4gIH07XG5cbiAgdGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHNjb3BlLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICB0aGlzLmNvbm5lY3QoKTtcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHM7XG4iLCIvLyBUbyBhdm9pZCByZWNhbGN1bGF0aW9uIGF0IGV2ZXJ5IG1vdXNlIG1vdmVtZW50IHRpY2tcbnZhciBQSV8yID0gTWF0aC5QSSAvIDI7XG5cblxuLyoqXG4gKiBsb29rLWNvbnRyb2xzLiBVcGRhdGUgZW50aXR5IHBvc2UsIGZhY3RvcmluZyBtb3VzZSwgdG91Y2gsIGFuZCBXZWJWUiBBUEkgZGF0YS5cbiAqL1xuXG4vKiBOT1RFIHRoYXQgdGhpcyBpcyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgQS1GcmFtZSdzIGxvb2stY29udHJvbHMgdG8gXG4gKiBhbGxvdyBleHBvbmVudGlhbCBzbW9vdGhpbmcsIGZvciB1c2UgaW4gQVIuanMuXG4gKlxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSAnYWZyYW1lJ1xuaW1wb3J0IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIGZyb20gJy4vQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMnXG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnYXJqcy1sb29rLWNvbnRyb2xzJywge1xuICBkZXBlbmRlbmNpZXM6IFsncG9zaXRpb24nLCAncm90YXRpb24nXSxcblxuICBzY2hlbWE6IHtcbiAgICBlbmFibGVkOiB7ZGVmYXVsdDogdHJ1ZX0sXG4gICAgbWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ6IHtkZWZhdWx0OiB0cnVlfSxcbiAgICBwb2ludGVyTG9ja0VuYWJsZWQ6IHtkZWZhdWx0OiBmYWxzZX0sXG4gICAgcmV2ZXJzZU1vdXNlRHJhZzoge2RlZmF1bHQ6IGZhbHNlfSxcbiAgICByZXZlcnNlVG91Y2hEcmFnOiB7ZGVmYXVsdDogZmFsc2V9LFxuICAgIHRvdWNoRW5hYmxlZDoge2RlZmF1bHQ6IHRydWV9LFxuICAgIHNtb290aGluZ0ZhY3RvcjogeyB0eXBlOiAnbnVtYmVyJywgZGVmYXVsdDogMSB9XG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGVsdGFZYXcgPSAwO1xuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5obWRRdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlciA9IG5ldyBUSFJFRS5FdWxlcigpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd09iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMucm90YXRpb24gPSB7fTtcbiAgICB0aGlzLmRlbHRhUm90YXRpb24gPSB7fTtcbiAgICB0aGlzLnNhdmVkUG9zZSA9IG51bGw7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gICAgdGhpcy5zZXR1cE1vdXNlQ29udHJvbHMoKTtcbiAgICB0aGlzLmJpbmRNZXRob2RzKCk7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQgPSB7fTtcblxuICAgIHRoaXMuc2V0dXBNYWdpY1dpbmRvd0NvbnRyb2xzKCk7XG5cbiAgICAvLyBUbyBzYXZlIC8gcmVzdG9yZSBjYW1lcmEgcG9zZVxuICAgIHRoaXMuc2F2ZWRQb3NlID0ge1xuICAgICAgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKCksXG4gICAgICByb3RhdGlvbjogbmV3IFRIUkVFLkV1bGVyKClcbiAgICB9O1xuXG4gICAgLy8gQ2FsbCBlbnRlciBWUiBoYW5kbGVyIGlmIHRoZSBzY2VuZSBoYXMgZW50ZXJlZCBWUiBiZWZvcmUgdGhlIGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZC5cbiAgICBpZiAodGhpcy5lbC5zY2VuZUVsLmlzKCd2ci1tb2RlJykpIHsgdGhpcy5vbkVudGVyVlIoKTsgfVxuICB9LFxuXG4gIHNldHVwTWFnaWNXaW5kb3dDb250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWdpY1dpbmRvd0NvbnRyb2xzO1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuXG4gICAgLy8gT25seSBvbiBtb2JpbGUgZGV2aWNlcyBhbmQgb25seSBlbmFibGVkIGlmIERldmljZU9yaWVudGF0aW9uIHBlcm1pc3Npb24gaGFzIGJlZW4gZ3JhbnRlZC5cbiAgICBpZiAoQUZSQU1FLnV0aWxzLmRldmljZS5pc01vYmlsZSgpKSB7XG4gICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzID0gdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzID0gbmV3IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzKHRoaXMubWFnaWNXaW5kb3dPYmplY3QpO1xuICAgICAgaWYgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKSB7XG4gICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5lbC5zY2VuZUVsLmNvbXBvbmVudHNbJ2RldmljZS1vcmllbnRhdGlvbi1wZXJtaXNzaW9uLXVpJ10ucGVybWlzc2lvbkdyYW50ZWQpIHtcbiAgICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbnBlcm1pc3Npb25ncmFudGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICAvLyBEaXNhYmxlIGdyYWIgY3Vyc29yIGNsYXNzZXMgaWYgbm8gbG9uZ2VyIGVuYWJsZWQuXG4gICAgaWYgKGRhdGEuZW5hYmxlZCAhPT0gb2xkRGF0YS5lbmFibGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUdyYWJDdXJzb3IoZGF0YS5lbmFibGVkKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBtYWdpYyB3aW5kb3cgZXVsZXJzIGlmIHRyYWNraW5nIGlzIGRpc2FibGVkLlxuICAgIGlmIChvbGREYXRhICYmICFkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkICYmIG9sZERhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQpIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnNldCgwLCAwLCAwKTtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnNldCgwLCAwLCAwKTtcbiAgICB9XG5cbiAgICAvLyBQYXNzIG9uIG1hZ2ljIHdpbmRvdyB0cmFja2luZyBzZXR0aW5nIHRvIG1hZ2ljV2luZG93Q29udHJvbHMuXG4gICAgaWYgKHRoaXMubWFnaWNXaW5kb3dDb250cm9scykge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLnNtb290aGluZ0ZhY3RvciA9IGRhdGEuc21vb3RoaW5nRmFjdG9yO1xuICAgIH1cblxuICAgIGlmIChvbGREYXRhICYmICFkYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCAhPT0gb2xkRGF0YS5wb2ludGVyTG9ja0VuYWJsZWQpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHsgdGhpcy5leGl0UG9pbnRlckxvY2soKTsgfVxuICAgIH1cbiAgfSxcblxuICB0aWNrOiBmdW5jdGlvbiAodCkge1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgIGlmICghZGF0YS5lbmFibGVkKSB7IHJldHVybjsgfVxuICAgIHRoaXMudXBkYXRlT3JpZW50YXRpb24oKTtcbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHsgdGhpcy5leGl0UG9pbnRlckxvY2soKTsgfVxuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7IHRoaXMuZXhpdFBvaW50ZXJMb2NrKCk7IH1cbiAgfSxcblxuICBiaW5kTWV0aG9kczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub25Nb3VzZURvd24gPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VEb3duLCB0aGlzKTtcbiAgICB0aGlzLm9uTW91c2VNb3ZlID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlTW92ZSwgdGhpcyk7XG4gICAgdGhpcy5vbk1vdXNlVXAgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VVcCwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoU3RhcnQgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hTdGFydCwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoTW92ZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaE1vdmUsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaEVuZCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XG4gICAgdGhpcy5vbkVudGVyVlIgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uRW50ZXJWUiwgdGhpcyk7XG4gICAgdGhpcy5vbkV4aXRWUiA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25FeGl0VlIsIHRoaXMpO1xuICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSwgdGhpcyk7XG4gICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uUG9pbnRlckxvY2tFcnJvciwgdGhpcyk7XG4gIH0sXG5cbiAvKipcbiAgKiBTZXQgdXAgc3RhdGVzIGFuZCBPYmplY3QzRHMgbmVlZGVkIHRvIHN0b3JlIHJvdGF0aW9uIGRhdGEuXG4gICovXG4gIHNldHVwTW91c2VDb250cm9sczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5waXRjaE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMueWF3T2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy55YXdPYmplY3QucG9zaXRpb24ueSA9IDEwO1xuICAgIHRoaXMueWF3T2JqZWN0LmFkZCh0aGlzLnBpdGNoT2JqZWN0KTtcbiAgfSxcblxuICAvKipcbiAgICogQWRkIG1vdXNlIGFuZCB0b3VjaCBldmVudCBsaXN0ZW5lcnMgdG8gY2FudmFzLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsLmNhbnZhcztcblxuICAgIC8vIFdhaXQgZm9yIGNhbnZhcyB0byBsb2FkLlxuICAgIGlmICghY2FudmFzRWwpIHtcbiAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcigncmVuZGVyLXRhcmdldC1sb2FkZWQnLCBBRlJBTUUudXRpbHMuYmluZCh0aGlzLmFkZEV2ZW50TGlzdGVuZXJzLCB0aGlzKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTW91c2UgZXZlbnRzLlxuICAgIGNhbnZhc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgIC8vIFRvdWNoIGV2ZW50cy5cbiAgICBjYW52YXNFbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vblRvdWNoU3RhcnQpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXG4gICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdlbnRlci12cicsIHRoaXMub25FbnRlclZSKTtcbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2V4aXQtdnInLCB0aGlzLm9uRXhpdFZSKTtcblxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXG4gICAgaWYgKHRoaXMuZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrY2hhbmdlJywgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pwb2ludGVybG9ja2NoYW5nZScsIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSwgZmFsc2UpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxvY2tlcnJvcicsIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLCBmYWxzZSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyBmcm9tIGNhbnZhcy5cbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbCAmJiBzY2VuZUVsLmNhbnZhcztcblxuICAgIGlmICghY2FudmFzRWwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBNb3VzZSBldmVudHMuXG4gICAgY2FudmFzRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bik7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxuICAgIGNhbnZhc0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICAvLyBzY2VuZUVsIGV2ZW50cy5cbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2VudGVyLXZyJywgdGhpcy5vbkVudGVyVlIpO1xuICAgIHNjZW5lRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXhpdC12cicsIHRoaXMub25FeGl0VlIpO1xuXG4gICAgLy8gUG9pbnRlciBMb2NrIGV2ZW50cy5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybG9ja2NoYW5nZScsIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21venBvaW50ZXJsb2NrY2hhbmdlJywgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxvY2tlcnJvcicsIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLCBmYWxzZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvcmllbnRhdGlvbiBmb3IgbW9iaWxlLCBtb3VzZSBkcmFnLCBhbmQgaGVhZHNldC5cbiAgICogTW91c2UtZHJhZyBvbmx5IGVuYWJsZWQgaWYgSE1EIGlzIG5vdCBhY3RpdmUuXG4gICAqL1xuICB1cGRhdGVPcmllbnRhdGlvbjogKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zZU1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9iamVjdDNEID0gdGhpcy5lbC5vYmplY3QzRDtcbiAgICAgIHZhciBwaXRjaE9iamVjdCA9IHRoaXMucGl0Y2hPYmplY3Q7XG4gICAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XG4gICAgICB2YXIgcG9zZTtcbiAgICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuXG4gICAgICAvLyBJbiBWUiBtb2RlLCBUSFJFRSBpcyBpbiBjaGFyZ2Ugb2YgdXBkYXRpbmcgdGhlIGNhbWVyYSBwb3NlLlxuICAgICAgaWYgKHNjZW5lRWwuaXMoJ3ZyLW1vZGUnKSAmJiBzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XG4gICAgICAgIC8vIFdpdGggV2ViWFIgVEhSRUUgYXBwbGllcyBoZWFkc2V0IHBvc2UgdG8gdGhlIG9iamVjdDNEIG1hdHJpeFdvcmxkIGludGVybmFsbHkuXG4gICAgICAgIC8vIFJlZmxlY3QgdmFsdWVzIGJhY2sgb24gcG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSBmb3IgZ2V0QXR0cmlidXRlIHRvIHJldHVybiB0aGUgZXhwZWN0ZWQgdmFsdWVzLlxuICAgICAgICBpZiAoc2NlbmVFbC5oYXNXZWJYUikge1xuICAgICAgICAgIHBvc2UgPSBzY2VuZUVsLnJlbmRlcmVyLnhyLmdldENhbWVyYVBvc2UoKTtcbiAgICAgICAgICBpZiAocG9zZSkge1xuICAgICAgICAgICAgcG9zZU1hdHJpeC5lbGVtZW50cyA9IHBvc2UudHJhbnNmb3JtLm1hdHJpeDtcbiAgICAgICAgICAgIHBvc2VNYXRyaXguZGVjb21wb3NlKG9iamVjdDNELnBvc2l0aW9uLCBvYmplY3QzRC5yb3RhdGlvbiwgb2JqZWN0M0Quc2NhbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlTWFnaWNXaW5kb3dPcmllbnRhdGlvbigpO1xuXG4gICAgICAvLyBPbiBtb2JpbGUsIGRvIGNhbWVyYSByb3RhdGlvbiB3aXRoIHRvdWNoIGV2ZW50cyBhbmQgc2Vuc29ycy5cbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnggPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci54ICsgcGl0Y2hPYmplY3Qucm90YXRpb24ueDtcbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnkgPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci55ICsgeWF3T2JqZWN0LnJvdGF0aW9uLnk7XG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi56ID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIuejtcbiAgICB9O1xuICB9KSgpLFxuXG4gIHVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyID0gdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXI7XG4gICAgdmFyIG1hZ2ljV2luZG93RGVsdGFFdWxlciA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyO1xuICAgIC8vIENhbGN1bGF0ZSBtYWdpYyB3aW5kb3cgSE1EIHF1YXRlcm5pb24uXG4gICAgaWYgKHRoaXMubWFnaWNXaW5kb3dDb250cm9scyAmJiB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnNldEZyb21RdWF0ZXJuaW9uKHRoaXMubWFnaWNXaW5kb3dPYmplY3QucXVhdGVybmlvbiwgJ1lYWicpO1xuICAgICAgaWYgKCF0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgJiYgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnkgIT09IDApIHtcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3KSB7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci54ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLng7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci55ICs9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55IC0gdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3O1xuICAgICAgICBtYWdpY1dpbmRvd0RlbHRhRXVsZXIueiA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci56O1xuICAgICAgICB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBtb3VzZSBkcmFnIGludG8gcm90YXRpb24uXG4gICAqXG4gICAqIERyYWdnaW5nIHVwIGFuZCBkb3duIHJvdGF0ZXMgdGhlIGNhbWVyYSBhcm91bmQgdGhlIFgtYXhpcyAoeWF3KS5cbiAgICogRHJhZ2dpbmcgbGVmdCBhbmQgcmlnaHQgcm90YXRlcyB0aGUgY2FtZXJhIGFyb3VuZCB0aGUgWS1heGlzIChwaXRjaCkuXG4gICAqL1xuICBvbk1vdXNlTW92ZTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgdmFyIG1vdmVtZW50WDtcbiAgICB2YXIgbW92ZW1lbnRZO1xuICAgIHZhciBwaXRjaE9iamVjdCA9IHRoaXMucGl0Y2hPYmplY3Q7XG4gICAgdmFyIHByZXZpb3VzTW91c2VFdmVudCA9IHRoaXMucHJldmlvdXNNb3VzZUV2ZW50O1xuICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcblxuICAgIC8vIE5vdCBkcmFnZ2luZyBvciBub3QgZW5hYmxlZC5cbiAgICBpZiAoIXRoaXMuZGF0YS5lbmFibGVkIHx8ICghdGhpcy5tb3VzZURvd24gJiYgIXRoaXMucG9pbnRlckxvY2tlZCkpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBDYWxjdWxhdGUgZGVsdGEuXG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgbW92ZW1lbnRYID0gZXZ0Lm1vdmVtZW50WCB8fCBldnQubW96TW92ZW1lbnRYIHx8IDA7XG4gICAgICBtb3ZlbWVudFkgPSBldnQubW92ZW1lbnRZIHx8IGV2dC5tb3pNb3ZlbWVudFkgfHwgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbW92ZW1lbnRYID0gZXZ0LnNjcmVlblggLSBwcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWDtcbiAgICAgIG1vdmVtZW50WSA9IGV2dC5zY3JlZW5ZIC0gcHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblk7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblggPSBldnQuc2NyZWVuWDtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZID0gZXZ0LnNjcmVlblk7XG5cbiAgICAvLyBDYWxjdWxhdGUgcm90YXRpb24uXG4gICAgZGlyZWN0aW9uID0gdGhpcy5kYXRhLnJldmVyc2VNb3VzZURyYWcgPyAxIDogLTE7XG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgKz0gbW92ZW1lbnRYICogMC4wMDIgKiBkaXJlY3Rpb247XG4gICAgcGl0Y2hPYmplY3Qucm90YXRpb24ueCArPSBtb3ZlbWVudFkgKiAwLjAwMiAqIGRpcmVjdGlvbjtcbiAgICBwaXRjaE9iamVjdC5yb3RhdGlvbi54ID0gTWF0aC5tYXgoLVBJXzIsIE1hdGgubWluKFBJXzIsIHBpdGNoT2JqZWN0LnJvdGF0aW9uLngpKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgbW91c2UgZG93biB0byBkZXRlY3QgbW91c2UgZHJhZy5cbiAgICovXG4gIG9uTW91c2VEb3duOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgaWYgKCF0aGlzLmRhdGEuZW5hYmxlZCB8fCAoc2NlbmVFbC5pcygndnItbW9kZScpICYmIHNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpKSB7IHJldHVybjsgfVxuICAgIC8vIEhhbmRsZSBvbmx5IHByaW1hcnkgYnV0dG9uLlxuICAgIGlmIChldnQuYnV0dG9uICE9PSAwKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbCAmJiBzY2VuZUVsLmNhbnZhcztcblxuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YID0gZXZ0LnNjcmVlblg7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWSA9IGV2dC5zY3JlZW5ZO1xuICAgIHRoaXMuc2hvd0dyYWJiaW5nQ3Vyc29yKCk7XG5cbiAgICBpZiAodGhpcy5kYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCAmJiAhdGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICBpZiAoY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKSB7XG4gICAgICAgIGNhbnZhc0VsLnJlcXVlc3RQb2ludGVyTG9jaygpO1xuICAgICAgfSBlbHNlIGlmIChjYW52YXNFbC5tb3pSZXF1ZXN0UG9pbnRlckxvY2spIHtcbiAgICAgICAgY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTaG93cyBncmFiYmluZyBjdXJzb3Igb24gc2NlbmVcbiAgICovXG4gIHNob3dHcmFiYmluZ0N1cnNvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2dyYWJiaW5nJztcbiAgfSxcblxuICAvKipcbiAgICogSGlkZXMgZ3JhYmJpbmcgY3Vyc29yIG9uIHNjZW5lXG4gICAqL1xuICBoaWRlR3JhYmJpbmdDdXJzb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNjZW5lRWwuY2FudmFzLnN0eWxlLmN1cnNvciA9ICcnO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtb3VzZSB1cCB0byBkZXRlY3QgcmVsZWFzZSBvZiBtb3VzZSBkcmFnLlxuICAgKi9cbiAgb25Nb3VzZVVwOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVHcmFiYmluZ0N1cnNvcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0b3VjaCBkb3duIHRvIGRldGVjdCB0b3VjaCBkcmFnLlxuICAgKi9cbiAgb25Ub3VjaFN0YXJ0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dC50b3VjaGVzLmxlbmd0aCAhPT0gMSB8fFxuICAgICAgICAhdGhpcy5kYXRhLnRvdWNoRW5hYmxlZCB8fFxuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuaXMoJ3ZyLW1vZGUnKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLnRvdWNoU3RhcnQgPSB7XG4gICAgICB4OiBldnQudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgIHk6IGV2dC50b3VjaGVzWzBdLnBhZ2VZXG4gICAgfTtcbiAgICB0aGlzLnRvdWNoU3RhcnRlZCA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0b3VjaCBtb3ZlIHRvIFktYXhpcyByb3RhdGlvbi5cbiAgICovXG4gIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICB2YXIgY2FudmFzID0gdGhpcy5lbC5zY2VuZUVsLmNhbnZhcztcbiAgICB2YXIgZGVsdGFZO1xuICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcblxuICAgIGlmICghdGhpcy50b3VjaFN0YXJ0ZWQgfHwgIXRoaXMuZGF0YS50b3VjaEVuYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBkZWx0YVkgPSAyICogTWF0aC5QSSAqIChldnQudG91Y2hlc1swXS5wYWdlWCAtIHRoaXMudG91Y2hTdGFydC54KSAvIGNhbnZhcy5jbGllbnRXaWR0aDtcblxuICAgIGRpcmVjdGlvbiA9IHRoaXMuZGF0YS5yZXZlcnNlVG91Y2hEcmFnID8gMSA6IC0xO1xuICAgIC8vIExpbWl0IHRvdWNoIG9yaWVudGFpb24gdG8gdG8geWF3ICh5IGF4aXMpLlxuICAgIHlhd09iamVjdC5yb3RhdGlvbi55IC09IGRlbHRhWSAqIDAuNSAqIGRpcmVjdGlvbjtcbiAgICB0aGlzLnRvdWNoU3RhcnQgPSB7XG4gICAgICB4OiBldnQudG91Y2hlc1swXS5wYWdlWCxcbiAgICAgIHk6IGV2dC50b3VjaGVzWzBdLnBhZ2VZXG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdG91Y2ggZW5kIHRvIGRldGVjdCByZWxlYXNlIG9mIHRvdWNoIGRyYWcuXG4gICAqL1xuICBvblRvdWNoRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50b3VjaFN0YXJ0ZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZSBwb3NlLlxuICAgKi9cbiAgb25FbnRlclZSOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgaWYgKCFzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7IHJldHVybjsgfVxuICAgIHRoaXMuc2F2ZUNhbWVyYVBvc2UoKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgICBpZiAoc2NlbmVFbC5oYXNXZWJYUikge1xuICAgICAgdGhpcy5lbC5vYmplY3QzRC5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG4gICAgICB0aGlzLmVsLm9iamVjdDNELnVwZGF0ZU1hdHJpeCgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVzdG9yZSB0aGUgcG9zZS5cbiAgICovXG4gIG9uRXhpdFZSOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsLnNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5yZXN0b3JlQ2FtZXJhUG9zZSgpO1xuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5lbC5vYmplY3QzRC5tYXRyaXhBdXRvVXBkYXRlID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIFBvaW50ZXIgTG9jayBzdGF0ZS5cbiAgICovXG4gIG9uUG9pbnRlckxvY2tDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSAhIShkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgfHwgZG9jdW1lbnQubW96UG9pbnRlckxvY2tFbGVtZW50KTtcbiAgfSxcblxuICAvKipcbiAgICogUmVjb3ZlciBmcm9tIFBvaW50ZXIgTG9jayBlcnJvci5cbiAgICovXG4gIG9uUG9pbnRlckxvY2tFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vIEV4aXRzIHBvaW50ZXItbG9ja2VkIG1vZGUuXG4gIGV4aXRQb2ludGVyTG9jazogZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGZlYXR1cmUgb2Ygc2hvd2luZy9oaWRpbmcgdGhlIGdyYWIgY3Vyc29yLlxuICAgKi9cbiAgdXBkYXRlR3JhYkN1cnNvcjogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUdyYWJDdXJzb3IgKCkgeyBzY2VuZUVsLmNhbnZhcy5jbGFzc0xpc3QuYWRkKCdhLWdyYWItY3Vyc29yJyk7IH1cbiAgICBmdW5jdGlvbiBkaXNhYmxlR3JhYkN1cnNvciAoKSB7IHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoJ2EtZ3JhYi1jdXJzb3InKTsgfVxuXG4gICAgaWYgKCFzY2VuZUVsLmNhbnZhcykge1xuICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXItdGFyZ2V0LWxvYWRlZCcsIGVuYWJsZUdyYWJDdXJzb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXItdGFyZ2V0LWxvYWRlZCcsIGRpc2FibGVHcmFiQ3Vyc29yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgZW5hYmxlR3JhYkN1cnNvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkaXNhYmxlR3JhYkN1cnNvcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlIGNhbWVyYSBwb3NlIGJlZm9yZSBlbnRlcmluZyBWUiB0byByZXN0b3JlIGxhdGVyIGlmIGV4aXRpbmcuXG4gICAqL1xuICBzYXZlQ2FtZXJhUG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG5cbiAgICB0aGlzLnNhdmVkUG9zZS5wb3NpdGlvbi5jb3B5KGVsLm9iamVjdDNELnBvc2l0aW9uKTtcbiAgICB0aGlzLnNhdmVkUG9zZS5yb3RhdGlvbi5jb3B5KGVsLm9iamVjdDNELnJvdGF0aW9uKTtcbiAgICB0aGlzLmhhc1NhdmVkUG9zZSA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc2V0IGNhbWVyYSBwb3NlIHRvIGJlZm9yZSBlbnRlcmluZyBWUi5cbiAgICovXG4gIHJlc3RvcmVDYW1lcmFQb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICB2YXIgc2F2ZWRQb3NlID0gdGhpcy5zYXZlZFBvc2U7XG5cbiAgICBpZiAoIXRoaXMuaGFzU2F2ZWRQb3NlKSB7IHJldHVybjsgfVxuXG4gICAgLy8gUmVzZXQgY2FtZXJhIG9yaWVudGF0aW9uLlxuICAgIGVsLm9iamVjdDNELnBvc2l0aW9uLmNvcHkoc2F2ZWRQb3NlLnBvc2l0aW9uKTtcbiAgICBlbC5vYmplY3QzRC5yb3RhdGlvbi5jb3B5KHNhdmVkUG9zZS5yb3RhdGlvbik7XG4gICAgdGhpcy5oYXNTYXZlZFBvc2UgPSBmYWxzZTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSAnYWZyYW1lJ1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnXG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnYXJqcy13ZWJjYW0tdGV4dHVyZScsIHtcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgICAgICB0aGlzLnRleENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoLTAuNSwgMC41LCAwLjUsIC0wLjUsIDAsIDEwKTtcbiAgICAgICAgdGhpcy50ZXhTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XG4gICAgICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XG4gICAgICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7IC8vMC41LCAwLjUpO1xuICAgICAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHRoaXMudmlkZW8pO1xuICAgICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IG1hcDogdGhpcy50ZXh0dXJlIH0gKTtcbiAgICAgICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgICAgIHRoaXMudGV4U2NlbmUuYWRkKG1lc2gpO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7IHZpZGVvOiB7XG4gICAgICAgICAgICAgICAgZmFjaW5nTW9kZTogJ2Vudmlyb25tZW50JyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oIHN0cmVhbT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTsgICAgXG4gICAgICAgICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4geyBhbGVydChgV2ViY2FtIGVycm9yOiAke2V9YCk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ3NvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuc2NlbmUucmVuZGVyZXIucmVuZGVyKHRoaXMudGV4U2NlbmUsIHRoaXMudGV4Q2FtZXJhKTtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gICAgfSxcblxuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QuZ2V0VHJhY2tzKCkuZm9yRWFjaCAoIHRyYWNrID0+IHtcbiAgICAgICAgICAgIHRyYWNrLnN0b3AoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xuICAgIH1cbn0pO1xuIiwiLypcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLWNhbWVyYScsIHtcbiAgICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxuICAgIG9yaWdpbkNvb3JkczogbnVsbCxcbiAgICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICAgIGxvb2tDb250cm9sczogbnVsbCxcbiAgICBoZWFkaW5nOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBzaW11bGF0ZUxhdGl0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgcG9zaXRpb25NaW5BY2N1cmFjeToge1xuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgIH0sXG4gICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgbWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbWF4RGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzTWluRGlzdGFuY2U6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG5cbiAgICAgICAgICAgIC8vIHJlLXRyaWdnZXIgaW5pdGlhbGl6YXRpb24gZm9yIG5ldyBvcmlnaW5cbiAgICAgICAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsLmNvbXBvbmVudHNbJ2FyanMtbG9vay1jb250cm9scyddICYmICF0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnRElWJyk7XG4gICAgICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoJ2FyanMtbG9hZGVyJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5sb2FkZXIpO1xuXG4gICAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQpO1xuXG4gICAgICAgIHRoaXMubG9va0NvbnRyb2xzID0gdGhpcy5lbC5jb21wb25lbnRzWydhcmpzLWxvb2stY29udHJvbHMnXSB8fCB0aGlzLmVsLmNvbXBvbmVudHNbJ2xvb2stY29udHJvbHMnXTtcblxuICAgICAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gaWYgU2FmYXJpXG4gICAgICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xuICAgICAgICAgICAgLy8gaU9TIDEzK1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLicpXG4gICAgICAgICAgICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoKSB7IGhhbmRsZXIoKSB9LCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBhbGVydCgnQWZ0ZXIgY2FtZXJhIHBlcm1pc3Npb24gcHJvbXB0LCBwbGVhc2UgdGFwIHRoZSBzY3JlZW4gdG8gYWN0aXZhdGUgZ2VvbG9jYXRpb24uJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy4nKVxuICAgICAgICAgICAgICAgIH0sIDc1MCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuXG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGFsdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3ksXG4gICAgICAgICAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmKGRpc3RNb3ZlZCA+PSB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UgfHwgIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUm90YXRpb24oKTtcbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ3BzLWVudGl0eS1wbGFjZS1hZGRlZCcsIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZXZlbnQgbmFtZVxuICAgICAqL1xuICAgIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScgaW4gd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2RldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnXG4gICAgICAgIH0gZWxzZSBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb24nIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnJ1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tcGFzcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBldmVudE5hbWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uU3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICghb25FcnJvcikge1xuICAgICAgICAgICAgb25FcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0VSUk9SKCcgKyBlcnIuY29kZSArICcpOiAnICsgZXJyLm1lc3NhZ2UpXG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlciBkZW5pZWQgR2VvTG9jYXRpb24sIGxldCB0aGVpciBrbm93IHRoYXRcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBhY3RpdmF0ZSBHZW9sb2NhdGlvbiBhbmQgcmVmcmVzaCB0aGUgcGFnZS4gSWYgaXQgaXMgYWxyZWFkeSBhY3RpdmUsIHBsZWFzZSBjaGVjayBwZXJtaXNzaW9ucyBmb3IgdGhpcyB3ZWJzaXRlLicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdDYW5ub3QgcmV0cmlldmUgR1BTIHBvc2l0aW9uLiBTaWduYWwgaXMgYWJzZW50LicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnZ2VvbG9jYXRpb24nIGluIG5hdmlnYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG9uRXJyb3IoeyBjb2RlOiAwLCBtZXNzYWdlOiAnR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXInIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dlb2xvY2F0aW9uL3dhdGNoUG9zaXRpb25cbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKG9uU3VjY2Vzcywgb25FcnJvciwge1xuICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDI3MDAwLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHVzZXIgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5ID4gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC1wb3B1cCcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgcG9wdXAuaW5uZXJIVE1MID0gJ0dQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuJ1xuICAgICAgICAgICAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnaWQnLCAnYWxlcnQtcG9wdXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsZXJ0LXBvcHVwJyk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiYgYWxlcnRQb3B1cCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhbGVydFBvcHVwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGNhbWVyYSBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLmN1cnJlbnRDb29yZHM7XG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFyanMtbG9hZGVyJyk7XG4gICAgICAgICAgICBpZiAobG9hZGVyKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXQnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgLy8gY29tcHV0ZSBwb3NpdGlvbi54XG4gICAgICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgcG9zaXRpb24ueCA9IHRoaXMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuICAgICAgICBwb3NpdGlvbi54ICo9IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUgPyAxIDogLTE7XG5cbiAgICAgICAgLy8gY29tcHV0ZSBwb3NpdGlvbi56XG4gICAgICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIH1cblxuICAgICAgICBwb3NpdGlvbi56ID0gdGhpcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XG4gICAgICAgIHBvc2l0aW9uLnogKj0gdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlID4gdGhpcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUgPyAtMSA6IDE7XG5cbiAgICAgICAgLy8gdXBkYXRlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcblxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgeyBkZXRhaWw6IHsgcG9zaXRpb246IHRoaXMuY3VycmVudENvb3Jkcywgb3JpZ2luOiB0aGlzLm9yaWdpbkNvb3JkcyB9IH0pKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZGlzdGFuY2UgaW4gbWV0ZXJzIGJldHdlZW4gc291cmNlIGFuZCBkZXN0aW5hdGlvbiBpbnB1dHMuXG4gICAgICpcbiAgICAgKiAgQ2FsY3VsYXRlIGRpc3RhbmNlLCBiZWFyaW5nIGFuZCBtb3JlIGJldHdlZW4gTGF0aXR1ZGUvTG9uZ2l0dWRlIHBvaW50c1xuICAgICAqICBEZXRhaWxzOiBodHRwczovL3d3dy5tb3ZhYmxlLXR5cGUuY28udWsvc2NyaXB0cy9sYXRsb25nLmh0bWxcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UG9zaXRpb259IHNyY1xuICAgICAqIEBwYXJhbSB7UG9zaXRpb259IGRlc3RcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzUGxhY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGRpc3RhbmNlIHwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgKi9cbiAgICBjb21wdXRlRGlzdGFuY2VNZXRlcnM6IGZ1bmN0aW9uIChzcmMsIGRlc3QsIGlzUGxhY2UpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5faGF2ZXJzaW5lRGlzdCAoc3JjLCBkZXN0KTtcblxuICAgICAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBuZWFyIGFuZCBhIG1pbiBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSBjYWxsZXJcbiAgICAgICAgaWYgKGlzUGxhY2UgJiYgdGhpcy5kYXRhLm1pbkRpc3RhbmNlICYmIHRoaXMuZGF0YS5taW5EaXN0YW5jZSA+IDAgJiYgZGlzdGFuY2UgPCB0aGlzLmRhdGEubWluRGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIGZhciBhbmQgYSBtYXggZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgICAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgY2FsbGVyXG4gICAgICAgIGlmIChpc1BsYWNlICYmIHRoaXMuZGF0YS5tYXhEaXN0YW5jZSAmJiB0aGlzLmRhdGEubWF4RGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlID4gdGhpcy5kYXRhLm1heERpc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIH1cblx0XG4gICAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9LFxuXG4gICAgX2hhdmVyc2luZURpc3Q6IGZ1bmN0aW9uIChzcmMsIGRlc3QpIHtcbiAgICAgICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgICAgIHZhciBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgICAgIHZhciBhID0gKE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikpICsgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSkpICogKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XG4gICAgICAgIHZhciBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgY29tcGFzcyBoZWFkaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldGFcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ2FtbWFcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvbXBhc3MgaGVhZGluZ1xuICAgICAqL1xuICAgIF9jb21wdXRlQ29tcGFzc0hlYWRpbmc6IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSwgZ2FtbWEpIHtcblxuICAgICAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICAgICAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgZ2FtbWFSYWQgPSBnYW1tYSAqIChNYXRoLlBJIC8gMTgwKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgICAgICB2YXIgY0EgPSBNYXRoLmNvcyhhbHBoYVJhZCk7XG4gICAgICAgIHZhciBzQSA9IE1hdGguc2luKGFscGhhUmFkKTtcbiAgICAgICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgICAgIHZhciBjRyA9IE1hdGguY29zKGdhbW1hUmFkKTtcbiAgICAgICAgdmFyIHNHID0gTWF0aC5zaW4oZ2FtbWFSYWQpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIHJBID0gLSBjQSAqIHNHIC0gc0EgKiBzQiAqIGNHO1xuICAgICAgICB2YXIgckIgPSAtIHNBICogc0cgKyBjQSAqIHNCICogY0c7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNvbXBhc3MgaGVhZGluZ1xuICAgICAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcbiAgICAgICAgaWYgKHJCIDwgMCkge1xuICAgICAgICAgICAgY29tcGFzc0hlYWRpbmcgKz0gTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgICAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAgICAgICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgICAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgZm9yIGRldmljZSBvcmllbnRhdGlvbiBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX29uRGV2aWNlT3JpZW50YXRpb246IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeSA8IDUwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nID0gZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybignd2Via2l0Q29tcGFzc0FjY3VyYWN5IGlzIGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgPT09IHRydWUgfHwgZXZlbnQuYWJzb2x1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZyA9IHRoaXMuX2NvbXB1dGVDb21wYXNzSGVhZGluZyhldmVudC5hbHBoYSwgZXZlbnQuYmV0YSwgZXZlbnQuZ2FtbWEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ2V2ZW50LmFic29sdXRlID09PSBmYWxzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdldmVudC5hbHBoYSA9PT0gbnVsbCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB1c2VyIHJvdGF0aW9uIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfdXBkYXRlUm90YXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhlYWRpbmcgPSAzNjAgLSB0aGlzLmhlYWRpbmc7XG4gICAgICAgIHZhciBjYW1lcmFSb3RhdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdyb3RhdGlvbicpLnk7XG4gICAgICAgIHZhciB5YXdSb3RhdGlvbiA9IFRIUkVFLk1hdGgucmFkVG9EZWcodGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkpO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gKGhlYWRpbmcgLSAoY2FtZXJhUm90YXRpb24gLSB5YXdSb3RhdGlvbikpICUgMzYwO1xuICAgICAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSA9IFRIUkVFLk1hdGguZGVnVG9SYWQob2Zmc2V0KTtcbiAgICB9LFxuICAgIFxuICAgIF9vbkdwc0VudGl0eVBsYWNlQWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBpZiBwbGFjZXMgYXJlIGFkZGVkIGFmdGVyIGNhbWVyYSBpbml0aWFsaXphdGlvbiBpcyBmaW5pc2hlZFxuICAgICAgICBpZiAodGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxvYWRlciAmJiB0aGlzLmxvYWRlci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubG9hZGVyKVxuICAgICAgICB9XG4gICAgfVxufSk7IiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSc7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLWVudGl0eS1wbGFjZScsIHtcbiAgICBfY2FtZXJhR3BzOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBsb25naXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JywgdGhpcy5jb29yZFNldExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZ3BzLWNhbWVyYV0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ3BzLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlRm9yTXNnID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhldi5kZXRhaWwucG9zaXRpb24sIGRzdENvb3Jkcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZScsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZU1zZycsIGZvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG4gICAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdG9uJywgeyBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0gfSkpO1xuXG4gICAgICAgICAgICB2YXIgYWN0dWFsRGlzdGFuY2UgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGV2LmRldGFpbC5wb3NpdGlvbiwgZHN0Q29vcmRzLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKGFjdHVhbERpc3RhbmNlID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcsIHRoaXMuY29vcmRTZXRMaXN0ZW5lcik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lcik7XG5cbiAgICAgICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSAwO1xuXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWVudGl0eS1wbGFjZS1hZGRlZCcsIHsgZGV0YWlsOiB7IGNvbXBvbmVudDogdGhpcy5lbCB9IH0pKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEhpZGUgZW50aXR5IGFjY29yZGluZyB0byBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGhpZGVGb3JNaW5EaXN0YW5jZTogZnVuY3Rpb24oZWwsIGhpZGVFbnRpdHkpIHtcbiAgICAgICAgaWYgKGhpZGVFbnRpdHkpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHBsYWNlIHBvc2l0aW9uXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0geyB4OiAwLCB5OiB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKS55IHx8IDAsIHo6IDAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBwb3NpdGlvbi54XG4gICAgICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgfTtcblxuICAgICAgICBwb3NpdGlvbi54ID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gcG9zaXRpb24ueDtcblxuICAgICAgICBwb3NpdGlvbi54ICo9IHRoaXMuZGF0YS5sb25naXR1ZGUgPiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSA/IDEgOiAtMTtcblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24uelxuICAgICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubGF0aXR1ZGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgcG9zaXRpb24ueiA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcblxuICAgICAgICBwb3NpdGlvbi56ICo9IHRoaXMuZGF0YS5sYXRpdHVkZSA+IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUgPyAtMSA6IDE7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBhbHRpdHVkZSA9IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgOiAwO1xuICAgICAgICAgICAgcG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSBhbHRpdHVkZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gM0Qgd29ybGRcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiBGb3JtYXQgZGlzdGFuY2VzIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxuICovXG5mdW5jdGlvbiBmb3JtYXREaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGRpc3RhbmNlID0gZGlzdGFuY2UudG9GaXhlZCgwKTtcblxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XG4gICAgICAgIHJldHVybiAoZGlzdGFuY2UgLyAxMDAwKSArICcga2lsb21ldGVycyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgJyBtZXRlcnMnO1xufTtcbiIsIi8qKiBncHMtcHJvamVjdGVkLWNhbWVyYVxuICpcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtY2FtZXJhLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxuICpcbiAqIFJhdGhlciB0aGFuIGtlZXBpbmcgdHJhY2sgb2YgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlIGRpc3RhbmNlIG9mXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgcG9zaXRpb24gKGxhdC9sb24pIGlzIHByb2plY3RlZCBpbnRvIFNwaGVyaWNhbCBNZXJjYXRvciBhbmRcbiAqIHN0b3JlZC5cbiAqXG4gKiBUaGVuLCB3aGVuIHdlIHJlY2VpdmUgYSBuZXcgcG9zaXRpb24gKGxhdC9sb24pLCB0aGlzIG5ldyBwb3NpdGlvbiBpc1xuICogcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuIGl0cyB3b3JsZCBwb3NpdGlvbiBjYWxjdWxhdGVkXG4gKiBieSBjb21wYXJpbmcgYWdhaW5zdCB0aGUgb3JpZ2luYWwgcG9zaXRpb24uXG4gKlxuICogVGhlIHNhbWUgaXMgYWxzbyB0aGUgY2FzZSBmb3IgJ2VudGl0eS1wbGFjZXMnOyB3aGVuIHRoZXNlIGFyZSBhZGRlZCwgdGhlaXJcbiAqIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZHMgYXJlIGNhbGN1bGF0ZWQgKHNlZSBncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZSkuXG4gKlxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcbiAqIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLiBOb25ldGhlbGVzcyB0aGV5IGFyZSBhIGdvb2QgYXBwcm94aW1hdGlvblxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cbiAqXG4gKiBVUERBVEVTIDI4LzA4LzIwOlxuICpcbiAqIC0gYWRkIGdwc01pbkRpc3RhbmNlIGFuZCBncHNUaW1lSW50ZXJ2YWwgcHJvcGVydGllcyB0byBjb250cm9sIGhvd1xuICogZnJlcXVlbnRseSBHUFMgdXBkYXRlcyBhcmUgcHJvY2Vzc2VkLiBBaW0gaXMgdG8gcHJldmVudCAnc3R1dHRlcmluZydcbiAqIGVmZmVjdHMgd2hlbiBjbG9zZSB0byBBUiBjb250ZW50IGR1ZSB0byBjb250aW51b3VzIHNtYWxsIGNoYW5nZXMgaW5cbiAqIGxvY2F0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tICdhZnJhbWUnXG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLXByb2plY3RlZC1jYW1lcmEnLCB7XG4gICAgX3dhdGNoUG9zaXRpb25JZDogbnVsbCxcbiAgICBvcmlnaW5Db29yZHM6IG51bGwsIC8vIG9yaWdpbmFsIGNvb3JkcyBub3cgaW4gU3BoZXJpY2FsIE1lcmNhdG9yXG4gICAgY3VycmVudENvb3JkczogbnVsbCxcbiAgICBsb29rQ29udHJvbHM6IG51bGwsXG4gICAgaGVhZGluZzogbnVsbCxcbiAgICBzY2hlbWE6IHtcbiAgICAgICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMTAwLFxuICAgICAgICB9LFxuICAgICAgICBhbGVydDoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbkRpc3RhbmNlOiB7XG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIGdwc01pbkRpc3RhbmNlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5lbC5jb21wb25lbnRzWydhcmpzLWxvb2stY29udHJvbHMnXSAmJiAhdGhpcy5lbC5jb21wb25lbnRzWydsb29rLWNvbnRyb2xzJ10pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgICAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QuYWRkKCdhcmpzLWxvYWRlcicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubG9hZGVyKTtcblxuICAgICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCA9IHRoaXMuX29uR3BzRW50aXR5UGxhY2VBZGRlZC5iaW5kKHRoaXMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWVudGl0eS1wbGFjZS1hZGRlZCcsIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkKTtcblxuICAgICAgICB0aGlzLmxvb2tDb250cm9scyA9IHRoaXMuZWwuY29tcG9uZW50c1snYXJqcy1sb29rLWNvbnRyb2xzJ10gfHwgdGhpcy5lbC5jb21wb25lbnRzWydsb29rLWNvbnRyb2xzJ107XG5cbiAgICAgICAgLy8gbGlzdGVuIHRvIGRldmljZW9yaWVudGF0aW9uIGV2ZW50XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uID0gdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vIGlmIFNhZmFyaVxuICAgICAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgICAgICAgIC8vIGlPUyAxMytcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLicpXG4gICAgICAgICAgICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHsgaGFuZGxlcigpIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuJylcbiAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IHRoaXMuX2luaXRXYXRjaEdQUyhmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgICAgICBhbHRpdHVkZTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgICAgICAgICAgICAgICBhbHRpdHVkZUFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGVBY2N1cmFjeSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3Jkc1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZihkaXN0TW92ZWQgPj0gdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlIHx8ICF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUm90YXRpb24oKTtcbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQgbmFtZSwgZGVwZW5kcyBvbiBicm93c2VyIGltcGxlbWVudGF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICAgKi9cbiAgICBfZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScgaW4gd2luZG93KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJ2RldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnXG4gICAgICAgIH0gZWxzZSBpZiAoJ29uZGV2aWNlb3JpZW50YXRpb24nIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdkZXZpY2VvcmllbnRhdGlvbidcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnJ1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tcGFzcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBldmVudE5hbWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uU3VjY2Vzc1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICAgICAgICBvbkVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFUlJPUignICsgZXJyLmNvZGUgKyAnKTogJyArIGVyci5tZXNzYWdlKVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgZGVuaWVkIEdlb0xvY2F0aW9uLCBsZXQgdGhlaXIga25vdyB0aGF0XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgYWN0aXZhdGUgR2VvbG9jYXRpb24gYW5kIHJlZnJlc2ggdGhlIHBhZ2UuIElmIGl0IGlzIGFscmVhZHkgYWN0aXZlLCBwbGVhc2UgY2hlY2sgcGVybWlzc2lvbnMgZm9yIHRoaXMgd2Vic2l0ZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2dlb2xvY2F0aW9uJyBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvbkVycm9yKHsgY29kZTogMCwgbWVzc2FnZTogJ0dlb2xvY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyB9KTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIHtcbiAgICAgICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgICAgICAgIG1heGltdW1BZ2U6IHRoaXMuZGF0YS5ncHNUaW1lSW50ZXJ2YWwsXG4gICAgICAgICAgICB0aW1lb3V0OiAyNzAwMCxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB1c2VyIHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5ID4gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC1wb3B1cCcpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgcG9wdXAuaW5uZXJIVE1MID0gJ0dQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuJ1xuICAgICAgICAgICAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZSgnaWQnLCAnYWxlcnQtcG9wdXAnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsZXJ0LXBvcHVwJyk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiYgYWxlcnRQb3B1cCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhbGVydFBvcHVwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGNhbWVyYSBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgLy8gTm93IHN0b3JlIG9yaWdpbkNvb3JkcyBhcyBQUk9KRUNURUQgb3JpZ2luYWwgbGF0L2xvbiwgc28gdGhhdFxuICAgICAgICAgICAgLy8gd2UgY2FuIHNldCB0aGUgd29ybGQgb3JpZ2luIHRvIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpbiBcIm1ldHJlc1wiXG4gICAgICAgICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IHRoaXMuX3Byb2plY3QodGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLCB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXJqcy1sb2FkZXInKTtcbiAgICAgICAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY3VycmVudCBwb3NpdGlvbiAoaW4gd29ybGQgY29vcmRzLCBiYXNlZCBvbiBTcGhlcmljYWwgTWVyY2F0b3IpXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfc2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTtcblxuICAgICAgICB2YXIgd29ybGRDb29yZHMgPSB0aGlzLmxhdExvblRvV29ybGQodGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLCB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlKTtcblxuICAgICAgICBwb3NpdGlvbi54ID0gd29ybGRDb29yZHNbMF07XG4gICAgICAgIHBvc2l0aW9uLnogPSB3b3JsZENvb3Jkc1sxXTtcblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb25cbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuXG4gICAgICAgIC8vIGFkZCB0aGUgc3BobWVyYyBwb3NpdGlvbiB0byB0aGUgZXZlbnQgKGZvciB0ZXN0aW5nIG9ubHkpXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb24nLCB7IGRldGFpbDogeyBwb3NpdGlvbjogdGhpcy5jdXJyZW50Q29vcmRzLCBvcmlnaW46IHRoaXMub3JpZ2luQ29vcmRzIH0gfSkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkaXN0YW5jZSBpbiBtZXRlcnMgYmV0d2VlbiBjYW1lcmEgYW5kIGRlc3RpbmF0aW9uIGlucHV0LlxuICAgICAqXG4gICAgICogQXNzdW1lIHdlIGFyZSB1c2luZyBhIG1ldHJlLWJhc2VkIHByb2plY3Rpb24uIE5vdCBhbGwgJ21ldHJlLWJhc2VkJ1xuICAgICAqIHByb2plY3Rpb25zIGdpdmUgZXhhY3QgbWV0cmVzLCBlLmcuIFNwaGVyaWNhbCBNZXJjYXRvciwgYnV0IGl0IGFwcGVhcnNcbiAgICAgKiBjbG9zZSBlbm91Z2ggdG8gYmUgdXNlZCBmb3IgQVIgYXQgbGVhc3QgaW4gbWlkZGxlIHRlbXBlcmF0ZVxuICAgICAqIGxhdGl0dWRlcyAoNDAgLSA1NSkuIEl0IGlzIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLCBob3dldmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQb3NpdGlvbn0gZGVzdFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNQbGFjZVxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcn0gZGlzdGFuY2UgfCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqL1xuICAgIGNvbXB1dGVEaXN0YW5jZU1ldGVyczogZnVuY3Rpb24oZGVzdCwgaXNQbGFjZSkge1xuICAgICAgICB2YXIgc3JjID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcbiAgICAgICAgdmFyIGR4ID0gZGVzdC54IC0gc3JjLng7XG4gICAgICAgIHZhciBkeiA9IGRlc3QueiAtIHNyYy56O1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR6ICogZHopO1xuXG4gICAgICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIG5lYXIgYW5kIGEgbWluIGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAgICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlICBtZXRob2QgY2FsbGVyXG4gICAgICAgIGlmIChpc1BsYWNlICYmIHRoaXMuZGF0YS5taW5EaXN0YW5jZSAmJiB0aGlzLmRhdGEubWluRGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgdGhpcy5kYXRhLm1pbkRpc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzdGFuY2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gT3BlbkdMIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgICAqXG4gICAgICogRmlyc3QgcHJvamVjdHMgbGF0L2xvbiB0byBhYnNvbHV0ZSBTcGhlcmljYWwgTWVyY2F0b3IgYW5kIHRoZW5cbiAgICAgKiBjYWxjdWxhdGVzIHRoZSB3b3JsZCBjb29yZGluYXRlcyBieSBjb21wYXJpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvclxuICAgICAqIGNvb3JkaW5hdGVzIHdpdGggdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyBvZiB0aGUgb3JpZ2luIHBvaW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxhdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthcnJheX0gd29ybGQgY29vcmRpbmF0ZXNcbiAgICAgKi9cbiAgICBsYXRMb25Ub1dvcmxkOiBmdW5jdGlvbihsYXQsIGxvbikge1xuICAgICAgICB2YXIgcHJvamVjdGVkID0gdGhpcy5fcHJvamVjdChsYXQsIGxvbik7XG4gICAgICAgIC8vIFNpZ24gb2YgeiBuZWVkcyB0byBiZSByZXZlcnNlZCBjb21wYXJlZCB0byBwcm9qZWN0ZWQgY29vcmRpbmF0ZXNcbiAgICAgICAgcmV0dXJuIFtwcm9qZWN0ZWRbMF0gLSB0aGlzLm9yaWdpbkNvb3Jkc1swXSwgLShwcm9qZWN0ZWRbMV0gLSB0aGlzLm9yaWdpbkNvb3Jkc1sxXSldO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgbGF0aXR1ZGUvbG9uZ2l0dWRlIHRvIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcy5cbiAgICAgKiBBbGdvcml0aG0gaXMgdXNlZCBpbiBzZXZlcmFsIE9wZW5TdHJlZXRNYXAtcmVsYXRlZCBhcHBsaWNhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGF0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2FycmF5fSBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXNcbiAgICAgKi9cbiAgICBfcHJvamVjdDogZnVuY3Rpb24obGF0LCBsb24pIHtcbiAgICAgICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuXG4gICAgICAgIC8vIENvbnZlcnQgdGhlIHN1cHBsaWVkIGNvb3JkcyB0byBTcGhlcmljYWwgTWVyY2F0b3IgKEVQU0c6Mzg1NyksIGFsc29cbiAgICAgICAgLy8ga25vd24gYXMgJ0dvb2dsZSBQcm9qZWN0aW9uJywgdXNpbmcgdGhlIGFsZ29yaXRobSB1c2VkIGV4dGVuc2l2ZWx5XG4gICAgICAgIC8vIGluIHZhcmlvdXMgT3BlblN0cmVldE1hcCBzb2Z0d2FyZS5cbiAgICAgICAgdmFyIHkgPSBNYXRoLmxvZyhNYXRoLnRhbigoOTAgKyBsYXQpICogTWF0aC5QSSAvIDM2MC4wKSkgLyAoTWF0aC5QSSAvIDE4MC4wKTtcbiAgICAgICAgcmV0dXJuIFsobG9uIC8gMTgwLjApICogSEFMRl9FQVJUSCwgeSAqIEhBTEZfRUFSVEggLyAxODAuMF07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMgdG8gbGF0aXR1ZGUvbG9uZ2l0dWRlLlxuICAgICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3IgZWFzdGluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3Igbm9ydGhpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IGxvbi9sYXRcbiAgICAgKi9cbiAgICBfdW5wcm9qZWN0OiBmdW5jdGlvbihlLCBuKSB7XG4gICAgICAgIGNvbnN0IEhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcbiAgICAgICAgdmFyIHlwID0gKG4gLyBIQUxGX0VBUlRIKSAqIDE4MC4wO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiAoZSAvIEhBTEZfRUFSVEgpICogMTgwLjAsXG4gICAgICAgICAgICBsYXRpdHVkZTogMTgwLjAgLyBNYXRoLlBJICogKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoeXAgKiBNYXRoLlBJIC8gMTgwLjApKSAtIE1hdGguUEkgLyAyKVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBnYW1tYVxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXG4gICAgICovXG4gICAgX2NvbXB1dGVDb21wYXNzSGVhZGluZzogZnVuY3Rpb24oYWxwaGEsIGJldGEsIGdhbW1hKSB7XG5cbiAgICAgICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAgICAgICAgdmFyIGFscGhhUmFkID0gYWxwaGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBiZXRhUmFkID0gYmV0YSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGVxdWF0aW9uIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIGNBID0gTWF0aC5jb3MoYWxwaGFSYWQpO1xuICAgICAgICB2YXIgc0EgPSBNYXRoLnNpbihhbHBoYVJhZCk7XG4gICAgICAgIHZhciBzQiA9IE1hdGguc2luKGJldGFSYWQpO1xuICAgICAgICB2YXIgY0cgPSBNYXRoLmNvcyhnYW1tYVJhZCk7XG4gICAgICAgIHZhciBzRyA9IE1hdGguc2luKGdhbW1hUmFkKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgQSwgQiwgQyByb3RhdGlvbiBjb21wb25lbnRzXG4gICAgICAgIHZhciByQSA9IC0gY0EgKiBzRyAtIHNBICogc0IgKiBjRztcbiAgICAgICAgdmFyIHJCID0gLSBzQSAqIHNHICsgY0EgKiBzQiAqIGNHO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBjb21wYXNzIGhlYWRpbmdcbiAgICAgICAgdmFyIGNvbXBhc3NIZWFkaW5nID0gTWF0aC5hdGFuKHJBIC8gckIpO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSBoYWxmIHVuaXQgY2lyY2xlIHRvIHdob2xlIHVuaXQgY2lyY2xlXG4gICAgICAgIGlmIChyQiA8IDApIHtcbiAgICAgICAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XG4gICAgICAgIH0gZWxzZSBpZiAockEgPCAwKSB7XG4gICAgICAgICAgICBjb21wYXNzSGVhZGluZyArPSAyICogTWF0aC5QSTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXG4gICAgICAgIGNvbXBhc3NIZWFkaW5nICo9IDE4MCAvIE1hdGguUEk7XG5cbiAgICAgICAgcmV0dXJuIGNvbXBhc3NIZWFkaW5nO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyIGZvciBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeSA8IDUwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nID0gZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybignd2Via2l0Q29tcGFzc0FjY3VyYWN5IGlzIGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgPT09IHRydWUgfHwgZXZlbnQuYWJzb2x1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGluZyA9IHRoaXMuX2NvbXB1dGVDb21wYXNzSGVhZGluZyhldmVudC5hbHBoYSwgZXZlbnQuYmV0YSwgZXZlbnQuZ2FtbWEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ2V2ZW50LmFic29sdXRlID09PSBmYWxzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdldmVudC5hbHBoYSA9PT0gbnVsbCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB1c2VyIHJvdGF0aW9uIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfdXBkYXRlUm90YXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGVhZGluZyA9IDM2MCAtIHRoaXMuaGVhZGluZztcbiAgICAgICAgdmFyIGNhbWVyYVJvdGF0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3JvdGF0aW9uJykueTtcbiAgICAgICAgdmFyIHlhd1JvdGF0aW9uID0gVEhSRUUuTWF0aC5yYWRUb0RlZyh0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSAoaGVhZGluZyAtIChjYW1lcmFSb3RhdGlvbiAtIHlhd1JvdGF0aW9uKSkgJSAzNjA7XG4gICAgICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aC5kZWdUb1JhZChvZmZzZXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXG4gICAgICpcbiAgICAgKiBUYWtlbiBmcm9tIGdwcy1jYW1lcmFcbiAgICAgKi9cbiAgICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24oc3JjLCBkZXN0KSB7XG4gICAgICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgICAgICB2YXIgYSA9IChNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpKSArIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKiBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgICAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgICAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICAgIH0sXG5cbiAgICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcilcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXG4gKlxuICogYmFzZWQgb24gdGhlIG9yaWdpbmFsIGdwcy1lbnRpdHktcGxhY2UsIG1vZGlmaWVkIGJ5IG5pY2t3IDAyLzA0LzIwXG4gKlxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcbiAqIGVudGl0aWVzIG9yIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiwgdGhpcyB2ZXJzaW9uXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxuICpcbiAqIFRoZSBvcmlnaW5hbCBsb2NhdGlvbiBvbiBzdGFydHVwIChsYXQvbG9uKSBpcyBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgXG4gKiBNZXJjYXRvciBhbmQgc3RvcmVkLlxuICpcbiAqIFdoZW4gJ2VudGl0eS1wbGFjZXMnIGFyZSBhZGRlZCwgdGhlaXIgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmUgXG4gKiBjYWxjdWxhdGVkIGFuZCBjb252ZXJ0ZWQgaW50byB3b3JsZCBjb29yZGluYXRlcywgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbmFsXG4gKiBwb3NpdGlvbiwgdXNpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBwcm9qZWN0aW9uIGNhbGN1bGF0aW9uIGluXG4gKiBncHMtcHJvamVjdGVkLWNhbWVyYS5cbiAqXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXG4gKiBmb3IgbWFueSBhcmVhcyBvZiB0aGUgd29ybGQgYW5kIGFwcGVhciBub3QgdG8gY2F1c2UgdW5hY2NlcHRhYmxlIGRpc3RvcnRpb25zXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxuICovXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSAnYWZyYW1lJ1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2dwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlJywge1xuICAgIF9jYW1lcmFHcHM6IG51bGwsXG4gICAgc2NoZW1hOiB7XG4gICAgICAgIGxvbmdpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBsYXRpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjbGVhbmluZyBsaXN0ZW5lcnMgd2hlbiB0aGUgZW50aXR5IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lcik7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVXNlZCBub3cgdG8gZ2V0IHRoZSBHUFMgY2FtZXJhIHdoZW4gaXQncyBiZWVuIHNldHVwXG4gICAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tncHMtcHJvamVjdGVkLWNhbWVyYV0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzWydncHMtcHJvamVjdGVkLWNhbWVyYSddKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dwcy1wcm9qZWN0ZWQtY2FtZXJhIG5vdCBpbml0aWFsaXplZCcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbJ2dwcy1wcm9qZWN0ZWQtY2FtZXJhJ107XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG5cblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24gbmVlZHMgdG8gd29ycnkgYWJvdXQgZGlzdGFuY2UgYnV0IG5vdGhpbmcgZWxzZT9cbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZGF0YSB8fCAhdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZHN0Q29vcmRzID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgICAgICAgLy8gX2NvbXB1dGVEaXN0YW5jZU1ldGVycyBpcyBub3cgZ29pbmcgdG8gdXNlIHRoZSBwcm9qZWN0ZWRcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZUZvck1zZyA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoZHN0Q29vcmRzKTtcblxuICAgICAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2Rpc3RhbmNlJywgZGlzdGFuY2VGb3JNc2cpO1xuICAgICAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2Rpc3RhbmNlTXNnJywgZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2VGb3JNc2cpKTtcblxuICAgICAgICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWVudGl0eS1wbGFjZS11cGRhdGUtcG9zaXRvbicsIHsgZGV0YWlsOiB7IGRpc3RhbmNlOiBkaXN0YW5jZUZvck1zZyB9IH0pKTtcblxuICAgICAgICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhkc3RDb29yZHMsIHRydWUpO1xuXG4gICAgICAgICAgICBpZiAoYWN0dWFsRGlzdGFuY2UgPT09IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXRhaW4gYXMgdGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBHUFMgY2FtZXJhIGlzIHNldCB1cFxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JywgdGhpcy5jb29yZFNldExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyKTtcblxuICAgICAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IDA7XG5cbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgeyBkZXRhaWw6IHsgY29tcG9uZW50OiB0aGlzLmVsIH0gfSkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogSGlkZSBlbnRpdHkgYWNjb3JkaW5nIHRvIG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgaGlkZUZvck1pbkRpc3RhbmNlOiBmdW5jdGlvbihlbCwgaGlkZUVudGl0eSkge1xuICAgICAgICBpZiAoaGlkZUVudGl0eSkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBVcGRhdGUgcGxhY2UgcG9zaXRpb25cbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cblxuICAgIC8vIHNldCBwb3NpdGlvbiB0byB3b3JsZCBjb29yZHMgdXNpbmcgdGhlIGxhdC9sb24gXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdvcmxkUG9zID0gdGhpcy5fY2FtZXJhR3BzLmxhdExvblRvV29ybGQodGhpcy5kYXRhLmxhdGl0dWRlLCB0aGlzLmRhdGEubG9uZ2l0dWRlKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxuICAgICAgICAvL3RoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywge1xuICAgICAgICAgICAgeDogd29ybGRQb3NbMF0sXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55LCBcbiAgICAgICAgICAgIHo6IHdvcmxkUG9zWzFdXG4gICAgICAgIH0pOyBcbiAgICB9LFxufSk7XG5cbi8qKlxuICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMCk7XG5cbiAgICBpZiAoZGlzdGFuY2UgPj0gMTAwMCkge1xuICAgICAgICByZXR1cm4gKGRpc3RhbmNlIC8gMTAwMCkgKyAnIGtpbG9tZXRlcnMnO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZSArICcgbWV0ZXJzJztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9hcmpzLWxvb2stY29udHJvbHMnXG5pbXBvcnQgJy4vYXJqcy13ZWJjYW0tdGV4dHVyZSdcbmltcG9ydCAnLi9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scydcbmltcG9ydCAnLi9ncHMtY2FtZXJhJ1xuaW1wb3J0ICcuL2dwcy1lbnRpdHktcGxhY2UnXG5pbXBvcnQgJy4vZ3BzLXByb2plY3RlZC1jYW1lcmEnXG5pbXBvcnQgJy4vZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UnXG4iXSwic291cmNlUm9vdCI6IiJ9