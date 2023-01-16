export default Source;
declare class Source {
    private constructor();
    init(onReady: any, onError: any): any;
    domElement: any;
    _initSourceImage(onReady: any): HTMLImageElement;
    _initSourceVideo(onReady: any): HTMLVideoElement;
    _initSourceWebcam(onReady: any, onError: any): HTMLVideoElement;
    dispose(): void;
    ready: boolean;
    _disposeSourceImage(): void;
    _disposeSourceVideo(): void;
    _disposeSourceWebcam(): void;
    hasMobileTorch(): boolean;
    _currentTorchStatus: any;
    /**
     * toggle the flash/torch of the mobile fun if applicable.
     * Great post about it https://www.oberhofer.co/mediastreamtrack-and-its-capabilities/
     */
    toggleMobileTorch(): void;
    domElementWidth(): number;
    domElementHeight(): number;
    onResizeElement(...args: any[]): void;
    copyElementSizeTo(otherElement: any): void;
    copySizeTo(...args: any[]): void;
    onResize(arToolkitContext: any, renderer: any, camera: any, ...args: any[]): any;
}
//# sourceMappingURL=arjs-source.d.ts.map