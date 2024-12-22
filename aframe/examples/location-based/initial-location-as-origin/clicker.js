AFRAME.registerComponent('clicker', {
    init: function() {
        const cameraEl = document.querySelector('a-camera');
        let position, cameraPos;
        this.el.addEventListener('click', e => {
            position = this.el.object3D.position; 
            cameraPos = cameraEl.object3D.position;
            alert(`Box clicked! Position is: ${position.x} ${position.y} ${position.z}; camera pos ${cameraPos.x} ${cameraPos.y} ${cameraPos.z}`);
        });
    }
});
