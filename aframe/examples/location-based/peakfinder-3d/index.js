import 'arjs/aframe/build/aframe-ar-nft'
import 'aframe-look-at-component'
import 'aframe-osm-3d'

AFRAME.registerComponent("peakfinder", {
    init: function() {
       
        const scale = 10;
        const textScale = scale * 100;
        const statusDomEl = document.getElementById('status');
        
      //  window.addEventListener("gps-camera-update-position",  e=> {
            this.el.setAttribute('terrarium-dem', {
        //        lat: e.detail.position.latitude,
         //       lon: e.detail.position.longitude
				lat: 51.049,
				lon: -0.723
            });
       // });

        this.el.addEventListener('terrarium-start-update', e => {
            statusDomEl.innerHTML = "Loading elevation data...";
        });
        this.el.addEventListener('terrarium-dem-loaded', e => {
            statusDomEl.innerHTML = "Loading OSM data...";
        });
        
        this.el.addEventListener("osm-data-loaded", e=> {
            statusDomEl.innerHTML = "";
            e.detail.pois
                .filter( f => f.properties.natural == 'peak' && f.properties.name !== undefined)
                .forEach(f => {
                    const entity = document.createElement('a-entity');
                    entity.setAttribute('look-at', '[gps-projected-camera]');
                    const text = document.createElement('a-text');
                    text.setAttribute('value', f.properties.name);
                    text.setAttribute('scale', {
                        x: textScale,
                        y: textScale,
                        z: textScale
                    });
                    text.setAttribute('align', 'center');
                    text.setAttribute('position', {
                        x: 0,
                        y: scale * 20,
                        z: 0
                    });
                    entity.setAttribute('gps-projected-entity-place', {
                        longitude: f.geometry.coordinates[0],
                        latitude: f.geometry.coordinates[1]    
                    });
                    entity.appendChild(text);
                    const cone = document.createElement('a-cone');
                    cone.setAttribute('radiusTop', 0.1);
                    cone.setAttribute('scale', {
                        x: scale * 10,
                        y: scale * 10,
                        z: scale * 10
                    });
                    cone.setAttribute('height', 3);
                    cone.setAttribute('material', {
                        color: 'magenta'
                    });
                    entity.appendChild(cone);
                    entity.setAttribute('position', {
                        x: 0,
                        y: f.geometry.coordinates[2],
                        z: 0
                    });
                    this.el.appendChild(entity);
                });
        });
    }
});
