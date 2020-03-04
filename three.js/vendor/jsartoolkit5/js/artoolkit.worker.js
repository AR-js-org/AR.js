if ('function' === typeof importScripts) {
    importScripts('../build/artoolkit-nft.min.js');

    self.onmessage = function (e) {
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
        var corsAnyway = 'https://cors-anywhere.herokuapp.com/';
        var markerPath = corsAnyway + msg.marker;

        console.debug('Loading marker at: ', markerPath);

        var onLoad = function () {
            ar = new ARController(msg.pw, msg.ph, param);
            var cameraMatrix = ar.getCameraMatrix();

            // after the ARController is set up, we load the NFT Marker
            ar.loadNFTMarker(markerPath, function (markerId) {
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

            postMessage({type: "loaded", proj: JSON.stringify(cameraMatrix)});
        };

        var onError = function (error) {
            console.error(error);
        };

        console.debug('Loading camera at:', msg.param);

        // we cannot pass the entire ARController, so we re-create one inside the Worker, starting from camera_param
        var param = new ARCameraParam(msg.param, onLoad, onError);
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

}
