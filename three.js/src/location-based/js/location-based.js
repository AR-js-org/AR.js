import { SphMercProjection } from './sphmerc-projection.js';

class LocationBased {

    constructor (scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.proj = new SphMercProjection();
        this.eventHandlers = { };
    }

    setProjection(proj) {
        this.proj = proj;
    }

    startGps(maximumAge = 0) {
        this.watchPositionId = navigator.geolocation.watchPosition( 
            position => {
                this.setWorldPosition(
                    this.camera,
                    position.coords.longitude,
                    position.coords.latitude
                );
                if(this.eventHandlers["gpsupdate"]) {
                    this.eventHandlers["gpsupdate"](position);
                }    
            }, error => {
                alert(`GPS listen error: code ${error}`);
            }, {
                enableHighAccuracy: true,
                maximumAge: maximumAge
            }
        );
    }

    stopGps() {
        if(this.watchPositionId) {
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.watchPositionId = null;
        }
    }    

    fakeGps(lon, lat, elev) {
        this.setWorldPosition(this.camera, lon, lat, elev);
    }

    lonLatToWorldCoords(lon, lat) {
        const projectedPos = this.proj.project(lon, lat);
        return [projectedPos[0], -projectedPos[1]];
    }

    add(object, lon, lat, elev) {
        this.setWorldPosition(object, lon, lat, elev);
        this.scene.add(object);
    }
    
    setWorldPosition(object, lon, lat, elev) {
        const worldCoords = this.lonLatToWorldCoords(lon, lat);
        [ object.position.x, object.position.z ] = worldCoords;
        if(elev !== undefined) {
            object.position.y = elev;
        }
    }

    setElevation(elev) {
        this.camera.position.y = elev;
    }

    on(eventName, eventHandler) {
        this.eventHandlers[eventName] = eventHandler;
    }
}

export { LocationBased };
