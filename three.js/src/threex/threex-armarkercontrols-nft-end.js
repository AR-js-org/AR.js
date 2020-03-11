// continuing 'workerRunner' function from treex-armarkercontrols-nft-start.js file

this.onmessage = function (e) {
    var msg = e.data;
    switch (msg.type) {
        case "init": {
            load(msg);
            return;
        }
        case "process": {
            next = msg.imagedata;
            process();
            return;
        }
    }
};

var next = null;

var ar = null;
var markerResult = null;

function load(msg) {
    var camUrl, nftMarkerUrl;
    var basePath = self.origin;
    console.log('base path:', basePath);
    // test if the msg.param (the incoming url) is an http or https path
    var regexC = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm
    var reC = regexC.test(msg.param);
    if (reC == true) {
        camUrl = msg.param;
    } else if (reC == false) {
        camUrl = basePath + '/' + msg.param;
    }
    var onLoad = function () {
        ar = new ARController(msg.pw, msg.ph, param);
        var cameraMatrix = ar.getCameraMatrix();

        // after the ARController is set up, we load the NFT Marker
        var regexM = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm
        var reM = regexM.test(msg.marker);
        if (reM == true) {
            nftMarkerUrl = msg.marker;
        } else if (reM == false) {
            nftMarkerUrl = basePath + '/' + msg.marker;
        }
        ar.loadNFTMarker(nftMarkerUrl, function (markerId) {
            ar.trackNFTMarkerId(markerId);
            postMessage({ type: 'endLoading' })
        }, function (err) {
            console.log('Error in loading marker on Worker', err)
        });

        // ...and we listen for event when marker has been found from camera
        ar.addEventListener('getNFTMarker', function (ev) {
            // let AR.js know that a NFT marker has been found, with its matrix for positioning
            markerResult = {
                type: 'found',
                matrix: JSON.stringify(ev.data.matrix),
            };
        });

        postMessage({ type: "loaded", proj: JSON.stringify(cameraMatrix) });
    };

    var onError = function (error) {
        console.error(error);
    };
    console.log(msg.param);
    // we cannot pass the entire ARController, so we re-create one inside the Worker, starting from camera_param
    var param = new ARCameraParam(camUrl, onLoad, onError);
}

function process() {
    markerResult = null;

    if (ar && ar.process) {
        ar.process(next);
    }

    if (markerResult) {
        postMessage(markerResult);
    } else {
        postMessage({
            type: "not found",
        });
    }
    next = null;
}
    };

function onMarkerFound(event) {
    if (event.data.type === artoolkit.PATTERN_MARKER && event.data.marker.cfPatt < _this.parameters.minConfidence) return
    if (event.data.type === artoolkit.BARCODE_MARKER && event.data.marker.cfMatt < _this.parameters.minConfidence) return

    var modelViewMatrix = new THREE.Matrix4().fromArray(event.data.matrix)
    _this.updateWithModelViewMatrix(modelViewMatrix)
}
}
