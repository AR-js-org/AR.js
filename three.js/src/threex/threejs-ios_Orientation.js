// check if device is iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function getDeviceOrientation() {
  if (isIOS) {
    switch (window.orientation) {
      case 0:
        return "portrait";
      case 90:
        return "landscape-left";
      case -90:
        return "landscape-right";
      case 180:
        return "portrait-upside-down";
    }
  } else {
 
    return screen.orientation.type.split("-")[0];
  }
}

window.addEventListener("orientationchange", () => {
  // get current orientation
  const orientation = getDeviceOrientation();

  // apply transformations to AR content based on orientation
  switch (orientation) {
    case "portrait":
      // apply portrait transformations
      break;
    case "landscape-left":
      // apply landscape-left transformations
      break;
    case "landscape-right":
      // apply landscape-right transformations
      break;
    case "portrait-upside-down":
      // apply portrait-upside-down transformations
      break;
  }
});