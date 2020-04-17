
AFRAME.registerComponent('gps-vector-ways', {
    init: function() {
        this.originSphMerc = null;

        this.vectorWaysListener = (ev) => {
            var camera = document.querySelector('[gps-projected-camera]');
            if (!camera.components['gps-projected-camera']) {
                console.error('gps-projected-camera not initialised');
            } else {
                if (!this.originSphMerc) {
                    this.originSphMerc = camera.components['gps-projected-camera'].originCoordsProjected;
                }
                ev.detail.objectIds.forEach(k => {
                    this.el.object3DMap[k].geometry.translate(-this.originSphMerc[0], 0, this.originSphMerc[1]);
                });
            }
        };

        this.el.addEventListener('vector-ways-loaded', this.vectorWaysListener);
    }
});
