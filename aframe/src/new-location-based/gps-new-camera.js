import * as AFRAME from 'aframe';

AFRAME.registerComponent('gps-new-camera', {
    schema: {
        simulateLatitude: {
            type: 'number',
            default: 0
        },
        simulateLongitude: {
            type: 'number',
            default: 0
        }
    },


    init: function() {
        this.arjs = new THREEx.LocationBased(this.el.sceneEl.object3D, this.el.object3D);
        this.arjs.on("gpsupdate", gpspos => { 
            this._sendGpsUpdateEvent(gpspos.coords.longitude, gpspos.coords.latitude);
        });
    },

    update: function() {
        if(this.data.simulateLatitude != 0 || this.data.simulateLongitude != 0) {
            this._sendGpsUpdateEvent(this.data.simulateLongitude, this.data.simulateLatitude);
        }
            
    },

    play: function() {
        this.arjs.startGps();
    },

    pause: function() {
        this.arjs.stopGps();
    },

    _sendGpsUpdateEvent: function(lon, lat) {
        this.el.emit('gps-camera-update-position', {
            position: {    
                longitude: lon,
                latitude: lat
            }
        });
    },
});
