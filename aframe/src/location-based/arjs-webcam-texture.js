AFRAME.registerComponent('arjs-webcam-texture', {

    init: function() {
        this.scene = this.el.sceneEl;
        this.texCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        this.texScene = new THREE.Scene();

        this.scene.renderer.autoClear = false;
        const video = document.createElement("video");
        video.setAttribute("autoplay", true);
        video.setAttribute("display", "none");
        document.body.appendChild(video);
        const geom = new THREE.PlaneBufferGeometry(); //0.5, 0.5);
        const texture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        const mesh = new THREE.Mesh(geom, material);
        this.texScene.add(mesh);
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = { video: {
                facingMode: 'environment' }
            };
            navigator.mediaDevices.getUserMedia(constraints).then( stream=> {
                video.srcObject = stream;    
                video.play();
            })
            .catch(e => { alert(`Webcam error: ${e}`); });
        } else {
            alert('sorry - media devices API not supported');
        }
    },

    tick: function() {
        this.scene.renderer.clear();
        this.scene.renderer.render(this.texScene, this.texCamera);
        this.scene.renderer.clearDepth();
    }
});
