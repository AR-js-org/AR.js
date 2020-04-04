const ArToolkitContext = function (parameters, sourceParameters) {
    var _this = this

    _this._updatedAt = null

    // handle default parameters
    this.parameters = {
        // AR backend - ['artoolkit']
        trackingBackend: 'artoolkit',
        // debug - true if one should display artoolkit debug canvas, false otherwise
        debug: false,
        // the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
        detectionMode: 'mono',
        // type of matrix code - valid iif detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
        matrixCodeType: '3x3',

        // url of the camera parameters
        cameraParametersUrl: ArToolkitContext.baseURL + '../data/data/camera_para.dat',

        // tune the maximum rate of pose detection in the source image
        maxDetectionRate: 60,
        // resolution of at which we detect pose in the source image
        canvasWidth: 640,
        canvasHeight: 480,

        // the patternRatio inside the artoolkit marker - artoolkit only
        patternRatio: 0.5,

        // Labeling mode for markers - ['black_region', 'white_region']
        // black_region: Black bordered markers on a white background, white_region: White bordered markers on a black background
        labelingMode: 'black_region',

        // enable image smoothing or not for canvas copy - default to true
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
        imageSmoothingEnabled: false,
    }
    // parameters sanity check
    console.assert(['artoolkit'].indexOf(this.parameters.trackingBackend) !== -1, 'invalid parameter trackingBackend', this.parameters.trackingBackend)
    console.assert(['color', 'color_and_matrix', 'mono', 'mono_and_matrix'].indexOf(this.parameters.detectionMode) !== -1, 'invalid parameter detectionMode', this.parameters.detectionMode)
    console.assert(["black_region", "white_region"].indexOf(this.parameters.labelingMode) !== -1, "invalid parameter labelingMode", this.parameters.labelingMode);

    this.arController = null;

    _this.initialized = false


    this._arMarkersControls = []

    //////////////////////////////////////////////////////////////////////////////
    //		setParameters
    //////////////////////////////////////////////////////////////////////////////
    setParameters(parameters)
    function setParameters(parameters) {
        if (parameters === undefined) return
        for (var key in parameters) {
            var newValue = parameters[key]

            if (newValue === undefined) {
                console.warn("ArToolkitContext: '" + key + "' parameter is undefined.")
                continue
            }

            var currentValue = _this.parameters[key]

            if (currentValue === undefined) {
                console.warn("ArToolkitContext: '" + key + "' is not a property of this material.")
                continue
            }

            _this.parameters[key] = newValue
        }
    }
}

export default ArToolkitContext;
