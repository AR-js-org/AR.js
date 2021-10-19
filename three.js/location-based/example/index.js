import * as THREE from 'three';
import * as Arjs from '../js/arjs.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas1') });

const geom = new THREE.BoxGeometry(20,20,20);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(geom, material);

const arjs = new Arjs.LocationBased(scene, camera);
const cam = new Arjs.WebcamRenderer(renderer, '#video1');

// If using your own GPS location, change the lon and lat of the three meshes
arjs.add(mesh, -0.72, 51.051); // slightly north
const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
arjs.add(new THREE.Mesh(geom, material2), -0.72, 51.049); // slightly south
arjs.add(new THREE.Mesh(geom, material3), -0.722, 51.05); // slightly west
arjs.add(new THREE.Mesh(geom, material4), -0.718, 51.05); // slightly east

const get = { m : 0 };
const parts = window.location.href.split('?');

if(parts.length==2) {
    if(parts[1].endsWith('#')) { 
        parts[1] = parts[1].slice(0, -1);
    }
    const params = parts[1].split('&');
    for(let i=0; i<params.length; i++) {
        const param = params[i].split('=');
        get[param[0]] = param[1];
    }
}

let orientationControls;

// Use query string to control behaviour
// m=1 or m=2, use DeviceOrientationControls (use on mobile device)
// m=2, use actual GPS location
// m not 1, use a fake GPS location
// so m other than 1 or 2 can be used to test on a desktop machine
if(get.m == 1 || get.m == 2) {
    orientationControls = new Arjs.DeviceOrientationControls(camera);
}
if(get.m == 2) {
    arjs.startGps();
} else {
    arjs.fakeGps(-0.72, 51.05);
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
