
AFRAME.registerComponent('peakfinder', {
    init: function() {
        const scale = 500;
        const longitude = -0.72, latitude = 51.05;
        fetch(`https://www.hikar.org/fm/ws/bsvr.php?bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&outProj=4326&format=json&poi=natural`
            )
        .then(response => response.json())
        .then(json => {
            json.features.filter( f => f.properties.natural == 'peak')
            .forEach( peak => {
                const text = document.createElement("a-text");
                text.setAttribute("scale", {
                    x: scale,
                    y: scale,
                    z: scale
                });
                text.setAttribute("value", peak.properties.name);
                text.setAttribute("look-at", "[gps-projected-camera]");
                text.setAttribute('gps-projected-entity-place', {
                    longitude: peak.geometry.coordinates[0],
                    latitude: peak.geometry.coordinates[1]
                });
                this.el.appendChild(text);
            });
        });
    }
});

