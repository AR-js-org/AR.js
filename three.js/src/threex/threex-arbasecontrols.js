import * as THREE from "three";

const ArBaseControls = function (object3d) {
  this.id = ArBaseControls.id++;

  this.object3d = object3d;
  this.object3d.matrixAutoUpdate = false;
  this.object3d.visible = false;

  // Events to honor
  // this.dispatchEvent({ type: 'becameVisible' })
  // this.dispatchEvent({ type: 'markerVisible' })	// replace markerFound
  // this.dispatchEvent({ type: 'becameUnVisible' })
};

ArBaseControls.id = 0;

ArBaseControls.prototype = Object.create(THREE.EventDispatcher.prototype);

//////////////////////////////////////////////////////////////////////////////
//		Functions
//////////////////////////////////////////////////////////////////////////////
/**
 * error catching function for update()
 */
ArBaseControls.prototype.update = function () {
  console.assert(false, "you need to implement your own update");
};

/**
 * error catching function for name()
 */
ArBaseControls.prototype.name = function () {
  console.assert(false, "you need to implement your own .name()");
  return "Not yet implemented - name()";
};

export default ArBaseControls;
