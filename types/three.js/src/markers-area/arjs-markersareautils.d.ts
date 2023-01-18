export default MarkersAreaUtils;
declare namespace MarkersAreaUtils {
  /**
   * Navigate to the multi-marker learner page
   *
   * @param {String} learnerBaseURL  - the base url for the learner
   * @param {String} trackingBackend - the tracking backend to use
   */
  function navigateToLearnerPage(
    learnerBaseURL: string,
    trackingBackend: string
  ): void;
  /**
   * Create and store a default multi-marker file
   *
   * @param {String} trackingBackend - the tracking backend to use
   */
  function storeDefaultMultiMarkerFile(trackingBackend: string): void;
  /**
   * Create a default multi-marker file
   * @param {String} trackingBackend - the tracking backend to use
   * @return {Object} - json object of the multi-marker file
   */
  function createDefaultMultiMarkerFile(trackingBackend: string): any;
  /**
   * Create a default controls parameters for the multi-marker learner
   *
   * @param {String} trackingBackend - the tracking backend to use
   * @return {Object} - json object containing the controls parameters
   */
  function createDefaultMarkersControlsParameters(trackingBackend: string): any;
  /**
   * generate areaFile
   */
  function storeMarkersAreaFileFromResolution(
    trackingBackend: any,
    resolutionW: any,
    resolutionH: any
  ): void;
  function buildMarkersAreaFileFromResolution(
    trackingBackend: any,
    resolutionW: any,
    resolutionH: any
  ): {
    meta: {
      createdBy: string;
      createdAt: string;
    };
    trackingBackend: any;
    subMarkersControls: any[];
  };
}
//# sourceMappingURL=arjs-markersareautils.d.ts.map
