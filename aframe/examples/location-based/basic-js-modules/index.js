import '../../../build/aframe-ar.js';

window.onload = () => {
    let testEntitiesAdded = false;
    alert('If testing the lat/lon manual input on a mobile device, please turn off your GPS to avoid the real location being detected.');
    const el = document.querySelector("[gps-new-camera]");
    el.addEventListener("gps-camera-update-position", e => {
        if(!testEntitiesAdded) {
            alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            // Add four boxes to the north (red), south (yellow), west (blue)
            // and east (red) of the initial GPS position
            const properties = [{
                    color: 'red',
                    latDis: 0.001,
                    lonDis: 0
                },{
                    color: 'yellow',
                    latDis: -0.001,
                    lonDis: 0
                },{
                    color: 'blue',
                    latDis: 0,
                    lonDis: -0.001
                },{
                    color: 'green',
                    latDis: 0,
                    lonDis: 0.001
                }
            ];
            for(const prop of properties) {
                const entity = document.createElement("a-box");
                entity.setAttribute("scale", {
                    x: 20, 
                    y: 20,
                    z: 20
                });
                entity.setAttribute('material', { color: prop.color } );
                entity.setAttribute('gps-new-entity-place', {
                    latitude: e.detail.position.latitude + prop.latDis,
                    longitude: e.detail.position.longitude + prop.lonDis
                });
                
                document.querySelector("a-scene").appendChild(entity);
            }
            testEntitiesAdded = true;
        }
    });

    document.getElementById("go").addEventListener("click", e=> {
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;
        const minacc = document.getElementById('minacc').value;

        el.setAttribute('gps-new-camera', { simulateLatitude: lat, simulateLongitude: lon, positionMinAccuracy: minacc } );
    });
};
