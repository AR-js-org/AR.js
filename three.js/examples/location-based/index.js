function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    }
    return false;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas1') });

const geom = new THREE.BoxGeometry(20,20,20);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(geom, material);

const threex = new THREEx.LocationBased(scene, camera);
const cam = new THREEx.WebcamRenderer(renderer, '#video1');

// If using your own GPS location, change the lon and lat of the four meshes.
threex.add(mesh, -0.72, 51.051); // slightly north
const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
threex.add(new THREE.Mesh(geom, material2), -0.72, 51.049); // slightly south
threex.add(new THREE.Mesh(geom, material3), -0.722, 51.05); // slightly west
threex.add(new THREE.Mesh(geom, material4), -0.718, 51.05); // slightly east

let orientationControls;

if (isMobile()){   
    orientationControls = new THREEx.DeviceOrientationControls(camera);
    if(navigator.geolocation !== 'undefined') {
        navigator.geolocation.getCurrentPosition((pos)=>{
            if (pos !== 'undefined') {
                console.log('geolocation works');
                threex.startGps();
            } else {
                console.log('geolocation error');
            }
        })
    if( navigator.geolocation.getCurrentPosition(()=>{}) == null){
        console.log('geolocation not enabled use fakeGps');
        threex.fakeGps(-0.72, 51.05);
    }
        
    } else {
        threex.fakeGps(-0.72, 51.05);
    }

    threex.on("gpsupdate", pos => {
        console.log(`${pos.coords.latitude} ${pos.coords.longitude}`);
    });
} else {
    threex.fakeGps(-0.72, 51.05);

    threex.on("gpsupdate", pos => {
        console.log(`${pos.coords.latitude} ${pos.coords.longitude}`);
    });
}

requestAnimationFrame(render);

function render(time) {
    resizeUpdate();
    if(orientationControls) orientationControls.update();
    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function resizeUpdate() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if(width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
    }
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
}
