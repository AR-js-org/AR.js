export default HitTestingPlane;
declare class HitTestingPlane {
  private constructor();
  update(camera: any, pickingRoot: any, changeMatrixMode: any): void;
  onResize(): void;
  test(
    mouseX: any,
    mouseY: any
  ): {
    position: any;
    quaternion: any;
    scale: any;
  };
  renderDebug(renderer: any): void;
}
//# sourceMappingURL=threex-hittesting-plane.d.ts.map
