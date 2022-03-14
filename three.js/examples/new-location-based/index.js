const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const canvas = document.getElementById('canvas1');
const renderer = new THREE.WebGLRenderer({canvas: canvas});

const arjs = new THREEx.LocationBased(scene, camera);
const cam = new THREEx.WebcamRenderer(renderer);

const geom = new THREE.BoxGeometry(20, 20, 20);
const mtl = new THREE.MeshBasicMaterial({color: 0xff0000});

requestAnimationFrame(render);

let first = true, orientationControls = new THREEx.DeviceOrientationControls(camera);

arjs.on("gpsupdate", pos => {
    if(first) {
        // When first GPS position is obtained, add boxes near current location
        // (red=north, yellow=south, blue=west, green=east)
        alert(`Got position: ${pos.coords.latitude} ${pos.coords.longitude}`);
    
        const mtl = new THREE.MeshBasicMaterial({color: 0xff0000}),
            mtl2 = new THREE.MeshBasicMaterial({color: 0xffff00}),
            mtl3 = new THREE.MeshBasicMaterial({color: 0x0000ff}),
            mtl4 = new THREE.MeshBasicMaterial({color: 0x00ff00});

        const box = new THREE.Mesh(geom, mtl),
            box2 = new THREE.Mesh(geom, mtl2), 
            box3 = new THREE.Mesh(geom, mtl3), 
            box4 = new THREE.Mesh(geom, mtl4);
        
        arjs.add(box, pos.coords.longitude, pos.coords.latitude + 0.001);
        arjs.add(box2, pos.coords.longitude, pos.coords.latitude - 0.001);
        arjs.add(box3, pos.coords.longitude-0.001, pos.coords.latitude);
        arjs.add(box4, pos.coords.longitude+0.001, pos.coords.latitude);
    
        first = false;
    }
});

arjs.on("gpserror", code => {
    alert(`GPS error code: ${code}`);
});

arjs.startGps();

const oneDegAsRad = THREE.Math.degToRad(5);

let mousedown = false, lastX =0;

// Mouse events for testing on desktop machine
window.addEventListener("mousedown", e=> {
    mousedown = true;
});

window.addEventListener("mouseup", e=> {
    mousedown = false;
});

window.addEventListener("mousemove", e=> {
    if(!mousedown) return;
    if(e.clientX < lastX) {
        camera.rotation.y -= oneDegAsRad; 
        if(camera.rotation.y < 0) {
            camera.rotation.y += 2 * Math.PI;
        }
    } else if (e.clientX > lastX) {
        camera.rotation.y += oneDegAsRad;
        if(camera.rotation.y > 2 * Math.PI) {
            camera.rotation.y -= 2 * Math.PI;
        }
    }
    lastX = e.clientX;
});

function render() {
    if(canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth/canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }
    orientationControls.update();
    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
