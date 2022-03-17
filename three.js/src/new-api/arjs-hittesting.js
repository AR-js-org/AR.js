import HitTestingPlane from "../threex/threex-hittesting-plane";

/**
 * Create an anchor in the real world
 *
 * @param {ARjs.Session} arSession - the session on which we create the anchor
 * @param {Object} markerParameters - parameter of this anchor
 */
const HitTesting = function (arSession) {
  var _this = this;
  var arContext = arSession.arContext;
  var trackingBackend = arContext.parameters.trackingBackend;

  this.enabled = true;
  this._arSession = arSession;
  this._hitTestingPlane = null;
  _this._hitTestingPlane = new HitTestingPlane(arSession.arSource.domElement);
};

//////////////////////////////////////////////////////////////////////////////
//		update function
//////////////////////////////////////////////////////////////////////////////
/**
 * update
 *
 * @param {THREE.Camera} camera   - the camera to use
 * @param {THREE.Object3D} object3d -
 */
HitTesting.prototype.update = function (camera, pickingRoot, changeMatrixMode) {
  // if it isnt enabled, do nothing
  if (this.enabled === false) return;

  if (this._hitTestingPlane !== null) {
    this._hitTestingPlane.update(camera, pickingRoot, changeMatrixMode);
  } else console.assert(false);
};

//////////////////////////////////////////////////////////////////////////////
//		actual hit testing
//////////////////////////////////////////////////////////////////////////////

/**
 * Test the real world for intersections directly from a DomEvent
 *
 * @param {Number} mouseX - position X of the hit [-1, +1]
 * @param {Number} mouseY - position Y of the hit [-1, +1]
 * @return {[HitTesting.Result]} - array of result
 */
HitTesting.prototype.testDomEvent = function (domEvent) {
  var trackingBackend = this._arSession.arContext.parameters.trackingBackend;
  var arSource = this._arSession.arSource;

  // if it isnt enabled, do nothing
  if (this.enabled === false) return [];
  var mouseX = domEvent.clientX / arSource.domElementWidth();
  var mouseY = domEvent.clientY / arSource.domElementHeight();

  return this.test(mouseX, mouseY);
};

/**
 * Test the real world for intersections.
 *
 * @param {Number} mouseX - position X of the hit [0, +1]
 * @param {Number} mouseY - position Y of the hit [0, +1]
 * @return {[HitTesting.Result]} - array of result
 */
HitTesting.prototype.test = function (mouseX, mouseY) {
  var arContext = this._arSession.arContext;
  var trackingBackend = arContext.parameters.trackingBackend;
  var hitTestResults = [];

  // if it isnt enabled, do nothing
  if (this.enabled === false) return [];

  var result = this._hitTestingPlane.test(mouseX, mouseY);

  // if no result is found, return now
  if (result === null) return hitTestResults;

  // build a HitTesting.Result
  var hitTestResult = new HitTesting.Result(
    result.position,
    result.quaternion,
    result.scale
  );
  hitTestResults.push(hitTestResult);

  return hitTestResults;
};

//////////////////////////////////////////////////////////////////////////////
//		HitTesting.Result
//////////////////////////////////////////////////////////////////////////////
/**
 * Contains the result of HitTesting.test()
 *
 * @param {THREE.Vector3} position - position to use
 * @param {THREE.Quaternion} quaternion - quaternion to use
 * @param {THREE.Vector3} scale - scale
 */
HitTesting.Result = function (position, quaternion, scale) {
  this.position = position;
  this.quaternion = quaternion;
  this.scale = scale;
};

/**
 * Apply to a controlled object3d
 *
 * @param {THREE.Object3D} object3d - the result to apply
 */
HitTesting.Result.prototype.apply = function (object3d) {
  object3d.position.copy(this.position);
  object3d.quaternion.copy(this.quaternion);
  object3d.scale.copy(this.scale);

  object3d.updateMatrix();
};

/**
 * Apply to a controlled object3d
 *
 * @param {THREE.Object3D} object3d - the result to apply
 */
HitTesting.Result.prototype.applyPosition = function (object3d) {
  object3d.position.copy(this.position);

  object3d.updateMatrix();

  return this;
};

/**
 * Apply to a controlled object3d
 *
 * @param {THREE.Object3D} object3d - the result to apply
 */
HitTesting.Result.prototype.applyQuaternion = function (object3d) {
  object3d.quaternion.copy(this.quaternion);

  object3d.updateMatrix();

  return this;
};

export default HitTesting;
