const Source = function (parameters) {
  var _this = this;

  this.ready = false;
  this.domElement = null;

  // handle default parameters
  this.parameters = {
    // type of source - ['webcam', 'image', 'video']
    sourceType: "webcam",
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
  };
  //////////////////////////////////////////////////////////////////////////////
  //		setParameters
  //////////////////////////////////////////////////////////////////////////////
  setParameters(parameters);
  function setParameters(parameters) {
    if (parameters === undefined) return;
    for (var key in parameters) {
      var newValue = parameters[key];

      if (newValue === undefined) {
        console.warn("ArToolkitSource: '" + key + "' parameter is undefined.");
        continue;
      }

      var currentValue = _this.parameters[key];

      if (currentValue === undefined) {
        console.warn(
          "ArToolkitSource: '" + key + "' is not a property of this material."
        );
        continue;
      }

      _this.parameters[key] = newValue;
    }
  }

  this.onInitialClick = function () {
    if (this.domElement && this.domElement.play) {
      this.domElement.play().then(() => {});
    }
  };
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
Source.prototype.init = function (onReady, onError) {
  var _this = this;

  if (this.parameters.sourceType === "image") {
    var domElement = this._initSourceImage(onSourceReady, onError);
  } else if (this.parameters.sourceType === "video") {
    var domElement = this._initSourceVideo(onSourceReady, onError);
  } else if (this.parameters.sourceType === "webcam") {
    // var domElement = this._initSourceWebcamOld(onSourceReady)
    var domElement = this._initSourceWebcam(onSourceReady, onError);
  } else {
    console.assert(false);
  }

  // attach
  this.domElement = domElement;
  this.domElement.style.position = "absolute";
  this.domElement.style.top = "0px";
  this.domElement.style.left = "0px";
  this.domElement.style.zIndex = "-2";
  this.domElement.setAttribute("id", "arjs-video");

  return this;
  function onSourceReady() {
    if (!_this.domElement) {
      return;
    }

    document.body.appendChild(_this.domElement);
    window.dispatchEvent(
      new CustomEvent("arjs-video-loaded", {
        detail: {
          component: document.querySelector("#arjs-video"),
        },
      })
    );

    _this.ready = true;

    onReady && onReady();
  }
};

////////////////////////////////////////////////////////////////////////////////
//          init image source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._initSourceImage = function (onReady) {
  // TODO make it static
  var domElement = document.createElement("img");
  domElement.src = this.parameters.sourceUrl;

  domElement.width = this.parameters.sourceWidth;
  domElement.height = this.parameters.sourceHeight;
  domElement.style.width = this.parameters.displayWidth + "px";
  domElement.style.height = this.parameters.displayHeight + "px";

  domElement.onload = onReady;
  return domElement;
};

////////////////////////////////////////////////////////////////////////////////
//          init video source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._initSourceVideo = function (onReady) {
  // TODO make it static
  var domElement = document.createElement("video");
  domElement.src = this.parameters.sourceUrl;

  domElement.style.objectFit = "initial";

  domElement.autoplay = true;
  domElement.webkitPlaysinline = true;
  domElement.controls = false;
  domElement.loop = true;
  domElement.muted = true;

  // start the video on first click if not started automatically
  document.body.addEventListener("click", this.onInitialClick, { once: true });

  domElement.width = this.parameters.sourceWidth;
  domElement.height = this.parameters.sourceHeight;
  domElement.style.width = this.parameters.displayWidth + "px";
  domElement.style.height = this.parameters.displayHeight + "px";

  domElement.onloadeddata = onReady;
  return domElement;
};

