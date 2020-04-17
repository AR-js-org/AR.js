const OsmWay = require('./osmway');

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

    init: function() {
    },

    update: function() {
        if (this.data.latitude >= -90 && this.data.latitude <= 90 && this.data.longitude >= -180 && this.data.longitude <= 180) {
            this._readOsm(this.data.latitude, this.data.longitude);
        }
    },

    _readOsm: function(lat, lon) {
        fetch(`https://hikar.org/fm/ws/bsvr.php?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&way=highway&format=json&outProj=3785`)
            .then(response => response.json())
            .then(json => {
                const objectIds = [];
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
                    if (f.geometry.type == 'LineString' && f.geometry.coordinates.length >= 2) {
                        f.geometry.coordinates.forEach(coord => {
                            line.push([coord[0], 0, -coord[1]]);
                        });


                        if (line.length >= 2) {
                            const g = new OsmWay(line, (drawProps[f.properties.highway] ? (drawProps[f.properties.highway].width || 5) : 5)).geometry;

                            const color = drawProps[f.properties.highway] ? (drawProps[f.properties.highway].color || '#ffffff') : '#ffffff';

                            const mesh = new THREE.Mesh(g,
                                new THREE.MeshBasicMaterial({
                                    color: color
                                }));
                            this.el.setObject3D(f.properties.osm_id, mesh);
                            objectIds.push(f.properties.osm_id);
                        }
                    }
                });
                this.el.emit('vector-ways-loaded', {
                    objectIds: objectIds
                });
            });
    }
});
