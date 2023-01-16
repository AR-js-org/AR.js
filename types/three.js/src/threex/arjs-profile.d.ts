export default Profile;
declare class Profile {
    private constructor();
    _guessPerformanceLabel(): "phone-normal" | "desktop-normal";
    /**
     * reset all parameters
     */
    reset(): any;
    sourceParameters: {
        sourceType: string;
    };
    contextParameters: {
        cameraParametersUrl: string;
        detectionMode: string;
    };
    defaultMarkerParameters: {
        type: string;
        patternUrl: string;
        changeMatrixMode: string;
    };
    performance(label: any): any;
    defaultMarker(trackingBackend: any): any;
    sourceWebcam(): any;
    sourceVideo(url: any): any;
    sourceImage(url: any): any;
    trackingBackend(trackingBackend: any): any;
    changeMatrixMode(changeMatrixMode: any): any;
    trackingMethod(trackingMethod: any): any;
    /**
     * check if the profile is valid. Throw an exception is not valid
     */
    checkIfValid(): any;
}
//# sourceMappingURL=arjs-profile.d.ts.map