
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
