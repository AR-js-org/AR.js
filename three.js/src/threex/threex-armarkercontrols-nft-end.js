            //}, 50);
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
              //var path = '../../';
              var path = '';
              // this code si only for testing pourpose, it will be removed: only for checking if the path is right or not.
              var req = new XMLHttpRequest;
              var testCamUrl = "http://127.0.0.1:3000/data/data/camera_para.dat";
              req.open("GET",testCamUrl,true);
              console.log(req);
              var onLoad = function () {
                  //var interval = setTimeout(function() {
                    ar = new ARController(msg.pw, msg.ph, param);
                  //}, 120);
                  var cameraMatrix = ar.getCameraMatrix();

                  // after the ARController is set up, we load the NFT Marker
                  var nftMarkerurl = 'http://127.0.0.1:3000/data/dataNFT/pinball'
                  //ar.loadNFTMarker(path + msg.marker, function (markerId) {
                  ar.loadNFTMarker(nftMarkerurl, function (markerId) {
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
              console.log(msg.param);
              // we cannot pass the entire ARController, so we re-create one inside the Worker, starting from camera_param
              //var param = new ARCameraParam(path + msg.param, onLoad, onError);
              var param = new ARCameraParam(path + testCamUrl, onLoad, onError);
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

    function onMarkerFound(event) {
        if (event.data.type === artoolkit.PATTERN_MARKER && event.data.marker.cfPatt < _this.parameters.minConfidence) return
        if (event.data.type === artoolkit.BARCODE_MARKER && event.data.marker.cfMatt < _this.parameters.minConfidence) return

        var modelViewMatrix = new THREE.Matrix4().fromArray(event.data.matrix)
        _this.updateWithModelViewMatrix(modelViewMatrix)
    }
}