////////////////////////////////////////////////////////////////////////////////
//          init webcam source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._initSourceWebcam = function (onReady, onError) {
  var _this = this;

  // init default value
  onError =
    onError ||
    function (error) {
      var event = new CustomEvent("camera-error", { error: error });
      window.dispatchEvent(event);

      setTimeout(() => {
        if (!document.getElementById("error-popup")) {
          var errorPopup = document.createElement("div");
          errorPopup.innerHTML =
            "Webcam Error\nName: " + error.name + "\nMessage: " + error.message;
          errorPopup.setAttribute("id", "error-popup");
          document.body.appendChild(errorPopup);
        }
      }, 1000);
    };

  var domElement = document.createElement("video");
  domElement.setAttribute("autoplay", "");
  domElement.setAttribute("muted", "");
  domElement.setAttribute("playsinline", "");
  domElement.style.width = this.parameters.displayWidth + "px";
  domElement.style.height = this.parameters.displayHeight + "px";

  // check API is available
  if (
    navigator.mediaDevices === undefined ||
    navigator.mediaDevices.enumerateDevices === undefined ||
    navigator.mediaDevices.getUserMedia === undefined
  ) {
    if (navigator.mediaDevices === undefined)
      var fctName = "navigator.mediaDevices";
    else if (navigator.mediaDevices.enumerateDevices === undefined)
      var fctName = "navigator.mediaDevices.enumerateDevices";
    else if (navigator.mediaDevices.getUserMedia === undefined)
      var fctName = "navigator.mediaDevices.getUserMedia";
    else console.assert(false);
    onError({
      name: "",
      message: "WebRTC issue-! " + fctName + " not present in your browser",
    });
    return null;
  }

  // get available devices
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      var userMediaConstraints = {
        audio: false,
        video: {
          facingMode: "environment",
          width: {
            ideal: _this.parameters.sourceWidth,
            // min: 1024,
            // max: 1920
          },
          height: {
            ideal: _this.parameters.sourceHeight,
            // min: 776,
            // max: 1080
          },
        },
      };

      if (null !== _this.parameters.deviceId) {
        userMediaConstraints.video.deviceId = {
          exact: _this.parameters.deviceId,
        };
      }

      // get a device which satisfy the constraints
      navigator.mediaDevices
        .getUserMedia(userMediaConstraints)
        .then(function success(stream) {
          // set the .src of the domElement
          domElement.srcObject = stream;

          var event = new CustomEvent("camera-init", { stream: stream });
          window.dispatchEvent(event);

          // start the video on first click if not started automatically
          document.body.addEventListener("click", _this.onInitialClick, {
            once: true,
          });

          onReady();
        })
        .catch(function (error) {
          onError({
            name: error.name,
            message: error.message,
          });
        });
    })
    .catch(function (error) {
      onError({
        message: error.message,
      });
    });

  return domElement;
};

////////////////////////////////////////////////////////////////////////////////
//          dispose source
////////////////////////////////////////////////////////////////////////////////

Source.prototype.dispose = function () {
  this.ready = false;

  switch (this.parameters.sourceType) {
    case "image":
      this._disposeSourceImage();
      break;

    case "video":
      this._disposeSourceVideo();
      break;

    case "webcam":
      this._disposeSourceWebcam();
      break;
  }

  this.domElement = null;

  document.body.removeEventListener("click", this.onInitialClick, {
    once: true,
  });
};

////////////////////////////////////////////////////////////////////////////////
//          dispose image source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._disposeSourceImage = function () {
  var domElement = document.querySelector("#arjs-video");

  if (!domElement) {
    return;
  }

  domElement.remove();
};

////////////////////////////////////////////////////////////////////////////////
//          dispose video source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._disposeSourceVideo = function () {
  var domElement = document.querySelector("#arjs-video");

  if (!domElement) {
    return;
  }

  // https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements
  domElement.pause();
  domElement.removeAttribute("src");
  domElement.load();

  domElement.remove();
};

////////////////////////////////////////////////////////////////////////////////
//          dispose webcam source
////////////////////////////////////////////////////////////////////////////////

Source.prototype._disposeSourceWebcam = function () {
  var domElement = document.querySelector("#arjs-video");

  if (!domElement) {
    return;
  }

  // https://stackoverflow.com/a/12436772
  if (domElement.srcObject && domElement.srcObject.getTracks) {
    domElement.srcObject.getTracks().map((track) => track.stop());
  }

  domElement.remove();
};

//////////////////////////////////////////////////////////////////////////////
//		Handle Mobile Torch
//////////////////////////////////////////////////////////////////////////////
Source.prototype.hasMobileTorch = function () {
  var stream = arToolkitSource.domElement.srcObject;
  if (stream instanceof MediaStream === false) return false;

  if (this._currentTorchStatus === undefined) {
    this._currentTorchStatus = false;
  }

  var videoTrack = stream.getVideoTracks()[0];

  // if videoTrack.getCapabilities() doesnt exist, return false now
  if (videoTrack.getCapabilities === undefined) return false;

  var capabilities = videoTrack.getCapabilities();

  return capabilities.torch ? true : false;
};

/**
 * toggle the flash/torch of the mobile fun if applicable.
 * Great post about it https://www.oberhofer.co/mediastreamtrack-and-its-capabilities/
 */
Source.prototype.toggleMobileTorch = function () {
  // sanity check
  console.assert(this.hasMobileTorch() === true);

  var stream = arToolkitSource.domElement.srcObject;
  if (stream instanceof MediaStream === false) {
    if (!document.getElementById("error-popup")) {
      var errorPopup = document.createElement("div");
      errorPopup.innerHTML =
        "enabling mobile torch is available only on webcam";
      errorPopup.setAttribute("id", "error-popup");
      document.body.appendChild(errorPopup);
    }
    return;
  }

  if (this._currentTorchStatus === undefined) {
    this._currentTorchStatus = false;
  }

  var videoTrack = stream.getVideoTracks()[0];
  var capabilities = videoTrack.getCapabilities();

  if (!capabilities.torch) {
    if (!document.getElementById("error-popup")) {
      var errorPopup = document.createElement("div");
      errorPopup.innerHTML = "no mobile torch is available on your camera";
      errorPopup.setAttribute("id", "error-popup");
      document.body.appendChild(errorPopup);
    }
    return;
  }

  this._currentTorchStatus = this._currentTorchStatus === false ? true : false;
  videoTrack
    .applyConstraints({
      advanced: [
        {
          torch: this._currentTorchStatus,
        },
      ],
    })
    .catch(function (error) {
      console.log(error);
    });
};

