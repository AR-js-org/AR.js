const ArToolkitSource = function (parameters) {
    var _this = this

    this.ready = false
    this.domElement = null

    // handle default parameters
    this.parameters = {
        // type of source - ['webcam', 'image', 'video']
        sourceType: 'webcam',
        // url of the source - valid if sourceType = image|video
        sourceUrl: null,

        // Device id of the camera to use (optional)
        deviceId: null,

        // resolution of at which we initialize in the source image
        sourceWidth: 640,
        sourceHeight: 480,
        // resolution displayed for the source
        displayWidth: 640,
        displayHeight: 480,
    }
    //////////////////////////////////////////////////////////////////////////////
    //		setParameters
    //////////////////////////////////////////////////////////////////////////////
    setParameters(parameters)
    function setParameters(parameters) {
        if (parameters === undefined) return
        for (var key in parameters) {
            var newValue = parameters[key]

            if (newValue === undefined) {
                console.warn("ArToolkitSource: '" + key + "' parameter is undefined.")
                continue
            }

            var currentValue = _this.parameters[key]

            if (currentValue === undefined) {
                console.warn("ArToolkitSource: '" + key + "' is not a property of this material.")
                continue
            }

            _this.parameters[key] = newValue
        }
    }
}

export default ArToolkitSource;
