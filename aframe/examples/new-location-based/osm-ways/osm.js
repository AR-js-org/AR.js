
AFRAME.registerComponent('osm', {
    schema: {
        latitude: {
            type: 'number',
            default: 181
        },
        longitude: {
            type: 'number',
            default: 91
        }
    },

    update: function() {
        if (this.data.latitude >= -90 && this.data.latitude <= 90 && this.data.longitude >= -180 && this.data.longitude <= 180) {
            this._readOsm(this.data.latitude, this.data.longitude);
        }
    },

    _readOsm: function(lat, lon) {
        const camera = document.querySelector("[gps-new-camera]");
        const gpsCameraComponent = camera.components["gps-new-camera"];
        if(!gpsCameraComponent) {
            alert('gps-new-camera component not initialised');
            return;
        }
        fetch(`https://hikar.org/webapp/map?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layers=ways&outProj=4326`)
            .then(response => response.json())
            .then(json => {
                const drawProps = {
                    'footway': { color: '#00ff00' },
                    'path': { color: '#00ff00' },
                    'steps': { color: '#00ff00' },
                    'bridleway': { color: '#ffc000' },
                    'byway': { color: '#ff0000' },
                    'track': { color: '#ff8080' },
                    'cycleway': { color: '#00ffff' },
                };
                const features = [];
                json.features.forEach((f, i) => {
                    const line = [];
                    let projectedCoords;
                    if (f.geometry.type == 'LineString' && f.geometry.coordinates.length >= 2) {
                        f.geometry.coordinates.forEach(coord => {
                            projectedCoords = gpsCameraComponent.threeLoc.lonLatToWorldCoords(coord[0], coord[1]);
                            line.push([projectedCoords[0], 0, projectedCoords[1]]);
                        });

                        if (line.length >= 2) {
                            const g = new OsmWay(line, (drawProps[f.properties.highway] ? (drawProps[f.properties.highway].width || 5) : 5)).geometry;

                            const color = drawProps[f.properties.highway] ? (drawProps[f.properties.highway].color || '#ffffff') : '#ffffff';

                            const mesh = new THREE.Mesh(g,
                                new THREE.MeshBasicMaterial({
                                    color: color
                                }));
                            this.el.setObject3D(f.properties.osm_id, mesh);
                        }
                    }
                });
            });
    }
});
