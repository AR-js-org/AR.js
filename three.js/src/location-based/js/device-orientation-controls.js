import * as THREE from "three";
const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

/**
 * Module to calculate and apply the rotation towards the Earth's central axis to the registered target (ThreeJS camera)
 * Modified and supplemented the existing Three.js DeviceOrientationControl (excluded in the latest Three.js repository)
 * https://github.com/mrdoob/three.js/blob/1ee2fca970e3afdc26e6c2a47c14e9e2b784ae48/examples/jsm/controls/DeviceOrientationControls.js
 */
function DeviceOrientationControls(object) {
  const scope = this;
  this.object = object;
  this.object.rotation.reorder("YXZ");
  this.enabled = true;
  this.deviceOrientation = null;
  this.screenOrientation = 0;
  this.alphaOffset = 0;
  this.initialOffset = null;

  /** Callback function to get the values from the event **/
  const onDeviceOrientationChangeEvent = function ({
    alpha,
    beta,
    gamma,
    webkitCompassHeading,
  }) {
    if (isIOS) {
      // On iOS browsers, provide basic deviceOrientation and webkitCompassHeading
      const ccwNorthHeading = 360 - webkitCompassHeading; // Counterclockwise angle from the north
      scope.alphaOffset = THREE.MathUtils.degToRad(ccwNorthHeading - alpha);
      scope.deviceOrientation = { alpha, beta, gamma, webkitCompassHeading };
    } else {
      // On browsers like Chrome, directly pass the deviceOrientationAbsolute event
      if (alpha < 0) alpha += 360;
      scope.deviceOrientation = { alpha, beta, gamma };
    }

    window.dispatchEvent(
      new CustomEvent("camera-rotation-change", {
        detail: { cameraRotation: object.rotation },
      }),
    );
  };

  /** Set the rotation axis based on screen orientation **/
  const onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  /** Initial event registration for Control **/
  const onRegisterEvent = function () {
    window.addEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false,
    );
    if (isIOS) {
      window.addEventListener(
        "deviceorientation",
        onDeviceOrientationChangeEvent,
        false,
      );
    } else {
      window.addEventListener(
        "deviceorientationabsolute",
        onDeviceOrientationChangeEvent,
        false,
      );
    }
  }.bind(this);

  /** Alpha, beta, and gamma angles form a unique Tait-Bryan angle set of Z-X'-Y'' type **/
  const setObjectQuaternion = (function () {
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler); // Convert from Euler angles to quaternion
      // Rotate 90 degrees around the X-axis => Reference: https://www.andre-gaschler.com/rotationconverter/
      // Set to face the back of the device
      quaternion.multiply(q1);

      // Screen rotation correction
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
    };
  })();

  /** Initial Absolute control registration **/
  this.connect = function () {
    onScreenOrientationChangeEvent(); // run once on load
    // iOS 13+
    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then(function (response) {
          if (response == "granted") {
            onRegisterEvent();
          }
        })
        .catch(function (error) {
          console.error(
            "DeviceOrientationControls: Unable to use DeviceOrientation API:",
            error,
          );
        });
    } else {
      onRegisterEvent();
    }
    scope.enabled = true;
  };

  /** Unregister the control **/
  this.disconnect = function () {
    if (isIOS) {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent,
        false,
      );
      window.removeEventListener(
        "deviceorientation",
        onDeviceOrientationChangeEvent,
        false,
      );
    } else {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent,
        false,
      );
      window.removeEventListener(
        "deviceorientationabsolute",
        onDeviceOrientationChangeEvent,
        false,
      );
    }
    scope.enabled = false;
    scope.initialOffset = false;
    scope.deviceOrientation = null;
  };

  /** Calculate the rotation value of the registered target (camera) in real-time through quaternion calculation **/
  this.update = function ({ theta = 0 } = { theta: 0 }) {
    if (scope.enabled === false) return;
    const device = scope.deviceOrientation;
    if (device) {
      const alpha = device.alpha ? THREE.MathUtils.degToRad(device.alpha) : 0; // Z
      const beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'
      const gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0; // Y''
      const orient = scope.screenOrientation
        ? THREE.MathUtils.degToRad(scope.screenOrientation)
        : 0; // O

      if (isIOS) {
        // Calculate the quaternion first through deviceOrientation
        const currentQuaternion = new THREE.Quaternion();
        setObjectQuaternion(currentQuaternion, alpha, beta, gamma, orient);

        // Extract the Euler angles from the quaternion and add the heading angle to the Y-axis rotation of the Euler angles
        // (If we replace only the alpha value of the quaternion without using Euler angles, the camera will rotate unexpectedly. This is because a quaternion does not represent rotation values individually but rather through a combination of rotation axes and weights.)
        const currentEuler = new THREE.Euler().setFromQuaternion(
          currentQuaternion,
          "YXZ",
        );
        console.log(currentEuler.x, currentEuler.y, currentEuler.z);
        // Replace the current alpha value of the Euler angles and reset the quaternion
        currentEuler.y = THREE.MathUtils.degToRad(
          360 - device.webkitCompassHeading,
        );
        currentQuaternion.setFromEuler(currentEuler);
        scope.object.quaternion.copy(currentQuaternion);
      } else {
        // Directly calculate through the deviceOrientationAbsolute event (Android)
        setObjectQuaternion(
          scope.object.quaternion,
          alpha + theta,
          beta,
          gamma,
          orient,
        );
      }
    }
  };

  /** Initialize Alpha Offset (used for iOS) **/
  this.updateAlphaOffset = function () {
    scope.initialOffset = false;
  };

  /** Unregister Control **/
  this.dispose = function () {
    scope.disconnect();
  };

  this.getAlpha = function () {
    const { deviceOrientation: device } = scope;
    return device && device.alpha
      ? THREE.MathUtils.degToRad(device.alpha) + scope.alphaOffset
      : 0;
  };

  this.getBeta = function () {
    const { deviceOrientation: device } = scope;
    return device && device.beta ? THREE.MathUtils.degToRad(device.beta) : 0;
  };
}
DeviceOrientationControls.prototype = Object.assign(
  Object.create(THREE.EventDispatcher.prototype),
  {
    constructor: DeviceOrientationControls,
  },
);
export { DeviceOrientationControls };
