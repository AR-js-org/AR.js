export default MarkerControls;
declare class MarkerControls {
  private constructor();
  dispose(): void;
  object3d: any;
  smoothMatrices: any[];
  /**
   * When you actually got a new modelViewMatrix, you need to perfom a whole bunch
   * of things. it is done here.
   */
  updateWithModelViewMatrix(modelViewMatrix: any): boolean;
  name(): string;
  _initArtoolkit(): void;
}
//# sourceMappingURL=arjs-markercontrols.d.ts.map
