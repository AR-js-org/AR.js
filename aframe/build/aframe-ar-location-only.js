
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

ArjsDeviceOrientationControls = function ( object ) {

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

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

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

      var alpha = device.alpha ? THREE.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

      var beta = device.beta ? THREE.Math.degToRad( device.beta ) : 0; // X'

      var gamma = device.gamma ? THREE.Math.degToRad( device.gamma ) : 0; // Y''

      var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

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

AFRAME.registerComponent('arjs-look-controls', {
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
    if (AFRAME.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls = new ArjsDeviceOrientationControls(this.magicWindowObject);
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
    this.onMouseDown = AFRAME.utils.bind(this.onMouseDown, this);
    this.onMouseMove = AFRAME.utils.bind(this.onMouseMove, this);
    this.onMouseUp = AFRAME.utils.bind(this.onMouseUp, this);
    this.onTouchStart = AFRAME.utils.bind(this.onTouchStart, this);
    this.onTouchMove = AFRAME.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = AFRAME.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = AFRAME.utils.bind(this.onEnterVR, this);
    this.onExitVR = AFRAME.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = AFRAME.utils.bind(this.onPointerLockChange, this);
    this.onPointerLockError = AFRAME.utils.bind(this.onPointerLockError, this);
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
      sceneEl.addEventListener('render-target-loaded', AFRAME.utils.bind(this.addEventListeners, this));
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
AFRAME.registerComponent('arjs-webcam-texture', {

    init: function() {
        this.scene = this.el.sceneEl;
        this.texCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        this.texScene = new THREE.Scene();

        this.scene.renderer.autoClear = false;
        this.video = document.createElement("video");
        this.video.setAttribute("autoplay", true);
        this.video.setAttribute("playsinline", true);
        this.video.setAttribute("display", "none");
        document.body.appendChild(this.video);
        this.geom = new THREE.PlaneBufferGeometry(); //0.5, 0.5);
        this.texture = new THREE.VideoTexture(this.video);
        this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
        const mesh = new THREE.Mesh(this.geom, this.material);
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
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */

AFRAME.registerComponent('gps-camera', {
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
            localPosition = Object.assign({}, this.currentCoords || {});
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
        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
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
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
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
AFRAME.registerComponent('gps-entity-place', {
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

AFRAME.registerComponent('gps-projected-camera', {
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
            localPosition = Object.assign({}, this.currentCoords || {});
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
AFRAME.registerComponent('gps-projected-entity-place', {
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
