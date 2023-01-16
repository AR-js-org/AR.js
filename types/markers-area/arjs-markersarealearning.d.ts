export default MarkersAreaLearning;
declare class MarkersAreaLearning {
    private constructor();
    /**
     * What to do when a image source is fully processed
     */
    _onSourceProcessed(): void;
    computeResult(): void;
    /**
     * get a _this.subMarkersControls id based on markerControls.id
     */
    _getLearnedCoupleStats(subMarkerControls: any): number;
    /**
     * get a _this.subMarkersControls based on markerControls.id
     */
    _getSubMarkerControlsByID(controlsID: any): any;
    toJSON(): string;
    /**
     * reset all collected statistics
     */
    resetStats(): void;
    /**
     * reset all collected statistics
     */
    deleteResult(): void;
}
//# sourceMappingURL=arjs-markersarealearning.d.ts.map