Source.prototype.domElementWidth = function () {
  return parseInt(this.domElement.style.width);
};
Source.prototype.domElementHeight = function () {
  return parseInt(this.domElement.style.height);
};

////////////////////////////////////////////////////////////////////////////////
//          handle resize
////////////////////////////////////////////////////////////////////////////////

Source.prototype.onResizeElement = function () {
  var _this = this;
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;

  // sanity check
  console.assert(arguments.length === 0);

  // compute sourceWidth, sourceHeight
  if (this.domElement.nodeName === "IMG") {
    var sourceWidth = this.domElement.naturalWidth;
    var sourceHeight = this.domElement.naturalHeight;
  } else if (this.domElement.nodeName === "VIDEO") {
    var sourceWidth = this.domElement.videoWidth;
    var sourceHeight = this.domElement.videoHeight;
  } else {
    console.assert(false);
  }

  // compute sourceAspect
  var sourceAspect = sourceWidth / sourceHeight;
  // compute screenAspect
  var screenAspect = screenWidth / screenHeight;

  // if screenAspect < sourceAspect, then change the width, else change the height
  if (screenAspect < sourceAspect) {
    // compute newWidth and set .width/.marginLeft
    var newWidth = sourceAspect * screenHeight;
    this.domElement.style.width = newWidth + "px";
    this.domElement.style.marginLeft = -(newWidth - screenWidth) / 2 + "px";

    // init style.height/.marginTop to normal value
    this.domElement.style.height = screenHeight + "px";
    this.domElement.style.marginTop = "0px";
  } else {
    // compute newHeight and set .height/.marginTop
    var newHeight = 1 / (sourceAspect / screenWidth);
    this.domElement.style.height = newHeight + "px";
    this.domElement.style.marginTop = -(newHeight - screenHeight) / 2 + "px";

    // init style.width/.marginLeft to normal value
    this.domElement.style.width = screenWidth + "px";
    this.domElement.style.marginLeft = "0px";
  }
};
/*
Source.prototype.copyElementSizeTo = function(otherElement){
	otherElement.style.width = this.domElement.style.width
	otherElement.style.height = this.domElement.style.height
	otherElement.style.marginLeft = this.domElement.style.marginLeft
	otherElement.style.marginTop = this.domElement.style.marginTop
}
*/

Source.prototype.copyElementSizeTo = function (otherElement) {
  if (window.innerWidth > window.innerHeight) {
    //landscape
    otherElement.style.width = this.domElement.style.width;
    otherElement.style.height = this.domElement.style.height;
    otherElement.style.marginLeft = this.domElement.style.marginLeft;
    otherElement.style.marginTop = this.domElement.style.marginTop;
  } else {
    //portrait
    otherElement.style.height = this.domElement.style.height;
    otherElement.style.width =
      (parseInt(otherElement.style.height) * 4) / 3 + "px";
    otherElement.style.marginLeft =
      (window.innerWidth - parseInt(otherElement.style.width)) / 2 + "px";
    otherElement.style.marginTop = 0;
  }
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

Source.prototype.copySizeTo = function () {
  console.warn(
    "obsolete function arToolkitSource.copySizeTo. Use arToolkitSource.copyElementSizeTo"
  );
  this.copyElementSizeTo.apply(this, arguments);
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

Source.prototype.onResize = function (arToolkitContext, renderer, camera) {
  if (arguments.length !== 3) {
    console.warn(
      "obsolete function arToolkitSource.onResize. Use arToolkitSource.onResizeElement"
    );
    return this.onResizeElement.apply(this, arguments);
  }

  var trackingBackend = arToolkitContext.parameters.trackingBackend;

  // RESIZE DOMELEMENT
  if (trackingBackend === "artoolkit") {
    this.onResizeElement();

    var isAframe = renderer.domElement.dataset.aframeCanvas ? true : false;
    if (isAframe === false) {
      this.copyElementSizeTo(renderer.domElement);
    } else {
    }

    if (arToolkitContext.arController !== null) {
      this.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
  } else console.assert(false, "unhandled trackingBackend " + trackingBackend);

  // UPDATE CAMERA
  if (trackingBackend === "artoolkit") {
    if (arToolkitContext.arController !== null) {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    }
  } else console.assert(false, "unhandled trackingBackend " + trackingBackend);
};

export default Source;
