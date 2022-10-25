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



const ArjsDeviceOrientationControls = function (object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder("YXZ");

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = event;
  };

  var onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function () {
    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent();

    window.addEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.addEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.removeEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    var device = scope.deviceOrientation;

    if (device) {
      var alpha = device.alpha
        ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.alpha) + scope.alphaOffset
        : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.gamma) : 0; // Y''

      var orient = scope.screenOrientation
        ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(scope.screenOrientation)
        : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if (this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
        beta = this._getSmoothedAngle(
          beta + Math.PI,
          this.lastOrientation.beta,
          k
        );
        gamma = this._getSmoothedAngle(
          gamma + this.HALF_PI,
          this.lastOrientation.gamma,
          k,
          Math.PI
        );
      } else {
        beta += Math.PI;
        gamma += this.HALF_PI;
      }

      this.lastOrientation = {
        alpha: alpha,
        beta: beta,
        gamma: gamma,
      };
      setObjectQuaternion(
        scope.object.quaternion,
        alpha,
        beta - Math.PI,
        gamma - this.HALF_PI,
        orient
      );
    }
  };

  // NW Added
  this._orderAngle = function (a, b, range = this.TWO_PI) {
    if (
      (b > a && Math.abs(b - a) < range / 2) ||
      (a > b && Math.abs(b - a) > range / 2)
    ) {
      return { left: a, right: b };
    } else {
      return { left: b, right: a };
    }
  };

  // NW Added
  this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
    const angles = this._orderAngle(a, b, range);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if (angles.right < 0) angles.right += range;
    let newangle =
      origAnglesRight == b
        ? (1 - k) * angles.right + k * angles.left
        : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if (newangle >= range) newangle -= range;
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




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-look-controls", {
  dependencies: ["position", "rotation"],

  schema: {
    enabled: { default: true },
    magicWindowTrackingEnabled: { default: true },
    pointerLockEnabled: { default: false },
    reverseMouseDrag: { default: false },
    reverseTouchDrag: { default: false },
    touchEnabled: { default: true },
    smoothingFactor: { type: "number", default: 1 },
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
      rotation: new THREE.Euler(),
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is("vr-mode")) {
      this.onEnterVR();
    }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls =
        new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__["default"](this.magicWindowObject);
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        magicWindowControls.enabled = false;
        if (
          this.el.sceneEl.components["device-orientation-permission-ui"]
            .permissionGranted
        ) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener(
            "deviceorientationpermissiongranted",
            function () {
              magicWindowControls.enabled = data.magicWindowTrackingEnabled;
            }
          );
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
    if (
      oldData &&
      !data.magicWindowTrackingEnabled &&
      oldData.magicWindowTrackingEnabled
    ) {
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
      if (this.pointerLocked) {
        this.exitPointerLock();
      }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) {
      return;
    }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
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
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(
      this.onPointerLockChange,
      this
    );
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
      sceneEl.addEventListener(
        "render-target-loaded",
        aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this)
      );
      return;
    }

    // Mouse events.
    canvasEl.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("mouseup", this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener("enter-vr", this.onEnterVR);
    sceneEl.addEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener(
        "pointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "mozpointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "pointerlockerror",
        this.onPointerLockError,
        false
      );
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) {
      return;
    }

    // Mouse events.
    canvasEl.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener("enter-vr", this.onEnterVR);
    sceneEl.removeEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener(
      "pointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "mozpointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "pointerlockerror",
      this.onPointerLockError,
      false
    );
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
      if (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(
              object3D.position,
              object3D.rotation,
              object3D.scale
            );
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x =
        this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
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
      magicWindowAbsoluteEuler.setFromQuaternion(
        this.magicWindowObject.quaternion,
        "YXZ"
      );
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y +=
          magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
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
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) {
      return;
    }

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
    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (
      !this.data.enabled ||
      (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected())
    ) {
      return;
    }
    // Handle only primary button.
    if (evt.button !== 0) {
      return;
    }

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
    this.el.sceneEl.canvas.style.cursor = "grabbing";
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "";
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
    if (
      evt.touches.length !== 1 ||
      !this.data.touchEnabled ||
      this.el.sceneEl.is("vr-mode")
    ) {
      return;
    }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
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

    if (!this.touchStarted || !this.data.touchEnabled) {
      return;
    }

    deltaY =
      (2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x)) /
      canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
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
    if (!sceneEl.checkHeadsetConnected()) {
      return;
    }
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
    if (!this.el.sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(
      document.pointerLockElement || document.mozPointerLockElement
    );
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

    function enableGrabCursor() {
      sceneEl.canvas.classList.add("a-grab-cursor");
    }
    function disableGrabCursor() {
      sceneEl.canvas.classList.remove("a-grab-cursor");
    }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener("render-target-loaded", enableGrabCursor);
      } else {
        sceneEl.addEventListener("render-target-loaded", disableGrabCursor);
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

    if (!this.hasSavedPose) {
      return;
    }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  },
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




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-camera", {
  _watchPositionId: null,
  originCoords: null,
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    maxDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 5,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
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
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
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
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
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
      this._watchPositionId = this._initWatchGPS(
        function (position) {
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

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);

    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
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
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
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
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      this.originCoords = this.currentCoords;
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    // compute position.x
    var dstCoords = {
      longitude: this.currentCoords.longitude,
      latitude: this.originCoords.latitude,
    };

    position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.x *=
      this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
      longitude: this.originCoords.longitude,
      latitude: this.currentCoords.latitude,
    };

    position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.z *=
      this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

    // update position
    this.el.setAttribute("position", position);

    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
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
    var distance = this._haversineDist(src, dest);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    // if function has been called for a place, and if it's too far and a max distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.maxDistance &&
      this.data.maxDistance > 0 &&
      distance > this.data.maxDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },

  _haversineDist: function (src, dest) {
    var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
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
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

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
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.Math.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(offset);
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
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


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-camera]");
        if (!camera.components["gps-camera"]) {
          console.error("gps-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-camera"];
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
      var distanceForMsg = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords
      );

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));
      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */
  _updatePosition: function () {
    var position = { x: 0, y: this.el.getAttribute("position").y || 0, z: 0 };

    // update position.x
    var dstCoords = {
      longitude: this.data.longitude,
      latitude: this._cameraGps.originCoords.latitude,
    };

    position.x = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    this._positionXDebug = position.x;

    position.x *=
      this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

    // update position.z
    var dstCoords = {
      longitude: this._cameraGps.originCoords.longitude,
      latitude: this.data.latitude,
    };

    position.z = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    position.z *=
      this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

    if (position.y !== 0) {
      var altitude =
        this._cameraGps.originCoords.altitude !== undefined
          ? this._cameraGps.originCoords.altitude
          : 0;
      position.y = position.y - altitude;
    }

    // update element's position in 3D world
    this.el.setAttribute("position", position);
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
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



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-camera", {
  _watchPositionId: null,
  originCoords: null, // original coords now in Spherical Mercator
  currentCoords: null,
  lookControls: null,
  heading: null,
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
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
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
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
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
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
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
      this._watchPositionId = this._initWatchGPS(
        function (position) {
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

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);
    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
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
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
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
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      // Now store originCoords as PROJECTED original lat/lon, so that
      // we can set the world origin to the original position in "metres"
      this.originCoords = this._project(
        this.currentCoords.latitude,
        this.currentCoords.longitude
      );
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  /**
   * Set the current position (in world coords, based on Spherical Mercator)
   *
   * @returns {void}
   */
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    var worldCoords = this.latLonToWorld(
      this.currentCoords.latitude,
      this.currentCoords.longitude
    );

    position.x = worldCoords[0];
    position.z = worldCoords[1];

    // update position
    this.el.setAttribute("position", position);

    // add the sphmerc position to the event (for testing only)
    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
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
  computeDistanceMeters: function (dest, isPlace) {
    var src = this.el.getAttribute("position");
    var dx = dest.x - src.x;
    var dz = dest.z - src.z;
    var distance = Math.sqrt(dx * dx + dz * dz);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the  method caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
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
  latLonToWorld: function (lat, lon) {
    var projected = this._project(lat, lon);
    // Sign of z needs to be reversed compared to projected coordinates
    return [
      projected[0] - this.originCoords[0],
      -(projected[1] - this.originCoords[1]),
    ];
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
  _project: function (lat, lon) {
    const HALF_EARTH = 20037508.34;

    // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
    // known as 'Google Projection', using the algorithm used extensively
    // in various OpenStreetMap software.
    var y =
      Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
    return [(lon / 180.0) * HALF_EARTH, (y * HALF_EARTH) / 180.0];
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
  _unproject: function (e, n) {
    const HALF_EARTH = 20037508.34;
    var yp = (n / HALF_EARTH) * 180.0;
    return {
      longitude: (e / HALF_EARTH) * 180.0,
      latitude:
        (180.0 / Math.PI) *
        (2 * Math.atan(Math.exp((yp * Math.PI) / 180.0)) - Math.PI / 2),
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
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

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
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = THREE.Math.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.Math.degToRad(src.latitude)) *
        Math.cos(THREE.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
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


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-entity-place", {
  _cameraGps: null,
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
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    // Used now to get the GPS camera when it's been setup
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-projected-camera]");
        if (!camera.components["gps-projected-camera"]) {
          console.error("gps-projected-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-projected-camera"];
        this._updatePosition();
      }
    };

    // update position needs to worry about distance but nothing else?
    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = this.el.getAttribute("position");

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      // _computeDistanceMeters is now going to use the projected
      var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));

      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    // Retain as this event is fired when the GPS camera is set up
    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */

  // set position to world coords using the lat/lon
  _updatePosition: function () {
    var worldPos = this._cameraGps.latLonToWorld(
      this.data.latitude,
      this.data.longitude
    );
    var position = this.el.getAttribute("position");

    // update element's position in 3D world
    //this.el.setAttribute('position', position);
    this.el.setAttribute("position", {
      x: worldPos[0],
      y: position.y,
      z: worldPos[1],
    });
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDemtCZ0M7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUF5QixJQUFJO0FBQ2pELHVCQUF1QiwrQ0FBa0I7QUFDekMsd0JBQXdCLG9EQUF1QixHQUFHLG1CQUFtQjtBQUNyRSxxQkFBcUIsdUNBQVU7QUFDL0I7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSw2QkFBNkIsRUFBRTtBQUMvQjtBQUNBLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWlDO0FBQ0Y7O0FBRS9CLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdktEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVpQzs7QUFFakMscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSwwQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLDBDQUEwQywwQkFBMEI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsVUFBVTtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQ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QUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOOEI7QUFDQztBQUNVO0FBQ25CO0FBQ007QUFDSTtBQUNNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy1sb29rLWNvbnRyb2xzLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2FyanMtd2ViY2FtLXRleHR1cmUuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLWNhbWVyYS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1wcm9qZWN0ZWQtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlLmpzIiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJhZnJhbWVcIixcImNvbW1vbmpzMlwiOlwiYWZyYW1lXCIsXCJhbWRcIjpcImFmcmFtZVwiLFwicm9vdFwiOlwiQUZSQU1FXCJ9Iiwid2VicGFjazovL0FSanMvZXh0ZXJuYWwgdW1kIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykgPT4ge1xucmV0dXJuICIsIi8qKlxuICogQGF1dGhvciByaWNodCAvIGh0dHA6Ly9yaWNodC5tZVxuICogQGF1dGhvciBXZXN0TGFuZ2xleSAvIGh0dHA6Ly9naXRodWIuY29tL1dlc3RMYW5nbGV5XG4gKlxuICogVzNDIERldmljZSBPcmllbnRhdGlvbiBjb250cm9sIChodHRwOi8vdzNjLmdpdGh1Yi5pby9kZXZpY2VvcmllbnRhdGlvbi9zcGVjLXNvdXJjZS1vcmllbnRhdGlvbi5odG1sKVxuICovXG5cbi8qIE5PVEUgdGhhdCB0aGlzIGlzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIHRvXG4gKiBhbGxvdyBleHBvbmVudGlhbCBzbW9vdGhpbmcsIGZvciB1c2UgaW4gQVIuanMuXG4gKlxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcbiAqL1xuXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuY29uc3QgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gIHRoaXMub2JqZWN0LnJvdGF0aW9uLnJlb3JkZXIoXCJZWFpcIik7XG5cbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xuXG4gIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gIHRoaXMuVFdPX1BJID0gMiAqIE1hdGguUEk7XG4gIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG5cbiAgdmFyIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHNjb3BlLmRldmljZU9yaWVudGF0aW9uID0gZXZlbnQ7XG4gIH07XG5cbiAgdmFyIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwO1xuICB9O1xuXG4gIC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcblxuICB2YXIgc2V0T2JqZWN0UXVhdGVybmlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHplZSA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEpO1xuXG4gICAgdmFyIGV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG5cbiAgICB2YXIgcTAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuXG4gICAgdmFyIHExID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oLU1hdGguc3FydCgwLjUpLCAwLCAwLCBNYXRoLnNxcnQoMC41KSk7IC8vIC0gUEkvMiBhcm91bmQgdGhlIHgtYXhpc1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChxdWF0ZXJuaW9uLCBhbHBoYSwgYmV0YSwgZ2FtbWEsIG9yaWVudCkge1xuICAgICAgZXVsZXIuc2V0KGJldGEsIGFscGhhLCAtZ2FtbWEsIFwiWVhaXCIpOyAvLyAnWlhZJyBmb3IgdGhlIGRldmljZSwgYnV0ICdZWFonIGZvciB1c1xuXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihldWxlcik7IC8vIG9yaWVudCB0aGUgZGV2aWNlXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkocTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkocTAuc2V0RnJvbUF4aXNBbmdsZSh6ZWUsIC1vcmllbnQpKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cbiAgICB9O1xuICB9KSgpO1xuXG4gIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJvcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxuICAgICAgb25EZXZpY2VPcmllbnRhdGlvbkNoYW5nZUV2ZW50LFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgc2NvcGUuZW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgdmFyIGRldmljZSA9IHNjb3BlLmRldmljZU9yaWVudGF0aW9uO1xuXG4gICAgaWYgKGRldmljZSkge1xuICAgICAgdmFyIGFscGhhID0gZGV2aWNlLmFscGhhXG4gICAgICAgID8gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXZpY2UuYWxwaGEpICsgc2NvcGUuYWxwaGFPZmZzZXRcbiAgICAgICAgOiAwOyAvLyBaXG5cbiAgICAgIHZhciBiZXRhID0gZGV2aWNlLmJldGEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRldmljZS5iZXRhKSA6IDA7IC8vIFgnXG5cbiAgICAgIHZhciBnYW1tYSA9IGRldmljZS5nYW1tYSA/IFRIUkVFLk1hdGguZGVnVG9SYWQoZGV2aWNlLmdhbW1hKSA6IDA7IC8vIFknJ1xuXG4gICAgICB2YXIgb3JpZW50ID0gc2NvcGUuc2NyZWVuT3JpZW50YXRpb25cbiAgICAgICAgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uKVxuICAgICAgICA6IDA7IC8vIE9cblxuICAgICAgLy8gTlcgQWRkZWQgc21vb3RoaW5nIGNvZGVcbiAgICAgIHZhciBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XG5cbiAgICAgIGlmICh0aGlzLmxhc3RPcmllbnRhdGlvbikge1xuICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoYWxwaGEsIHRoaXMubGFzdE9yaWVudGF0aW9uLmFscGhhLCBrKTtcbiAgICAgICAgYmV0YSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoXG4gICAgICAgICAgYmV0YSArIE1hdGguUEksXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSxcbiAgICAgICAgICBrXG4gICAgICAgICk7XG4gICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcbiAgICAgICAgICBnYW1tYSArIHRoaXMuSEFMRl9QSSxcbiAgICAgICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbi5nYW1tYSxcbiAgICAgICAgICBrLFxuICAgICAgICAgIE1hdGguUElcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJldGEgKz0gTWF0aC5QSTtcbiAgICAgICAgZ2FtbWEgKz0gdGhpcy5IQUxGX1BJO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbiA9IHtcbiAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICBiZXRhOiBiZXRhLFxuICAgICAgICBnYW1tYTogZ2FtbWEsXG4gICAgICB9O1xuICAgICAgc2V0T2JqZWN0UXVhdGVybmlvbihcbiAgICAgICAgc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sXG4gICAgICAgIGFscGhhLFxuICAgICAgICBiZXRhIC0gTWF0aC5QSSxcbiAgICAgICAgZ2FtbWEgLSB0aGlzLkhBTEZfUEksXG4gICAgICAgIG9yaWVudFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gTlcgQWRkZWRcbiAgdGhpcy5fb3JkZXJBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgaWYgKFxuICAgICAgKGIgPiBhICYmIE1hdGguYWJzKGIgLSBhKSA8IHJhbmdlIC8gMikgfHxcbiAgICAgIChhID4gYiAmJiBNYXRoLmFicyhiIC0gYSkgPiByYW5nZSAvIDIpXG4gICAgKSB7XG4gICAgICByZXR1cm4geyBsZWZ0OiBhLCByaWdodDogYiB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBsZWZ0OiBiLCByaWdodDogYSB9O1xuICAgIH1cbiAgfTtcblxuICAvLyBOVyBBZGRlZFxuICB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGssIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICBjb25zdCBhbmdsZXMgPSB0aGlzLl9vcmRlckFuZ2xlKGEsIGIsIHJhbmdlKTtcbiAgICBjb25zdCBhbmdsZXNoaWZ0ID0gYW5nbGVzLmxlZnQ7XG4gICAgY29uc3Qgb3JpZ0FuZ2xlc1JpZ2h0ID0gYW5nbGVzLnJpZ2h0O1xuICAgIGFuZ2xlcy5sZWZ0ID0gMDtcbiAgICBhbmdsZXMucmlnaHQgLT0gYW5nbGVzaGlmdDtcbiAgICBpZiAoYW5nbGVzLnJpZ2h0IDwgMCkgYW5nbGVzLnJpZ2h0ICs9IHJhbmdlO1xuICAgIGxldCBuZXdhbmdsZSA9XG4gICAgICBvcmlnQW5nbGVzUmlnaHQgPT0gYlxuICAgICAgICA/ICgxIC0gaykgKiBhbmdsZXMucmlnaHQgKyBrICogYW5nbGVzLmxlZnRcbiAgICAgICAgOiBrICogYW5nbGVzLnJpZ2h0ICsgKDEgLSBrKSAqIGFuZ2xlcy5sZWZ0O1xuICAgIG5ld2FuZ2xlICs9IGFuZ2xlc2hpZnQ7XG4gICAgaWYgKG5ld2FuZ2xlID49IHJhbmdlKSBuZXdhbmdsZSAtPSByYW5nZTtcbiAgICByZXR1cm4gbmV3YW5nbGU7XG4gIH07XG5cbiAgdGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHNjb3BlLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICB0aGlzLmNvbm5lY3QoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzO1xuIiwiLy8gVG8gYXZvaWQgcmVjYWxjdWxhdGlvbiBhdCBldmVyeSBtb3VzZSBtb3ZlbWVudCB0aWNrXG52YXIgUElfMiA9IE1hdGguUEkgLyAyO1xuXG4vKipcbiAqIGxvb2stY29udHJvbHMuIFVwZGF0ZSBlbnRpdHkgcG9zZSwgZmFjdG9yaW5nIG1vdXNlLCB0b3VjaCwgYW5kIFdlYlZSIEFQSSBkYXRhLlxuICovXG5cbi8qIE5PVEUgdGhhdCB0aGlzIGlzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBBLUZyYW1lJ3MgbG9vay1jb250cm9scyB0b1xuICogYWxsb3cgZXhwb25lbnRpYWwgc21vb3RoaW5nLCBmb3IgdXNlIGluIEFSLmpzLlxuICpcbiAqIE1vZGlmaWNhdGlvbnMgTmljayBXaGl0ZWxlZ2cgKG5pY2t3MSBnaXRodWIpXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBmcm9tIFwiLi9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9sc1wiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJhcmpzLWxvb2stY29udHJvbHNcIiwge1xuICBkZXBlbmRlbmNpZXM6IFtcInBvc2l0aW9uXCIsIFwicm90YXRpb25cIl0sXG5cbiAgc2NoZW1hOiB7XG4gICAgZW5hYmxlZDogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgbWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIHBvaW50ZXJMb2NrRW5hYmxlZDogeyBkZWZhdWx0OiBmYWxzZSB9LFxuICAgIHJldmVyc2VNb3VzZURyYWc6IHsgZGVmYXVsdDogZmFsc2UgfSxcbiAgICByZXZlcnNlVG91Y2hEcmFnOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXG4gICAgdG91Y2hFbmFibGVkOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzbW9vdGhpbmdGYWN0b3I6IHsgdHlwZTogXCJudW1iZXJcIiwgZGVmYXVsdDogMSB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmRlbHRhWWF3ID0gMDtcbiAgICB0aGlzLnByZXZpb3VzSE1EUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMuaG1kUXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlciA9IG5ldyBUSFJFRS5FdWxlcigpO1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0ge307XG4gICAgdGhpcy5kZWx0YVJvdGF0aW9uID0ge307XG4gICAgdGhpcy5zYXZlZFBvc2UgPSBudWxsO1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2V0dXBNb3VzZUNvbnRyb2xzKCk7XG4gICAgdGhpcy5iaW5kTWV0aG9kcygpO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50ID0ge307XG5cbiAgICB0aGlzLnNldHVwTWFnaWNXaW5kb3dDb250cm9scygpO1xuXG4gICAgLy8gVG8gc2F2ZSAvIHJlc3RvcmUgY2FtZXJhIHBvc2VcbiAgICB0aGlzLnNhdmVkUG9zZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygpLFxuICAgICAgcm90YXRpb246IG5ldyBUSFJFRS5FdWxlcigpLFxuICAgIH07XG5cbiAgICAvLyBDYWxsIGVudGVyIFZSIGhhbmRsZXIgaWYgdGhlIHNjZW5lIGhhcyBlbnRlcmVkIFZSIGJlZm9yZSB0aGUgZXZlbnQgbGlzdGVuZXJzIGF0dGFjaGVkLlxuICAgIGlmICh0aGlzLmVsLnNjZW5lRWwuaXMoXCJ2ci1tb2RlXCIpKSB7XG4gICAgICB0aGlzLm9uRW50ZXJWUigpO1xuICAgIH1cbiAgfSxcblxuICBzZXR1cE1hZ2ljV2luZG93Q29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWFnaWNXaW5kb3dDb250cm9scztcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIC8vIE9ubHkgb24gbW9iaWxlIGRldmljZXMgYW5kIG9ubHkgZW5hYmxlZCBpZiBEZXZpY2VPcmllbnRhdGlvbiBwZXJtaXNzaW9uIGhhcyBiZWVuIGdyYW50ZWQuXG4gICAgaWYgKEFGUkFNRS51dGlscy5kZXZpY2UuaXNNb2JpbGUoKSkge1xuICAgICAgbWFnaWNXaW5kb3dDb250cm9scyA9IHRoaXMubWFnaWNXaW5kb3dDb250cm9scyA9XG4gICAgICAgIG5ldyBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyh0aGlzLm1hZ2ljV2luZG93T2JqZWN0KTtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvblxuICAgICAgKSB7XG4gICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmNvbXBvbmVudHNbXCJkZXZpY2Utb3JpZW50YXRpb24tcGVybWlzc2lvbi11aVwiXVxuICAgICAgICAgICAgLnBlcm1pc3Npb25HcmFudGVkXG4gICAgICAgICkge1xuICAgICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRldmljZW9yaWVudGF0aW9ucGVybWlzc2lvbmdyYW50ZWRcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKG9sZERhdGEpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIC8vIERpc2FibGUgZ3JhYiBjdXJzb3IgY2xhc3NlcyBpZiBubyBsb25nZXIgZW5hYmxlZC5cbiAgICBpZiAoZGF0YS5lbmFibGVkICE9PSBvbGREYXRhLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlR3JhYkN1cnNvcihkYXRhLmVuYWJsZWQpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG1hZ2ljIHdpbmRvdyBldWxlcnMgaWYgdHJhY2tpbmcgaXMgZGlzYWJsZWQuXG4gICAgaWYgKFxuICAgICAgb2xkRGF0YSAmJlxuICAgICAgIWRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQgJiZcbiAgICAgIG9sZERhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnNldCgwLCAwLCAwKTtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnNldCgwLCAwLCAwKTtcbiAgICB9XG5cbiAgICAvLyBQYXNzIG9uIG1hZ2ljIHdpbmRvdyB0cmFja2luZyBzZXR0aW5nIHRvIG1hZ2ljV2luZG93Q29udHJvbHMuXG4gICAgaWYgKHRoaXMubWFnaWNXaW5kb3dDb250cm9scykge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLnNtb290aGluZ0ZhY3RvciA9IGRhdGEuc21vb3RoaW5nRmFjdG9yO1xuICAgIH1cblxuICAgIGlmIChvbGREYXRhICYmICFkYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCAhPT0gb2xkRGF0YS5wb2ludGVyTG9ja0VuYWJsZWQpIHtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKHQpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICBpZiAoIWRhdGEuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZU9yaWVudGF0aW9uKCk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICB0aGlzLmV4aXRQb2ludGVyTG9jaygpO1xuICAgIH1cbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcbiAgICB9XG4gIH0sXG5cbiAgYmluZE1ldGhvZHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uTW91c2VEb3duID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlRG93biwgdGhpcyk7XG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZU1vdmUsIHRoaXMpO1xuICAgIHRoaXMub25Nb3VzZVVwID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbk1vdXNlVXAsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaFN0YXJ0ID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpO1xuICAgIHRoaXMub25Ub3VjaE1vdmUgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hFbmQgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xuICAgIHRoaXMub25FbnRlclZSID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbkVudGVyVlIsIHRoaXMpO1xuICAgIHRoaXMub25FeGl0VlIgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uRXhpdFZSLCB0aGlzKTtcbiAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UgPSBBRlJBTUUudXRpbHMuYmluZChcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcbiAgICAgIHRoaXNcbiAgICApO1xuICAgIHRoaXMub25Qb2ludGVyTG9ja0Vycm9yID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsIHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgdXAgc3RhdGVzIGFuZCBPYmplY3QzRHMgbmVlZGVkIHRvIHN0b3JlIHJvdGF0aW9uIGRhdGEuXG4gICAqL1xuICBzZXR1cE1vdXNlQ29udHJvbHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMucGl0Y2hPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnlhd09iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICAgIHRoaXMueWF3T2JqZWN0LnBvc2l0aW9uLnkgPSAxMDtcbiAgICB0aGlzLnlhd09iamVjdC5hZGQodGhpcy5waXRjaE9iamVjdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBtb3VzZSBhbmQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIHRvIGNhbnZhcy5cbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbC5jYW52YXM7XG5cbiAgICAvLyBXYWl0IGZvciBjYW52YXMgdG8gbG9hZC5cbiAgICBpZiAoIWNhbnZhc0VsKSB7XG4gICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwicmVuZGVyLXRhcmdldC1sb2FkZWRcIixcbiAgICAgICAgQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5hZGRFdmVudExpc3RlbmVycywgdGhpcylcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTW91c2UgZXZlbnRzLlxuICAgIGNhbnZhc0VsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMub25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5vbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgIC8vIFRvdWNoIGV2ZW50cy5cbiAgICBjYW52YXNFbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXG4gICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwiZW50ZXItdnJcIiwgdGhpcy5vbkVudGVyVlIpO1xuICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcImV4aXQtdnJcIiwgdGhpcy5vbkV4aXRWUik7XG5cbiAgICAvLyBQb2ludGVyIExvY2sgZXZlbnRzLlxuICAgIGlmICh0aGlzLmRhdGEucG9pbnRlckxvY2tFbmFibGVkKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInBvaW50ZXJsb2NrY2hhbmdlXCIsXG4gICAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcIm1venBvaW50ZXJsb2NrY2hhbmdlXCIsXG4gICAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcInBvaW50ZXJsb2NrZXJyb3JcIixcbiAgICAgICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIG1vdXNlIGFuZCB0b3VjaCBldmVudCBsaXN0ZW5lcnMgZnJvbSBjYW52YXMuXG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwgJiYgc2NlbmVFbC5jYW52YXM7XG5cbiAgICBpZiAoIWNhbnZhc0VsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTW91c2UgZXZlbnRzLlxuICAgIGNhbnZhc0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bik7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIC8vIFRvdWNoIGV2ZW50cy5cbiAgICBjYW52YXNFbC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLm9uVG91Y2hFbmQpO1xuXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXG4gICAgc2NlbmVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZW50ZXItdnJcIiwgdGhpcy5vbkVudGVyVlIpO1xuICAgIHNjZW5lRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImV4aXQtdnJcIiwgdGhpcy5vbkV4aXRWUik7XG5cbiAgICAvLyBQb2ludGVyIExvY2sgZXZlbnRzLlxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInBvaW50ZXJsb2NrY2hhbmdlXCIsXG4gICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW96cG9pbnRlcmxvY2tjaGFuZ2VcIixcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJwb2ludGVybG9ja2Vycm9yXCIsXG4gICAgICB0aGlzLm9uUG9pbnRlckxvY2tFcnJvcixcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIG9yaWVudGF0aW9uIGZvciBtb2JpbGUsIG1vdXNlIGRyYWcsIGFuZCBoZWFkc2V0LlxuICAgKiBNb3VzZS1kcmFnIG9ubHkgZW5hYmxlZCBpZiBITUQgaXMgbm90IGFjdGl2ZS5cbiAgICovXG4gIHVwZGF0ZU9yaWVudGF0aW9uOiAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NlTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSB0aGlzLmVsLm9iamVjdDNEO1xuICAgICAgdmFyIHBpdGNoT2JqZWN0ID0gdGhpcy5waXRjaE9iamVjdDtcbiAgICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcbiAgICAgIHZhciBwb3NlO1xuICAgICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG5cbiAgICAgIC8vIEluIFZSIG1vZGUsIFRIUkVFIGlzIGluIGNoYXJnZSBvZiB1cGRhdGluZyB0aGUgY2FtZXJhIHBvc2UuXG4gICAgICBpZiAoc2NlbmVFbC5pcyhcInZyLW1vZGVcIikgJiYgc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkge1xuICAgICAgICAvLyBXaXRoIFdlYlhSIFRIUkVFIGFwcGxpZXMgaGVhZHNldCBwb3NlIHRvIHRoZSBvYmplY3QzRCBtYXRyaXhXb3JsZCBpbnRlcm5hbGx5LlxuICAgICAgICAvLyBSZWZsZWN0IHZhbHVlcyBiYWNrIG9uIHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUgZm9yIGdldEF0dHJpYnV0ZSB0byByZXR1cm4gdGhlIGV4cGVjdGVkIHZhbHVlcy5cbiAgICAgICAgaWYgKHNjZW5lRWwuaGFzV2ViWFIpIHtcbiAgICAgICAgICBwb3NlID0gc2NlbmVFbC5yZW5kZXJlci54ci5nZXRDYW1lcmFQb3NlKCk7XG4gICAgICAgICAgaWYgKHBvc2UpIHtcbiAgICAgICAgICAgIHBvc2VNYXRyaXguZWxlbWVudHMgPSBwb3NlLnRyYW5zZm9ybS5tYXRyaXg7XG4gICAgICAgICAgICBwb3NlTWF0cml4LmRlY29tcG9zZShcbiAgICAgICAgICAgICAgb2JqZWN0M0QucG9zaXRpb24sXG4gICAgICAgICAgICAgIG9iamVjdDNELnJvdGF0aW9uLFxuICAgICAgICAgICAgICBvYmplY3QzRC5zY2FsZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb24oKTtcblxuICAgICAgLy8gT24gbW9iaWxlLCBkbyBjYW1lcmEgcm90YXRpb24gd2l0aCB0b3VjaCBldmVudHMgYW5kIHNlbnNvcnMuXG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi54ID1cbiAgICAgICAgdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIueCArIHBpdGNoT2JqZWN0LnJvdGF0aW9uLng7XG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi55ID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIueSArIHlhd09iamVjdC5yb3RhdGlvbi55O1xuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueiA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLno7XG4gICAgfTtcbiAgfSkoKSxcblxuICB1cGRhdGVNYWdpY1dpbmRvd09yaWVudGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlciA9IHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyO1xuICAgIHZhciBtYWdpY1dpbmRvd0RlbHRhRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlcjtcbiAgICAvLyBDYWxjdWxhdGUgbWFnaWMgd2luZG93IEhNRCBxdWF0ZXJuaW9uLlxuICAgIGlmICh0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMgJiYgdGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy51cGRhdGUoKTtcbiAgICAgIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci5zZXRGcm9tUXVhdGVybmlvbihcbiAgICAgICAgdGhpcy5tYWdpY1dpbmRvd09iamVjdC5xdWF0ZXJuaW9uLFxuICAgICAgICBcIllYWlwiXG4gICAgICApO1xuICAgICAgaWYgKCF0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgJiYgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnkgIT09IDApIHtcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3KSB7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci54ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLng7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci55ICs9XG4gICAgICAgICAgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnkgLSB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXc7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci56ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLno7XG4gICAgICAgIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVHJhbnNsYXRlIG1vdXNlIGRyYWcgaW50byByb3RhdGlvbi5cbiAgICpcbiAgICogRHJhZ2dpbmcgdXAgYW5kIGRvd24gcm90YXRlcyB0aGUgY2FtZXJhIGFyb3VuZCB0aGUgWC1heGlzICh5YXcpLlxuICAgKiBEcmFnZ2luZyBsZWZ0IGFuZCByaWdodCByb3RhdGVzIHRoZSBjYW1lcmEgYXJvdW5kIHRoZSBZLWF4aXMgKHBpdGNoKS5cbiAgICovXG4gIG9uTW91c2VNb3ZlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICB2YXIgbW92ZW1lbnRYO1xuICAgIHZhciBtb3ZlbWVudFk7XG4gICAgdmFyIHBpdGNoT2JqZWN0ID0gdGhpcy5waXRjaE9iamVjdDtcbiAgICB2YXIgcHJldmlvdXNNb3VzZUV2ZW50ID0gdGhpcy5wcmV2aW91c01vdXNlRXZlbnQ7XG4gICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuXG4gICAgLy8gTm90IGRyYWdnaW5nIG9yIG5vdCBlbmFibGVkLlxuICAgIGlmICghdGhpcy5kYXRhLmVuYWJsZWQgfHwgKCF0aGlzLm1vdXNlRG93biAmJiAhdGhpcy5wb2ludGVyTG9ja2VkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENhbGN1bGF0ZSBkZWx0YS5cbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICBtb3ZlbWVudFggPSBldnQubW92ZW1lbnRYIHx8IGV2dC5tb3pNb3ZlbWVudFggfHwgMDtcbiAgICAgIG1vdmVtZW50WSA9IGV2dC5tb3ZlbWVudFkgfHwgZXZ0Lm1vek1vdmVtZW50WSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3ZlbWVudFggPSBldnQuc2NyZWVuWCAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YO1xuICAgICAgbW92ZW1lbnRZID0gZXZ0LnNjcmVlblkgLSBwcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWTtcbiAgICB9XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWCA9IGV2dC5zY3JlZW5YO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblkgPSBldnQuc2NyZWVuWTtcblxuICAgIC8vIENhbGN1bGF0ZSByb3RhdGlvbi5cbiAgICBkaXJlY3Rpb24gPSB0aGlzLmRhdGEucmV2ZXJzZU1vdXNlRHJhZyA/IDEgOiAtMTtcbiAgICB5YXdPYmplY3Qucm90YXRpb24ueSArPSBtb3ZlbWVudFggKiAwLjAwMiAqIGRpcmVjdGlvbjtcbiAgICBwaXRjaE9iamVjdC5yb3RhdGlvbi54ICs9IG1vdmVtZW50WSAqIDAuMDAyICogZGlyZWN0aW9uO1xuICAgIHBpdGNoT2JqZWN0LnJvdGF0aW9uLnggPSBNYXRoLm1heChcbiAgICAgIC1QSV8yLFxuICAgICAgTWF0aC5taW4oUElfMiwgcGl0Y2hPYmplY3Qucm90YXRpb24ueClcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtb3VzZSBkb3duIHRvIGRldGVjdCBtb3VzZSBkcmFnLlxuICAgKi9cbiAgb25Nb3VzZURvd246IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5kYXRhLmVuYWJsZWQgfHxcbiAgICAgIChzY2VuZUVsLmlzKFwidnItbW9kZVwiKSAmJiBzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBIYW5kbGUgb25seSBwcmltYXJ5IGJ1dHRvbi5cbiAgICBpZiAoZXZ0LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwgJiYgc2NlbmVFbC5jYW52YXM7XG5cbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWCA9IGV2dC5zY3JlZW5YO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblkgPSBldnQuc2NyZWVuWTtcbiAgICB0aGlzLnNob3dHcmFiYmluZ0N1cnNvcigpO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgJiYgIXRoaXMucG9pbnRlckxvY2tlZCkge1xuICAgICAgaWYgKGNhbnZhc0VsLnJlcXVlc3RQb2ludGVyTG9jaykge1xuICAgICAgICBjYW52YXNFbC5yZXF1ZXN0UG9pbnRlckxvY2soKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKSB7XG4gICAgICAgIGNhbnZhc0VsLm1velJlcXVlc3RQb2ludGVyTG9jaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2hvd3MgZ3JhYmJpbmcgY3Vyc29yIG9uIHNjZW5lXG4gICAqL1xuICBzaG93R3JhYmJpbmdDdXJzb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNjZW5lRWwuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiZ3JhYmJpbmdcIjtcbiAgfSxcblxuICAvKipcbiAgICogSGlkZXMgZ3JhYmJpbmcgY3Vyc29yIG9uIHNjZW5lXG4gICAqL1xuICBoaWRlR3JhYmJpbmdDdXJzb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNjZW5lRWwuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIG1vdXNlIHVwIHRvIGRldGVjdCByZWxlYXNlIG9mIG1vdXNlIGRyYWcuXG4gICAqL1xuICBvbk1vdXNlVXA6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZUdyYWJiaW5nQ3Vyc29yKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvdWNoIGRvd24gdG8gZGV0ZWN0IHRvdWNoIGRyYWcuXG4gICAqL1xuICBvblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoXG4gICAgICBldnQudG91Y2hlcy5sZW5ndGggIT09IDEgfHxcbiAgICAgICF0aGlzLmRhdGEudG91Y2hFbmFibGVkIHx8XG4gICAgICB0aGlzLmVsLnNjZW5lRWwuaXMoXCJ2ci1tb2RlXCIpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudG91Y2hTdGFydCA9IHtcbiAgICAgIHg6IGV2dC50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVksXG4gICAgfTtcbiAgICB0aGlzLnRvdWNoU3RhcnRlZCA9IHRydWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSB0b3VjaCBtb3ZlIHRvIFktYXhpcyByb3RhdGlvbi5cbiAgICovXG4gIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICB2YXIgY2FudmFzID0gdGhpcy5lbC5zY2VuZUVsLmNhbnZhcztcbiAgICB2YXIgZGVsdGFZO1xuICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcblxuICAgIGlmICghdGhpcy50b3VjaFN0YXJ0ZWQgfHwgIXRoaXMuZGF0YS50b3VjaEVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWx0YVkgPVxuICAgICAgKDIgKiBNYXRoLlBJICogKGV2dC50b3VjaGVzWzBdLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0LngpKSAvXG4gICAgICBjYW52YXMuY2xpZW50V2lkdGg7XG5cbiAgICBkaXJlY3Rpb24gPSB0aGlzLmRhdGEucmV2ZXJzZVRvdWNoRHJhZyA/IDEgOiAtMTtcbiAgICAvLyBMaW1pdCB0b3VjaCBvcmllbnRhaW9uIHRvIHRvIHlhdyAoeSBheGlzKS5cbiAgICB5YXdPYmplY3Qucm90YXRpb24ueSAtPSBkZWx0YVkgKiAwLjUgKiBkaXJlY3Rpb247XG4gICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xuICAgICAgeDogZXZ0LnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICB5OiBldnQudG91Y2hlc1swXS5wYWdlWSxcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0b3VjaCBlbmQgdG8gZGV0ZWN0IHJlbGVhc2Ugb2YgdG91Y2ggZHJhZy5cbiAgICovXG4gIG9uVG91Y2hFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRvdWNoU3RhcnRlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlIHBvc2UuXG4gICAqL1xuICBvbkVudGVyVlI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICBpZiAoIXNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zYXZlQ2FtZXJhUG9zZSgpO1xuICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMuZWwub2JqZWN0M0Qucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICAgIGlmIChzY2VuZUVsLmhhc1dlYlhSKSB7XG4gICAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QudXBkYXRlTWF0cml4KCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIHRoZSBwb3NlLlxuICAgKi9cbiAgb25FeGl0VlI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwuc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlc3RvcmVDYW1lcmFQb3NlKCk7XG4gICAgdGhpcy5wcmV2aW91c0hNRFBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeEF1dG9VcGRhdGUgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgUG9pbnRlciBMb2NrIHN0YXRlLlxuICAgKi9cbiAgb25Qb2ludGVyTG9ja0NoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9ICEhKFxuICAgICAgZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50IHx8IGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudFxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlY292ZXIgZnJvbSBQb2ludGVyIExvY2sgZXJyb3IuXG4gICAqL1xuICBvblBvaW50ZXJMb2NrRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvLyBFeGl0cyBwb2ludGVyLWxvY2tlZCBtb2RlLlxuICBleGl0UG9pbnRlckxvY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBmZWF0dXJlIG9mIHNob3dpbmcvaGlkaW5nIHRoZSBncmFiIGN1cnNvci5cbiAgICovXG4gIHVwZGF0ZUdyYWJDdXJzb3I6IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG5cbiAgICBmdW5jdGlvbiBlbmFibGVHcmFiQ3Vyc29yKCkge1xuICAgICAgc2NlbmVFbC5jYW52YXMuY2xhc3NMaXN0LmFkZChcImEtZ3JhYi1jdXJzb3JcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpc2FibGVHcmFiQ3Vyc29yKCkge1xuICAgICAgc2NlbmVFbC5jYW52YXMuY2xhc3NMaXN0LnJlbW92ZShcImEtZ3JhYi1jdXJzb3JcIik7XG4gICAgfVxuXG4gICAgaWYgKCFzY2VuZUVsLmNhbnZhcykge1xuICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKFwicmVuZGVyLXRhcmdldC1sb2FkZWRcIiwgZW5hYmxlR3JhYkN1cnNvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJyZW5kZXItdGFyZ2V0LWxvYWRlZFwiLCBkaXNhYmxlR3JhYkN1cnNvcik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIGVuYWJsZUdyYWJDdXJzb3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGlzYWJsZUdyYWJDdXJzb3IoKTtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZSBjYW1lcmEgcG9zZSBiZWZvcmUgZW50ZXJpbmcgVlIgdG8gcmVzdG9yZSBsYXRlciBpZiBleGl0aW5nLlxuICAgKi9cbiAgc2F2ZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuXG4gICAgdGhpcy5zYXZlZFBvc2UucG9zaXRpb24uY29weShlbC5vYmplY3QzRC5wb3NpdGlvbik7XG4gICAgdGhpcy5zYXZlZFBvc2Uucm90YXRpb24uY29weShlbC5vYmplY3QzRC5yb3RhdGlvbik7XG4gICAgdGhpcy5oYXNTYXZlZFBvc2UgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNldCBjYW1lcmEgcG9zZSB0byBiZWZvcmUgZW50ZXJpbmcgVlIuXG4gICAqL1xuICByZXN0b3JlQ2FtZXJhUG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWw7XG4gICAgdmFyIHNhdmVkUG9zZSA9IHRoaXMuc2F2ZWRQb3NlO1xuXG4gICAgaWYgKCF0aGlzLmhhc1NhdmVkUG9zZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGNhbWVyYSBvcmllbnRhdGlvbi5cbiAgICBlbC5vYmplY3QzRC5wb3NpdGlvbi5jb3B5KHNhdmVkUG9zZS5wb3NpdGlvbik7XG4gICAgZWwub2JqZWN0M0Qucm90YXRpb24uY29weShzYXZlZFBvc2Uucm90YXRpb24pO1xuICAgIHRoaXMuaGFzU2F2ZWRQb3NlID0gZmFsc2U7XG4gIH0sXG59KTtcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy13ZWJjYW0tdGV4dHVyZVwiLCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHRoaXMudGV4Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwicGxheXNpbmxpbmVcIiwgdHJ1ZSk7XG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgIHRoaXMuZ2VvbSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCk7IC8vMC41LCAwLjUpO1xuICAgIHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5WaWRlb1RleHR1cmUodGhpcy52aWRlbyk7XG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb20sIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMudGV4U2NlbmUuYWRkKG1lc2gpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgYFdlYmNhbSBlcnJvcjogJHtlfWBcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLnJlbmRlcih0aGlzLnRleFNjZW5lLCB0aGlzLnRleENhbWVyYSk7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgdHJhY2suc3RvcCgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcbiAgfSxcbn0pO1xuIiwiLypcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtY2FtZXJhXCIsIHtcbiAgX3dhdGNoUG9zaXRpb25JZDogbnVsbCxcbiAgb3JpZ2luQ29vcmRzOiBudWxsLFxuICBjdXJyZW50Q29vcmRzOiBudWxsLFxuICBsb29rQ29udHJvbHM6IG51bGwsXG4gIGhlYWRpbmc6IG51bGwsXG4gIHNjaGVtYToge1xuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMTAwLFxuICAgIH0sXG4gICAgYWxlcnQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBtaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBtYXhEaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJpbnRcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDUsXG4gICAgfSxcbiAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH0sXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1sb29rLWNvbnRyb2xzXCJdICYmXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICBsb25naXR1ZGU6IDAsXG4gICAgfTtcblxuICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QuYWRkKFwiYXJqcy1sb2FkZXJcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRlcik7XG5cbiAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCA9IHRoaXMuX29uR3BzRW50aXR5UGxhY2VBZGRlZC5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsXG4gICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZFxuICAgICk7XG5cbiAgICB0aGlzLmxvb2tDb250cm9scyA9XG4gICAgICB0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gfHxcbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl07XG5cbiAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uID0gdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgLy8gaWYgU2FmYXJpXG4gICAgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcL1tcXGQuXSsuKlNhZmFyaS8pKSB7XG4gICAgICAvLyBpT1MgMTMrXG4gICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xuICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcInRvdWNoZW5kXCIsXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgIFwiQWZ0ZXIgY2FtZXJhIHBlcm1pc3Npb24gcHJvbXB0LCBwbGVhc2UgdGFwIHRoZSBzY3JlZW4gdG8gYWN0aXZhdGUgZ2VvbG9jYXRpb24uXCJcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcbiAgICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9LCA3NTApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XG4gICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKFxuICAgICAgICBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBhbHRpdHVkZTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlLFxuICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgIHZhciBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KFxuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGRpc3RNb3ZlZCA+PSB0aGlzLmRhdGEuZ3BzTWluRGlzdGFuY2UgfHwgIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZVJvdGF0aW9uKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLl93YXRjaFBvc2l0aW9uSWQpO1xuICAgIH1cbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICovXG4gIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvdykge1xuICAgICAgdmFyIGV2ZW50TmFtZSA9IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiO1xuICAgIH0gZWxzZSBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uXCIgaW4gd2luZG93KSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJcIjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wYXNzIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZW50TmFtZTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25TdWNjZXNzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICBvbkVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJFUlJPUihcIiArIGVyci5jb2RlICsgXCIpOiBcIiArIGVyci5tZXNzYWdlKTtcblxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAvLyBVc2VyIGRlbmllZCBHZW9Mb2NhdGlvbiwgbGV0IHRoZWlyIGtub3cgdGhhdFxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBcIlBsZWFzZSBhY3RpdmF0ZSBHZW9sb2NhdGlvbiBhbmQgcmVmcmVzaCB0aGUgcGFnZS4gSWYgaXQgaXMgYWxyZWFkeSBhY3RpdmUsIHBsZWFzZSBjaGVjayBwZXJtaXNzaW9ucyBmb3IgdGhpcyB3ZWJzaXRlLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJDYW5ub3QgcmV0cmlldmUgR1BTIHBvc2l0aW9uLiBTaWduYWwgaXMgYWJzZW50LlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XG4gICAgICBvbkVycm9yKHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogXCJHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlclwiLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dlb2xvY2F0aW9uL3dhdGNoUG9zaXRpb25cbiAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgICAgdGltZW91dDogMjcwMDAsXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIC8vIGRvbid0IHVwZGF0ZSBpZiBhY2N1cmFjeSBpcyBub3QgZ29vZCBlbm91Z2hcbiAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5ID4gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIikpIHtcbiAgICAgICAgdmFyIHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcG9wdXAuaW5uZXJIVE1MID1cbiAgICAgICAgICBcIkdQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuXCI7XG4gICAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYWxlcnQtcG9wdXBcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhbGVydFBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1wb3B1cFwiKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiZcbiAgICAgIGFsZXJ0UG9wdXBcbiAgICApIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgLy8gZmlyc3QgY2FtZXJhIGluaXRpYWxpemF0aW9uXG4gICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IHRoaXMuY3VycmVudENvb3JkcztcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG5cbiAgICAgIHZhciBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFyanMtbG9hZGVyXCIpO1xuICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgIH1cbiAgfSxcbiAgX3NldFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcblxuICAgIC8vIGNvbXB1dGUgcG9zaXRpb24ueFxuICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZTogdGhpcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUsXG4gICAgfTtcblxuICAgIHBvc2l0aW9uLnggPSB0aGlzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcbiAgICBwb3NpdGlvbi54ICo9XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlID4gdGhpcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlID8gMSA6IC0xO1xuXG4gICAgLy8gY29tcHV0ZSBwb3NpdGlvbi56XG4gICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlLFxuICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcbiAgICB9O1xuXG4gICAgcG9zaXRpb24ueiA9IHRoaXMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuICAgIHBvc2l0aW9uLnogKj1cbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSA+IHRoaXMub3JpZ2luQ29vcmRzLmxhdGl0dWRlID8gLTEgOiAxO1xuXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBwb3NpdGlvbik7XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgZGlzdGFuY2UgaW4gbWV0ZXJzIGJldHdlZW4gc291cmNlIGFuZCBkZXN0aW5hdGlvbiBpbnB1dHMuXG4gICAqXG4gICAqICBDYWxjdWxhdGUgZGlzdGFuY2UsIGJlYXJpbmcgYW5kIG1vcmUgYmV0d2VlbiBMYXRpdHVkZS9Mb25naXR1ZGUgcG9pbnRzXG4gICAqICBEZXRhaWxzOiBodHRwczovL3d3dy5tb3ZhYmxlLXR5cGUuY28udWsvc2NyaXB0cy9sYXRsb25nLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIHtQb3NpdGlvbn0gc3JjXG4gICAqIEBwYXJhbSB7UG9zaXRpb259IGRlc3RcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGRpc3RhbmNlIHwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICovXG4gIGNvbXB1dGVEaXN0YW5jZU1ldGVyczogZnVuY3Rpb24gKHNyYywgZGVzdCwgaXNQbGFjZSkge1xuICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3Qoc3JjLCBkZXN0KTtcblxuICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIG5lYXIgYW5kIGEgbWluIGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgY2FsbGVyXG4gICAgaWYgKFxuICAgICAgaXNQbGFjZSAmJlxuICAgICAgdGhpcy5kYXRhLm1pbkRpc3RhbmNlICYmXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgPiAwICYmXG4gICAgICBkaXN0YW5jZSA8IHRoaXMuZGF0YS5taW5EaXN0YW5jZVxuICAgICkge1xuICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cblxuICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIGZhciBhbmQgYSBtYXggZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSBjYWxsZXJcbiAgICBpZiAoXG4gICAgICBpc1BsYWNlICYmXG4gICAgICB0aGlzLmRhdGEubWF4RGlzdGFuY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5tYXhEaXN0YW5jZSA+IDAgJiZcbiAgICAgIGRpc3RhbmNlID4gdGhpcy5kYXRhLm1heERpc3RhbmNlXG4gICAgKSB7XG4gICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlO1xuICB9LFxuXG4gIF9oYXZlcnNpbmVEaXN0OiBmdW5jdGlvbiAoc3JjLCBkZXN0KSB7XG4gICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XG4gICAgdmFyIGRsYXRpdHVkZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICB2YXIgYSA9XG4gICAgICBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICtcbiAgICAgIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKlxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgIHZhciBhbmdsZSA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgfSxcblxuICAvKipcbiAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxuICAgKiBAcGFyYW0ge251bWJlcn0gZ2FtbWFcbiAgICpcbiAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXG4gICAqL1xuICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hKSB7XG4gICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcbiAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICB2YXIgYmV0YVJhZCA9IGJldGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgIHZhciBjQSA9IE1hdGguY29zKGFscGhhUmFkKTtcbiAgICB2YXIgc0EgPSBNYXRoLnNpbihhbHBoYVJhZCk7XG4gICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgdmFyIGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpO1xuICAgIHZhciBzRyA9IE1hdGguc2luKGdhbW1hUmFkKTtcblxuICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICB2YXIgckEgPSAtY0EgKiBzRyAtIHNBICogc0IgKiBjRztcbiAgICB2YXIgckIgPSAtc0EgKiBzRyArIGNBICogc0IgKiBjRztcblxuICAgIC8vIENhbGN1bGF0ZSBjb21wYXNzIGhlYWRpbmdcbiAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAvLyBDb252ZXJ0IGZyb20gaGFsZiB1bml0IGNpcmNsZSB0byB3aG9sZSB1bml0IGNpcmNsZVxuICAgIGlmIChyQiA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XG4gICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXG4gICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgIHJldHVybiBjb21wYXNzSGVhZGluZztcbiAgfSxcblxuICAvKipcbiAgICogSGFuZGxlciBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeSA8IDUwKSB7XG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwid2Via2l0Q29tcGFzc0FjY3VyYWN5IGlzIGV2ZW50LndlYmtpdENvbXBhc3NBY2N1cmFjeVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XG4gICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgPT09IHRydWUgfHwgZXZlbnQuYWJzb2x1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSB0aGlzLl9jb21wdXRlQ29tcGFzc0hlYWRpbmcoXG4gICAgICAgICAgZXZlbnQuYWxwaGEsXG4gICAgICAgICAgZXZlbnQuYmV0YSxcbiAgICAgICAgICBldmVudC5nYW1tYVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJldmVudC5hbHBoYSA9PT0gbnVsbFwiKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyIHJvdGF0aW9uIGRhdGEuXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgX3VwZGF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhlYWRpbmcgPSAzNjAgLSB0aGlzLmhlYWRpbmc7XG4gICAgdmFyIGNhbWVyYVJvdGF0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJyb3RhdGlvblwiKS55O1xuICAgIHZhciB5YXdSb3RhdGlvbiA9IFRIUkVFLk1hdGgucmFkVG9EZWcoXG4gICAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueVxuICAgICk7XG4gICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcbiAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSA9IFRIUkVFLk1hdGguZGVnVG9SYWQob2Zmc2V0KTtcbiAgfSxcblxuICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICBpZiAodGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlciAmJiB0aGlzLmxvYWRlci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubG9hZGVyKTtcbiAgICB9XG4gIH0sXG59KTtcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1lbnRpdHktcGxhY2VcIiwge1xuICBfY2FtZXJhR3BzOiBudWxsLFxuICBzY2hlbWE6IHtcbiAgICBsb25naXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgbGF0aXR1ZGU6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgIC8vIGNsZWFuaW5nIGxpc3RlbmVycyB3aGVuIHRoZSBlbnRpdHkgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIsXG4gICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXJcbiAgICApO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLFxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyXG4gICAgKTtcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1jYW1lcmFdXCIpO1xuICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLWNhbWVyYVwiXSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJncHMtY2FtZXJhIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtY2FtZXJhXCJdO1xuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyID0gKGV2KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGF0YSB8fCAhdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmRhdGEubG9uZ2l0dWRlLFxuICAgICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLmxhdGl0dWRlLFxuICAgICAgfTtcblxuICAgICAgLy8gaXQncyBhY3R1YWxseSBhICdkaXN0YW5jZSBwbGFjZScsIGJ1dCB3ZSBkb24ndCBjYWxsIGl0IHdpdGggbGFzdCBwYXJhbSwgYmVjYXVzZSB3ZSB3YW50IHRvIHJldHJpZXZlIGRpc3RhbmNlIGV2ZW4gaWYgaXQncyA8IG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAgICB2YXIgZGlzdGFuY2VGb3JNc2cgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxuICAgICAgICBldi5kZXRhaWwucG9zaXRpb24sXG4gICAgICAgIGRzdENvb3Jkc1xuICAgICAgKTtcblxuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkaXN0YW5jZVwiLCBkaXN0YW5jZUZvck1zZyk7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlTXNnXCIsIHRoaXMuX2Zvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtdXBkYXRlLXBvc2l0aW9uXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0sXG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICB2YXIgYWN0dWFsRGlzdGFuY2UgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxuICAgICAgICBldi5kZXRhaWwucG9zaXRpb24sXG4gICAgICAgIGRzdENvb3JkcyxcbiAgICAgICAgdHJ1ZVxuICAgICAgKTtcblxuICAgICAgaWYgKGFjdHVhbERpc3RhbmNlID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiLFxuICAgICAgdGhpcy5jb29yZFNldExpc3RlbmVyXG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIixcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxuICAgICk7XG5cbiAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IDA7XG5cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwge1xuICAgICAgICBkZXRhaWw6IHsgY29tcG9uZW50OiB0aGlzLmVsIH0sXG4gICAgICB9KVxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBIaWRlIGVudGl0eSBhY2NvcmRpbmcgdG8gbWluRGlzdGFuY2UgcHJvcGVydHlcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBoaWRlRm9yTWluRGlzdGFuY2U6IGZ1bmN0aW9uIChlbCwgaGlkZUVudGl0eSkge1xuICAgIGlmIChoaWRlRW50aXR5KSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ2aXNpYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJ0cnVlXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZSBwbGFjZSBwb3NpdGlvblxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHsgeDogMCwgeTogdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKS55IHx8IDAsIHo6IDAgfTtcblxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbi54XG4gICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlOiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxhdGl0dWRlLFxuICAgIH07XG5cbiAgICBwb3NpdGlvbi54ID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcbiAgICAgIHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMsXG4gICAgICBkc3RDb29yZHNcbiAgICApO1xuXG4gICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSBwb3NpdGlvbi54O1xuXG4gICAgcG9zaXRpb24ueCAqPVxuICAgICAgdGhpcy5kYXRhLmxvbmdpdHVkZSA+IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlID8gMSA6IC0xO1xuXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uLnpcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgbG9uZ2l0dWRlOiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubGF0aXR1ZGUsXG4gICAgfTtcblxuICAgIHBvc2l0aW9uLnogPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxuICAgICAgdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcyxcbiAgICAgIGRzdENvb3Jkc1xuICAgICk7XG5cbiAgICBwb3NpdGlvbi56ICo9XG4gICAgICB0aGlzLmRhdGEubGF0aXR1ZGUgPiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxhdGl0dWRlID8gLTEgOiAxO1xuXG4gICAgaWYgKHBvc2l0aW9uLnkgIT09IDApIHtcbiAgICAgIHZhciBhbHRpdHVkZSA9XG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5hbHRpdHVkZVxuICAgICAgICAgIDogMDtcbiAgICAgIHBvc2l0aW9uLnkgPSBwb3NpdGlvbi55IC0gYWx0aXR1ZGU7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgcG9zaXRpb24pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JtYXQgZGlzdGFuY2VzIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGlzdGFuY2VcbiAgICovXG5cbiAgX2Zvcm1hdERpc3RhbmNlOiBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcbiAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMCk7XG5cbiAgICBpZiAoZGlzdGFuY2UgPj0gMTAwMCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlIC8gMTAwMCArIFwiIGtpbG9tZXRlcnNcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzdGFuY2UgKyBcIiBtZXRlcnNcIjtcbiAgfSxcbn0pO1xuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtY2FtZXJhXG4gKlxuICogYmFzZWQgb24gdGhlIG9yaWdpbmFsIGdwcy1jYW1lcmEsIG1vZGlmaWVkIGJ5IG5pY2t3IDAyLzA0LzIwXG4gKlxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcbiAqIGVudGl0aWVzIG9yIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiwgdGhpcyB2ZXJzaW9uXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxuICpcbiAqIFRoZSBvcmlnaW5hbCBwb3NpdGlvbiAobGF0L2xvbikgaXMgcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZFxuICogc3RvcmVkLlxuICpcbiAqIFRoZW4sIHdoZW4gd2UgcmVjZWl2ZSBhIG5ldyBwb3NpdGlvbiAobGF0L2xvbiksIHRoaXMgbmV3IHBvc2l0aW9uIGlzXG4gKiBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgTWVyY2F0b3IgYW5kIHRoZW4gaXRzIHdvcmxkIHBvc2l0aW9uIGNhbGN1bGF0ZWRcbiAqIGJ5IGNvbXBhcmluZyBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBwb3NpdGlvbi5cbiAqXG4gKiBUaGUgc2FtZSBpcyBhbHNvIHRoZSBjYXNlIGZvciAnZW50aXR5LXBsYWNlcyc7IHdoZW4gdGhlc2UgYXJlIGFkZGVkLCB0aGVpclxuICogU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmUgY2FsY3VsYXRlZCAoc2VlIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlKS5cbiAqXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXG4gKiBmb3IgbWFueSBhcmVhcyBvZiB0aGUgd29ybGQgYW5kIGFwcGVhciBub3QgdG8gY2F1c2UgdW5hY2NlcHRhYmxlIGRpc3RvcnRpb25zXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxuICpcbiAqIFVQREFURVMgMjgvMDgvMjA6XG4gKlxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XG4gKiBmcmVxdWVudGx5IEdQUyB1cGRhdGVzIGFyZSBwcm9jZXNzZWQuIEFpbSBpcyB0byBwcmV2ZW50ICdzdHV0dGVyaW5nJ1xuICogZWZmZWN0cyB3aGVuIGNsb3NlIHRvIEFSIGNvbnRlbnQgZHVlIHRvIGNvbnRpbnVvdXMgc21hbGwgY2hhbmdlcyBpblxuICogbG9jYXRpb24uXG4gKi9cblxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLXByb2plY3RlZC1jYW1lcmFcIiwge1xuICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxuICBvcmlnaW5Db29yZHM6IG51bGwsIC8vIG9yaWdpbmFsIGNvb3JkcyBub3cgaW4gU3BoZXJpY2FsIE1lcmNhdG9yXG4gIGN1cnJlbnRDb29yZHM6IG51bGwsXG4gIGxvb2tDb250cm9sczogbnVsbCxcbiAgaGVhZGluZzogbnVsbCxcbiAgc2NoZW1hOiB7XG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcbiAgICAgIHR5cGU6IFwiaW50XCIsXG4gICAgICBkZWZhdWx0OiAxMDAsXG4gICAgfSxcbiAgICBhbGVydDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIG1pbkRpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcImludFwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGdwc01pbkRpc3RhbmNlOiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIGdwc1RpbWVJbnRlcnZhbDoge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xuICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XG4gICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuXG4gICAgICAvLyByZS10cmlnZ2VyIGluaXRpYWxpemF0aW9uIGZvciBuZXcgb3JpZ2luXG4gICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IG51bGw7XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gJiZcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJsb29rLWNvbnRyb2xzXCJdXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICBsYXRpdHVkZTogMCxcbiAgICAgIGxvbmdpdHVkZTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy5sb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJhcmpzLWxvYWRlclwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubG9hZGVyKTtcblxuICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXG4gICAgKTtcblxuICAgIHRoaXMubG9va0NvbnRyb2xzID1cbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImFyanMtbG9vay1jb250cm9sc1wiXSB8fFxuICAgICAgdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXTtcblxuICAgIC8vIGxpc3RlbiB0byBkZXZpY2VvcmllbnRhdGlvbiBldmVudFxuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XG5cbiAgICAvLyBpZiBTYWZhcmlcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgIC8vIGlPUyAxMytcbiAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBkZXZpY2Ugb3JpZW50YXRpb24gcGVybWlzc2lvbnMuLi5cIik7XG4gICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwidG91Y2hlbmRcIixcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBoYW5kbGVyKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgXCJBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi5cIlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy5cIlxuICAgICAgICAgICk7XG4gICAgICAgIH0sIDc1MCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSB0aGlzLl9pbml0V2F0Y2hHUFMoXG4gICAgICAgIGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGFsdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGUsXG4gICAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgdmFyIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QoXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3Jkc1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmhlYWRpbmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fdXBkYXRlUm90YXRpb24oKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgfVxuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICovXG4gIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xuICAgIGlmIChcIm9uZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiIGluIHdpbmRvdykge1xuICAgICAgdmFyIGV2ZW50TmFtZSA9IFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiO1xuICAgIH0gZWxzZSBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uXCIgaW4gd2luZG93KSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJkZXZpY2VvcmllbnRhdGlvblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJcIjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wYXNzIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV2ZW50TmFtZTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdXNlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb25TdWNjZXNzXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uRXJyb3JcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBfaW5pdFdhdGNoR1BTOiBmdW5jdGlvbiAob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgaWYgKCFvbkVycm9yKSB7XG4gICAgICBvbkVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJFUlJPUihcIiArIGVyci5jb2RlICsgXCIpOiBcIiArIGVyci5tZXNzYWdlKTtcblxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICAvLyBVc2VyIGRlbmllZCBHZW9Mb2NhdGlvbiwgbGV0IHRoZWlyIGtub3cgdGhhdFxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXG4gICAgICAgICAgICBcIlBsZWFzZSBhY3RpdmF0ZSBHZW9sb2NhdGlvbiBhbmQgcmVmcmVzaCB0aGUgcGFnZS4gSWYgaXQgaXMgYWxyZWFkeSBhY3RpdmUsIHBsZWFzZSBjaGVjayBwZXJtaXNzaW9ucyBmb3IgdGhpcyB3ZWJzaXRlLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxuICAgICAgICAgICAgXCJDYW5ub3QgcmV0cmlldmUgR1BTIHBvc2l0aW9uLiBTaWduYWwgaXMgYWJzZW50LlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XG4gICAgICBvbkVycm9yKHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogXCJHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlclwiLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dlb2xvY2F0aW9uL3dhdGNoUG9zaXRpb25cbiAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgICAgdGltZW91dDogMjcwMDAsXG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB1c2VyIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIC8vIGRvbid0IHVwZGF0ZSBpZiBhY2N1cmFjeSBpcyBub3QgZ29vZCBlbm91Z2hcbiAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5ID4gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIikpIHtcbiAgICAgICAgdmFyIHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcG9wdXAuaW5uZXJIVE1MID1cbiAgICAgICAgICBcIkdQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuXCI7XG4gICAgICAgIHBvcHVwLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiYWxlcnQtcG9wdXBcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhbGVydFBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1wb3B1cFwiKTtcbiAgICBpZiAoXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiZcbiAgICAgIGFsZXJ0UG9wdXBcbiAgICApIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xuICAgICAgLy8gZmlyc3QgY2FtZXJhIGluaXRpYWxpemF0aW9uXG4gICAgICAvLyBOb3cgc3RvcmUgb3JpZ2luQ29vcmRzIGFzIFBST0pFQ1RFRCBvcmlnaW5hbCBsYXQvbG9uLCBzbyB0aGF0XG4gICAgICAvLyB3ZSBjYW4gc2V0IHRoZSB3b3JsZCBvcmlnaW4gdG8gdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIFwibWV0cmVzXCJcbiAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gdGhpcy5fcHJvamVjdChcbiAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlXG4gICAgICApO1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcblxuICAgICAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYXJqcy1sb2FkZXJcIik7XG4gICAgICBpZiAobG9hZGVyKSB7XG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IHBvc2l0aW9uIChpbiB3b3JsZCBjb29yZHMsIGJhc2VkIG9uIFNwaGVyaWNhbCBNZXJjYXRvcilcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIpO1xuXG4gICAgdmFyIHdvcmxkQ29vcmRzID0gdGhpcy5sYXRMb25Ub1dvcmxkKFxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZVxuICAgICk7XG5cbiAgICBwb3NpdGlvbi54ID0gd29ybGRDb29yZHNbMF07XG4gICAgcG9zaXRpb24ueiA9IHdvcmxkQ29vcmRzWzFdO1xuXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBwb3NpdGlvbik7XG5cbiAgICAvLyBhZGQgdGhlIHNwaG1lcmMgcG9zaXRpb24gdG8gdGhlIGV2ZW50IChmb3IgdGVzdGluZyBvbmx5KVxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgICBkZXRhaWw6IHsgcG9zaXRpb246IHRoaXMuY3VycmVudENvb3Jkcywgb3JpZ2luOiB0aGlzLm9yaWdpbkNvb3JkcyB9LFxuICAgICAgfSlcbiAgICApO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyBkaXN0YW5jZSBpbiBtZXRlcnMgYmV0d2VlbiBjYW1lcmEgYW5kIGRlc3RpbmF0aW9uIGlucHV0LlxuICAgKlxuICAgKiBBc3N1bWUgd2UgYXJlIHVzaW5nIGEgbWV0cmUtYmFzZWQgcHJvamVjdGlvbi4gTm90IGFsbCAnbWV0cmUtYmFzZWQnXG4gICAqIHByb2plY3Rpb25zIGdpdmUgZXhhY3QgbWV0cmVzLCBlLmcuIFNwaGVyaWNhbCBNZXJjYXRvciwgYnV0IGl0IGFwcGVhcnNcbiAgICogY2xvc2UgZW5vdWdoIHRvIGJlIHVzZWQgZm9yIEFSIGF0IGxlYXN0IGluIG1pZGRsZSB0ZW1wZXJhdGVcbiAgICogbGF0aXR1ZGVzICg0MCAtIDU1KS4gSXQgaXMgaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMsIGhvd2V2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7UG9zaXRpb259IGRlc3RcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGRpc3RhbmNlIHwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICovXG4gIGNvbXB1dGVEaXN0YW5jZU1ldGVyczogZnVuY3Rpb24gKGRlc3QsIGlzUGxhY2UpIHtcbiAgICB2YXIgc3JjID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcbiAgICB2YXIgZHggPSBkZXN0LnggLSBzcmMueDtcbiAgICB2YXIgZHogPSBkZXN0LnogLSBzcmMuejtcbiAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR6ICogZHopO1xuXG4gICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gbmVhciBhbmQgYSBtaW4gZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSAgbWV0aG9kIGNhbGxlclxuICAgIGlmIChcbiAgICAgIGlzUGxhY2UgJiZcbiAgICAgIHRoaXMuZGF0YS5taW5EaXN0YW5jZSAmJlxuICAgICAgdGhpcy5kYXRhLm1pbkRpc3RhbmNlID4gMCAmJlxuICAgICAgZGlzdGFuY2UgPCB0aGlzLmRhdGEubWluRGlzdGFuY2VcbiAgICApIHtcbiAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzdGFuY2U7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gT3BlbkdMIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgKlxuICAgKiBGaXJzdCBwcm9qZWN0cyBsYXQvbG9uIHRvIGFic29sdXRlIFNwaGVyaWNhbCBNZXJjYXRvciBhbmQgdGhlblxuICAgKiBjYWxjdWxhdGVzIHRoZSB3b3JsZCBjb29yZGluYXRlcyBieSBjb21wYXJpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvclxuICAgKiBjb29yZGluYXRlcyB3aXRoIHRoZSBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMgb2YgdGhlIG9yaWdpbiBwb2ludC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxhdFxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXG4gICAqXG4gICAqIEByZXR1cm5zIHthcnJheX0gd29ybGQgY29vcmRpbmF0ZXNcbiAgICovXG4gIGxhdExvblRvV29ybGQ6IGZ1bmN0aW9uIChsYXQsIGxvbikge1xuICAgIHZhciBwcm9qZWN0ZWQgPSB0aGlzLl9wcm9qZWN0KGxhdCwgbG9uKTtcbiAgICAvLyBTaWduIG9mIHogbmVlZHMgdG8gYmUgcmV2ZXJzZWQgY29tcGFyZWQgdG8gcHJvamVjdGVkIGNvb3JkaW5hdGVzXG4gICAgcmV0dXJuIFtcbiAgICAgIHByb2plY3RlZFswXSAtIHRoaXMub3JpZ2luQ29vcmRzWzBdLFxuICAgICAgLShwcm9qZWN0ZWRbMV0gLSB0aGlzLm9yaWdpbkNvb3Jkc1sxXSksXG4gICAgXTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlcnRzIGxhdGl0dWRlL2xvbmdpdHVkZSB0byBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMuXG4gICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxhdFxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXG4gICAqXG4gICAqIEByZXR1cm5zIHthcnJheX0gU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzXG4gICAqL1xuICBfcHJvamVjdDogZnVuY3Rpb24gKGxhdCwgbG9uKSB7XG4gICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuXG4gICAgLy8gQ29udmVydCB0aGUgc3VwcGxpZWQgY29vcmRzIHRvIFNwaGVyaWNhbCBNZXJjYXRvciAoRVBTRzozODU3KSwgYWxzb1xuICAgIC8vIGtub3duIGFzICdHb29nbGUgUHJvamVjdGlvbicsIHVzaW5nIHRoZSBhbGdvcml0aG0gdXNlZCBleHRlbnNpdmVseVxuICAgIC8vIGluIHZhcmlvdXMgT3BlblN0cmVldE1hcCBzb2Z0d2FyZS5cbiAgICB2YXIgeSA9XG4gICAgICBNYXRoLmxvZyhNYXRoLnRhbigoKDkwICsgbGF0KSAqIE1hdGguUEkpIC8gMzYwLjApKSAvIChNYXRoLlBJIC8gMTgwLjApO1xuICAgIHJldHVybiBbKGxvbiAvIDE4MC4wKSAqIEhBTEZfRUFSVEgsICh5ICogSEFMRl9FQVJUSCkgLyAxODAuMF07XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMgdG8gbGF0aXR1ZGUvbG9uZ2l0dWRlLlxuICAgKiBBbGdvcml0aG0gaXMgdXNlZCBpbiBzZXZlcmFsIE9wZW5TdHJlZXRNYXAtcmVsYXRlZCBhcHBsaWNhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3IgZWFzdGluZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gc3BoZXJpY2FsIG1lcmNhdG9yIG5vcnRoaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxvbi9sYXRcbiAgICovXG4gIF91bnByb2plY3Q6IGZ1bmN0aW9uIChlLCBuKSB7XG4gICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuICAgIHZhciB5cCA9IChuIC8gSEFMRl9FQVJUSCkgKiAxODAuMDtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uZ2l0dWRlOiAoZSAvIEhBTEZfRUFSVEgpICogMTgwLjAsXG4gICAgICBsYXRpdHVkZTpcbiAgICAgICAgKDE4MC4wIC8gTWF0aC5QSSkgKlxuICAgICAgICAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCgoeXAgKiBNYXRoLlBJKSAvIDE4MC4wKSkgLSBNYXRoLlBJIC8gMiksXG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbXB1dGUgY29tcGFzcyBoZWFkaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJldGFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNvbXBhc3MgaGVhZGluZ1xuICAgKi9cbiAgX2NvbXB1dGVDb21wYXNzSGVhZGluZzogZnVuY3Rpb24gKGFscGhhLCBiZXRhLCBnYW1tYSkge1xuICAgIC8vIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gICAgdmFyIGFscGhhUmFkID0gYWxwaGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xuICAgIHZhciBnYW1tYVJhZCA9IGdhbW1hICogKE1hdGguUEkgLyAxODApO1xuXG4gICAgLy8gQ2FsY3VsYXRlIGVxdWF0aW9uIGNvbXBvbmVudHNcbiAgICB2YXIgY0EgPSBNYXRoLmNvcyhhbHBoYVJhZCk7XG4gICAgdmFyIHNBID0gTWF0aC5zaW4oYWxwaGFSYWQpO1xuICAgIHZhciBzQiA9IE1hdGguc2luKGJldGFSYWQpO1xuICAgIHZhciBjRyA9IE1hdGguY29zKGdhbW1hUmFkKTtcbiAgICB2YXIgc0cgPSBNYXRoLnNpbihnYW1tYVJhZCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgQSwgQiwgQyByb3RhdGlvbiBjb21wb25lbnRzXG4gICAgdmFyIHJBID0gLWNBICogc0cgLSBzQSAqIHNCICogY0c7XG4gICAgdmFyIHJCID0gLXNBICogc0cgKyBjQSAqIHNCICogY0c7XG5cbiAgICAvLyBDYWxjdWxhdGUgY29tcGFzcyBoZWFkaW5nXG4gICAgdmFyIGNvbXBhc3NIZWFkaW5nID0gTWF0aC5hdGFuKHJBIC8gckIpO1xuXG4gICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcbiAgICBpZiAockIgPCAwKSB7XG4gICAgICBjb21wYXNzSGVhZGluZyArPSBNYXRoLlBJO1xuICAgIH0gZWxzZSBpZiAockEgPCAwKSB7XG4gICAgICBjb21wYXNzSGVhZGluZyArPSAyICogTWF0aC5QSTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICAgIGNvbXBhc3NIZWFkaW5nICo9IDE4MCAvIE1hdGguUEk7XG5cbiAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEhhbmRsZXIgZm9yIGRldmljZSBvcmllbnRhdGlvbiBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBfb25EZXZpY2VPcmllbnRhdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3kgPCA1MCkge1xuICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIndlYmtpdENvbXBhc3NBY2N1cmFjeSBpcyBldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3lcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldmVudC5hbHBoYSAhPT0gbnVsbCkge1xuICAgICAgaWYgKGV2ZW50LmFic29sdXRlID09PSB0cnVlIHx8IGV2ZW50LmFic29sdXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKFxuICAgICAgICAgIGV2ZW50LmFscGhhLFxuICAgICAgICAgIGV2ZW50LmJldGEsXG4gICAgICAgICAgZXZlbnQuZ2FtbWFcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcImV2ZW50LmFic29sdXRlID09PSBmYWxzZVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWxwaGEgPT09IG51bGxcIik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdXNlciByb3RhdGlvbiBkYXRhLlxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBoZWFkaW5nID0gMzYwIC0gdGhpcy5oZWFkaW5nO1xuICAgIHZhciBjYW1lcmFSb3RhdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicm90YXRpb25cIikueTtcbiAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoLnJhZFRvRGVnKFxuICAgICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnlcbiAgICApO1xuICAgIHZhciBvZmZzZXQgPSAoaGVhZGluZyAtIChjYW1lcmFSb3RhdGlvbiAtIHlhd1JvdGF0aW9uKSkgJSAzNjA7XG4gICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKG9mZnNldCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICpcbiAgICogVGFrZW4gZnJvbSBncHMtY2FtZXJhXG4gICAqL1xuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgIHZhciBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xuXG4gICAgdmFyIGEgPVxuICAgICAgTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSArXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKlxuICAgICAgICAoTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpKTtcbiAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHJldHVybiBhbmdsZSAqIDYzNzEwMDA7XG4gIH0sXG5cbiAgX29uR3BzRW50aXR5UGxhY2VBZGRlZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGlmIHBsYWNlcyBhcmUgYWRkZWQgYWZ0ZXIgY2FtZXJhIGluaXRpYWxpemF0aW9uIGlzIGZpbmlzaGVkXG4gICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcik7XG4gICAgfVxuICB9LFxufSk7XG4iLCIvKiogZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2VcbiAqXG4gKiBiYXNlZCBvbiB0aGUgb3JpZ2luYWwgZ3BzLWVudGl0eS1wbGFjZSwgbW9kaWZpZWQgYnkgbmlja3cgMDIvMDQvMjBcbiAqXG4gKiBSYXRoZXIgdGhhbiBrZWVwaW5nIHRyYWNrIG9mIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZSBkaXN0YW5jZSBvZlxuICogZW50aXRpZXMgb3IgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gdGhlIG9yaWdpbmFsIGxvY2F0aW9uLCB0aGlzIHZlcnNpb25cbiAqIG1ha2VzIHVzZSBvZiB0aGUgXCJHb29nbGVcIiBTcGhlcmljYWwgTWVyY2FjdG9yIHByb2plY3Rpb24sIGFrYSBlcHNnOjM4NTcuXG4gKlxuICogVGhlIG9yaWdpbmFsIGxvY2F0aW9uIG9uIHN0YXJ0dXAgKGxhdC9sb24pIGlzIHByb2plY3RlZCBpbnRvIFNwaGVyaWNhbFxuICogTWVyY2F0b3IgYW5kIHN0b3JlZC5cbiAqXG4gKiBXaGVuICdlbnRpdHktcGxhY2VzJyBhcmUgYWRkZWQsIHRoZWlyIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZHMgYXJlXG4gKiBjYWxjdWxhdGVkIGFuZCBjb252ZXJ0ZWQgaW50byB3b3JsZCBjb29yZGluYXRlcywgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbmFsXG4gKiBwb3NpdGlvbiwgdXNpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBwcm9qZWN0aW9uIGNhbGN1bGF0aW9uIGluXG4gKiBncHMtcHJvamVjdGVkLWNhbWVyYS5cbiAqXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXG4gKiBmb3IgbWFueSBhcmVhcyBvZiB0aGUgd29ybGQgYW5kIGFwcGVhciBub3QgdG8gY2F1c2UgdW5hY2NlcHRhYmxlIGRpc3RvcnRpb25zXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxuICovXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZVwiLCB7XG4gIF9jYW1lcmFHcHM6IG51bGwsXG4gIHNjaGVtYToge1xuICAgIGxvbmdpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBsYXRpdHVkZToge1xuICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLFxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyXG4gICAgKTtcbiAgfSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIC8vIFVzZWQgbm93IHRvIGdldCB0aGUgR1BTIGNhbWVyYSB3aGVuIGl0J3MgYmVlbiBzZXR1cFxuICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1wcm9qZWN0ZWQtY2FtZXJhXVwiKTtcbiAgICAgICAgaWYgKCFjYW1lcmEuY29tcG9uZW50c1tcImdwcy1wcm9qZWN0ZWQtY2FtZXJhXCJdKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImdwcy1wcm9qZWN0ZWQtY2FtZXJhIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtcHJvamVjdGVkLWNhbWVyYVwiXTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uIG5lZWRzIHRvIHdvcnJ5IGFib3V0IGRpc3RhbmNlIGJ1dCBub3RoaW5nIGVsc2U/XG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyID0gKGV2KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGF0YSB8fCAhdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGRzdENvb3JkcyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG5cbiAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgLy8gX2NvbXB1dGVEaXN0YW5jZU1ldGVycyBpcyBub3cgZ29pbmcgdG8gdXNlIHRoZSBwcm9qZWN0ZWRcbiAgICAgIHZhciBkaXN0YW5jZUZvck1zZyA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoZHN0Q29vcmRzKTtcblxuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkaXN0YW5jZVwiLCBkaXN0YW5jZUZvck1zZyk7XG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlTXNnXCIsIHRoaXMuX2Zvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG5cbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWVudGl0eS1wbGFjZS11cGRhdGUtcG9zaXRpb25cIiwge1xuICAgICAgICAgIGRldGFpbDogeyBkaXN0YW5jZTogZGlzdGFuY2VGb3JNc2cgfSxcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIHZhciBhY3R1YWxEaXN0YW5jZSA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXG4gICAgICAgIGRzdENvb3JkcyxcbiAgICAgICAgdHJ1ZVxuICAgICAgKTtcblxuICAgICAgaWYgKGFjdHVhbERpc3RhbmNlID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUmV0YWluIGFzIHRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgR1BTIGNhbWVyYSBpcyBzZXQgdXBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIsXG4gICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXJcbiAgICApO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLFxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyXG4gICAgKTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gMDtcblxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWVudGl0eS1wbGFjZS1hZGRlZFwiLCB7XG4gICAgICAgIGRldGFpbDogeyBjb21wb25lbnQ6IHRoaXMuZWwgfSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIEhpZGUgZW50aXR5IGFjY29yZGluZyB0byBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGhpZGVGb3JNaW5EaXN0YW5jZTogZnVuY3Rpb24gKGVsLCBoaWRlRW50aXR5KSB7XG4gICAgaWYgKGhpZGVFbnRpdHkpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJmYWxzZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcInRydWVcIik7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVXBkYXRlIHBsYWNlIHBvc2l0aW9uXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cblxuICAvLyBzZXQgcG9zaXRpb24gdG8gd29ybGQgY29vcmRzIHVzaW5nIHRoZSBsYXQvbG9uXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciB3b3JsZFBvcyA9IHRoaXMuX2NhbWVyYUdwcy5sYXRMb25Ub1dvcmxkKFxuICAgICAgdGhpcy5kYXRhLmxhdGl0dWRlLFxuICAgICAgdGhpcy5kYXRhLmxvbmdpdHVkZVxuICAgICk7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcblxuICAgIC8vIHVwZGF0ZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gM0Qgd29ybGRcbiAgICAvL3RoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIsIHtcbiAgICAgIHg6IHdvcmxkUG9zWzBdLFxuICAgICAgeTogcG9zaXRpb24ueSxcbiAgICAgIHo6IHdvcmxkUG9zWzFdLFxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JtYXQgZGlzdGFuY2VzIHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGlzdGFuY2VcbiAgICovXG5cbiAgX2Zvcm1hdERpc3RhbmNlOiBmdW5jdGlvbiAoZGlzdGFuY2UpIHtcbiAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMCk7XG5cbiAgICBpZiAoZGlzdGFuY2UgPj0gMTAwMCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlIC8gMTAwMCArIFwiIGtpbG9tZXRlcnNcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzdGFuY2UgKyBcIiBtZXRlcnNcIjtcbiAgfSxcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2FyanMtbG9vay1jb250cm9sc1wiO1xuaW1wb3J0IFwiLi9hcmpzLXdlYmNhbS10ZXh0dXJlXCI7XG5pbXBvcnQgXCIuL0FyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzXCI7XG5pbXBvcnQgXCIuL2dwcy1jYW1lcmFcIjtcbmltcG9ydCBcIi4vZ3BzLWVudGl0eS1wbGFjZVwiO1xuaW1wb3J0IFwiLi9ncHMtcHJvamVjdGVkLWNhbWVyYVwiO1xuaW1wb3J0IFwiLi9ncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZVwiO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9