/**
 * Class to handle device orientation.
 * IMPORTANT - this code is a modified version the former official three.js
 * DeviceOrientationControls class, which was formerly provided with the
 * three.js repo
 *
 * Changes:
 *
 * - use "deviceorientationabsolute" rather than "deviceorientation"
 *   where available
 *
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import { Euler, EventDispatcher, MathUtils, Quaternion, Vector3 } from "three";

const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

const _zee = new Vector3(0, 0, 1);
const _euler = new Euler();
const _q0 = new Quaternion();
const _q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends EventDispatcher {
  /**
   * Create an instance of DeviceOrientationControls.
   * @param {Object} object - the object to attach the controls to
   * (usually your Three.js camera)
   */
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)",
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = null;
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians
    this.initialOffset = null; // used in fix provided in issue #466 on main AR.js repo, iOS related

    this.TWO_PI = 2 * Math.PI;
    this.HALF_PI = 0.5 * Math.PI;
    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    this.smoothingFactor = 1;

    const onDeviceOrientationChangeEvent = function ({
      alpha,
      beta,
      gamma,
      webkitCompassHeading,
    }) {
      if (isIOS) {
        const ccwNorthHeading = 360 - webkitCompassHeading;
        scope.alphaOffset = MathUtils.degToRad(ccwNorthHeading - alpha);
        scope.deviceOrientation = { alpha, beta, gamma, webkitCompassHeading };
      } else {
        if (alpha < 0) alpha += 360;
        scope.deviceOrientation = { alpha, beta, gamma };
      }
      window.dispatchEvent(
        new CustomEvent("camera-rotation-change", {
          detail: { cameraRotation: object.rotation },
        }),
      );
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
      orient,
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    /**
     * Update the device orientation controls.
     * Should be called from your three.js rendering/animation function.
     */
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
                onScreenOrientationChangeEvent,
              );
              window.addEventListener(
                scope.orientationChangeEventName,
                onDeviceOrientationChangeEvent,
              );
            }
          })
          .catch(function (error) {
            console.error(
              "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error,
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent,
        );
        window.addEventListener(
          scope.orientationChangeEventName,
          onDeviceOrientationChangeEvent,
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent,
      );
      window.removeEventListener(
        scope.orientationChangeEventName,
        onDeviceOrientationChangeEvent,
      );

      scope.enabled = false;
      scope.initialOffset = false;
      scope.deviceOrientation = null;
    };

    this.update = function ({ theta = 0 } = { theta: 0 }) {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        let alpha = device.alpha
          ? MathUtils.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        let beta = device.beta ? MathUtils.degToRad(device.beta) : 0; // X'

        let gamma = device.gamma ? MathUtils.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? MathUtils.degToRad(scope.screenOrientation)
          : 0; // O

        if (isIOS) {
          const currentQuaternion = new Quaternion();
          setObjectQuaternion(currentQuaternion, alpha, beta, gamma, orient);
          // Extract the Euler angles from the quaternion and add the heading angle to the Y-axis rotation of the Euler angles
          // (If we replace only the alpha value of the quaternion without using Euler angles, the camera will rotate unexpectedly. This is because a quaternion does not represent rotation values individually but rather through a combination of rotation axes and weights.)
          const currentEuler = new Euler().setFromQuaternion(
            currentQuaternion,
            "YXZ",
          );
          console.log(currentEuler.x, currentEuler.y, currentEuler.z);
          // Replace the current alpha value of the Euler angles and reset the quaternion
          currentEuler.y = MathUtils.degToRad(
            360 - device.webkitCompassHeading,
          );
          currentQuaternion.setFromEuler(currentEuler);
          scope.object.quaternion.copy(currentQuaternion);
        } else {
          if (this.smoothingFactor < 1) {
            if (this.lastOrientation) {
              const k = this.smoothingFactor;
              alpha = this._getSmoothedAngle(
                alpha,
                this.lastOrientation.alpha,
                k,
              );
              beta = this._getSmoothedAngle(
                beta + Math.PI,
                this.lastOrientation.beta,
                k,
              );
              gamma = this._getSmoothedAngle(
                gamma + this.HALF_PI,
                this.lastOrientation.gamma,
                k,
                Math.PI,
              );
            } else {
              beta += Math.PI;
              gamma += this.HALF_PI;
            }

            this.lastOrientation = {
              alpha,
              beta,
              gamma,
            };
          }
          setObjectQuaternion(
            scope.object.quaternion,
            alpha + theta,
            this.smoothingFactor < 1 ? beta - Math.PI : beta,
            this.smoothingFactor < 1 ? gamma - this.HALF_PI : gamma,
            orient,
          );
        }

        // NB - NOT present in IOS fixed version issue #466
        // Is it needed?
        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
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

    // Provided in fix on issue #466 - iOS related
    this.updateAlphaOffset = function () {
      scope.initialOffset = false;
    };

    this.dispose = function () {
      scope.disconnect();
    };

    // provided with fix on issue #466
    this.getAlpha = function () {
      const { deviceOrientation: device } = scope;
      return device && device.alpha
        ? MathUtils.degToRad(device.alpha) + scope.alphaOffset
        : 0;
    };

    // provided with fix on issue #466
    this.getBeta = function () {
      const { deviceOrientation: device } = scope;
      return device && device.beta ? MathUtils.degToRad(device.beta) : 0;
    };

    // Provide gesture before initialising device orientation controls
    // From PR #659 on the main AR.js repo
    // Thanks to @ma2yama
    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      this.initPermissionDialog();
    } else {
      this.connect();
    }
  }

  // Provide gesture before initialising device orientation controls
  // From PR #659 on the main AR.js repo
  // Thanks to @ma2yama
  initPermissionDialog() {
    const startModal = document.createElement("div");
    const innerDiv = document.createElement("div");
    const msgDiv = document.createElement("div");
    const btnDiv = document.createElement("div");
    document.body.appendChild(startModal);
    const startModalStyles = {
      display: "flex",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    };
    const innerDivStyles = {
      backgroundColor: "white",
      padding: "6px",
      borderRadius: "3px",
      width: "18rem",
      height: "12rem",
    };
    const msgDivStyles = {
      width: "100%",
      height: "70%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    const btnDivStyles = {
      display: "inline-flex",
      width: "100%",
      height: "30%",
      justifyContent: "center",
      alignItems: "center",
    };
    for (let key in startModalStyles) {
      startModal.style[key] = startModalStyles[key];
    }
    for (let key in innerDivStyles) {
      innerDiv.style[key] = innerDivStyles[key];
    }
    for (let key in msgDivStyles) {
      msgDiv.style[key] = msgDivStyles[key];
    }
    for (let key in btnDivStyles) {
      btnDiv.style[key] = btnDivStyles[key];
    }
    startModal.appendChild(innerDiv);
    innerDiv.appendChild(msgDiv);
    innerDiv.appendChild(btnDiv);
    msgDiv.innerHTML =
      '<div style="font-size: 14pt; margin: 1rem;">This immersive website requires access to your device motion sensors.</div>';

    const onStartClick = () => {
      this.connect();
      startModal.style.display = "none";
    };
    const btn = document.createElement("button");
    btn.addEventListener("click", onStartClick);
    btn.style.width = "50%";
    btn.style.height = "80%";
    btn.style.fontSize = "12pt";
    btn.appendChild(document.createTextNode("OK"));
    btnDiv.appendChild(btn);
    document.body.appendChild(startModal);
  }
}
export { DeviceOrientationControls };
