export default Context;
declare class Context {
    private constructor();
    dispatchEvent: any;
    addEventListener: any;
    hasEventListener: any;
    removeEventListener: any;
    init(onCompleted: any): void;
    update(srcElement: any): boolean;
    _updatedAt: number;
    addMarker(arMarkerControls: any): void;
    removeMarker(arMarkerControls: any): void;
    _initArtoolkit(onCompleted: any): any;
    _artoolkitProjectionAxisTransformMatrix: any;
    /**
     * return the projection matrix
     */
    getProjectionMatrix(): any;
    _updateArtoolkit(srcElement: any): void;
    dispose(): void;
    initialized: boolean;
    _arMarkersControls: any[];
    arController: any;
}
//# sourceMappingURL=arjs-context.d.ts.map