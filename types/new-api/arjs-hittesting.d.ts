export default HitTesting;
declare class HitTesting {
    private constructor();
    /**
     * update
     *
     * @param {THREE.Camera} camera   - the camera to use
     * @param {THREE.Object3D} object3d -
     */
    update(camera: THREE.Camera, pickingRoot: any, changeMatrixMode: any): void;
    /**
     * Test the real world for intersections directly from a DomEvent
     *
     * @param {Number} mouseX - position X of the hit [-1, +1]
     * @param {Number} mouseY - position Y of the hit [-1, +1]
     * @return {[HitTesting.Result]} - array of result
     */
    testDomEvent(domEvent: any): [HitTesting.Result];
    /**
     * Test the real world for intersections.
     *
     * @param {Number} mouseX - position X of the hit [0, +1]
     * @param {Number} mouseY - position Y of the hit [0, +1]
     * @return {[HitTesting.Result]} - array of result
     */
    test(mouseX: number, mouseY: number): [HitTesting.Result];
}
//# sourceMappingURL=arjs-hittesting.d.ts.map