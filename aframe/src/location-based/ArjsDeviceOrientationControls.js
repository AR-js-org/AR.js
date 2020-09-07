
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

      // This code is from THREE.DeviceOrientationControls
      // NW ORIENTATION SMOOTHING ATTEMPT
      var k = this.smoothingFactor;

      if(this.lastOrientation) {
        alpha = this.getSmoothedAngle_(alpha , this.lastOrientation.alpha, k);
        beta = this.getSmoothedAngle_(beta + (beta < 0 ? this.TWO_PI : 0) , this.lastOrientation.beta, k);
        gamma = this.getSmoothedAngle_(gamma + (gamma < 0 ? Math.PI : 0) , this.lastOrientation.gamma, k, Math.PI);
        this.lastOrientation = {
          alpha: alpha,
          beta: beta,
          gamma: gamma
        };
    
      } else {
        this.lastOrientation = {
          alpha: alpha,
          beta: beta + (beta<0 ? this.TWO_PI : 0),
          gamma: gamma + (gamma<0 ? Math.PI : 0)
        };
      // NW END ADDED CODE
      }

      setObjectQuaternion( scope.object.quaternion, alpha, beta > Math.PI ? beta- this.TWO_PI : beta, gamma > this.HALF_PI ? gamma - Math.PI : gamma, orient );

    }
  };

   
   // NW ADDED THIS METHOD
  this.orderAngle_ = function(a,b,r = this.TWO_PI) {
    if ((b > a && Math.abs(b - a) < r / 2) || (a > b && Math.abs(b - a) > r / 2)) {
      return { left: a, right: b }
    } else { 
      return {left: b, right: a }
    }
  };

   // NW ALSO ADDED THIS METHOD
  this.getSmoothedAngle_ = function(a, b, k, r = this.TWO_PI) {
    const angles = this.orderAngle_(a, b, r);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if(angles.right < 0) angles.right += r;
    let newangle = origAnglesRight == b ? (1 - k)*angles.right + k * angles.left : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if(newangle >= r) newangle -= r;
    return newangle;
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();

};
