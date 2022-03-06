
AFRAME.registerComponent('peakfinder', {
    schema: {
        scale: {
            type: 'number',
            default: 10
        }
    },

    init: function() {
        const longitude = -0.72, latitude = 51.05, textScale = this.data.scale * 100;

        // Call the Hikar API (OpenStreetMap-based) to get local POIs.
        // Note that data is only available for Europe and Turkey.
        fetch(`https://www.hikar.org/webapp/map?bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&layers=poi&outProj=4326`
            )
        .then(response => response.json())
        .then(json => {
            json.features.filter( f => f.properties.natural == 'peak')
            .forEach( peak => {
                    const entity = document.createElement('a-entity');
                    entity.setAttribute('look-at', '[gps-projected-camera]');
                    const text = document.createElement('a-text');
                    text.setAttribute('value', peak.properties.name);
                    text.setAttribute('scale', {
                        x: textScale,
                        y: textScale, 
                        z: textScale
                    });
                    text.setAttribute('align', 'center');
                    text.setAttribute('position', {
                        x: 0,
                        y: this.data.scale * 20, 
                        z: 0
                    });
                    entity.setAttribute('gps-projected-entity-place', {
                        latitude: peak.geometry.coordinates[1],
                        longitude: peak.geometry.coordinates[0]
                    });
                    entity.appendChild(text);
                    const cone = document.createElement('a-cone');
                    cone.setAttribute('radiusTop', 0.1);
                    cone.setAttribute('scale', {
                        x: this.data.scale * 10,
                        y: this.data.scale * 10,
                        z: this.data.scale * 10
                    });
                    cone.setAttribute('height', 3);
                    cone.setAttribute('material', { color: 'magenta' } );
                    entity.appendChild(cone);
                    entity.setAttribute('position', {
                        x: 0,
                        y: peak.geometry.coordinates[2],
                        z: 0
                    });

                    this.el.appendChild(entity);
            });
        });
    }
});

