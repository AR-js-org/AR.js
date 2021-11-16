(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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

},{}],2:[function(require,module,exports){
window.onload = () => {
    const osmElement = document.getElementById('osmElement');
    document.getElementById('status').innerHTML = 'Loading OpenStreetMap data...';
    const gpsProjCamera = document.querySelector('a-camera').components['gps-projected-camera'];

    osmElement.setAttribute('osm', {
        longitude: gpsProjCamera.data.simulateLongitude,
        latitude: gpsProjCamera.data.simulateLatitude
    });

    osmElement.addEventListener('vector-ways-loaded', e => {
        document.getElementById('status').innerHTML = '';
    });
}

},{}],3:[function(require,module,exports){
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

},{"./osmway":4}],4:[function(require,module,exports){

class OsmWay {
    constructor(vertices, width = 1) {
        let dx, dz, len, dxperp, dzperp, nextVtxProvisional = [], thisVtxProvisional;
        const k = vertices.length - 1;
        const realVertices = [];
        for (let i = 0; i < k; i++) {
            dx = vertices[i + 1][0] - vertices[i][0];
            dz = vertices[i + 1][2] - vertices[i][2];
            len = this.distance(vertices[i], vertices[i + 1]);
            dxperp = -(dz * (width / 2)) / len;
            dzperp = dx * (width / 2) / len;
            thisVtxProvisional = [
                vertices[i][0] - dxperp,
                vertices[i][1],
                vertices[i][2] - dzperp,
                vertices[i][0] + dxperp,
                vertices[i][1],
                vertices[i][2] + dzperp,
            ];
            if (i > 0) {
                // Ensure the vertex positions are influenced not just by this
                // segment but also the previous segment
                thisVtxProvisional.forEach((vtx, j) => {
                    vtx = (vtx + nextVtxProvisional[j]) / 2;
                });
            }
            realVertices.push(...thisVtxProvisional);
            nextVtxProvisional = [
                vertices[i + 1][0] - dxperp,
                vertices[i + 1][1],
                vertices[i + 1][2] - dzperp,
                vertices[i + 1][0] + dxperp,
                vertices[i + 1][1],
                vertices[i + 1][2] + dzperp,
            ];
        }
        realVertices.push(vertices[k][0] - dxperp);
        realVertices.push(vertices[k][1]);
        realVertices.push(vertices[k][2] - dzperp);
        realVertices.push(vertices[k][0] + dxperp);
        realVertices.push(vertices[k][1]);
        realVertices.push(vertices[k][2] + dzperp);


        let indices = [];
        for (let i = 0; i < k; i++) {
            indices.push(i * 2, i * 2 + 1, i * 2 + 2);
            indices.push(i * 2 + 1, i * 2 + 3, i * 2 + 2);
        }

        let geom = new THREE.BufferGeometry();
        let bufVertices = new Float32Array(realVertices);
        geom.setIndex(indices);
        geom.setAttribute('position', new THREE.BufferAttribute(bufVertices, 3));
        geom.computeBoundingBox();
        this.geometry = geom;
    }

    distance(v1, v2) {
        const dx = v2[0] - v1[0];
        const dy = v2[1] - v1[1];
        const dz = v2[2] - v1[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

module.exports = OsmWay;

},{}]},{},[2,3,1,4]);
