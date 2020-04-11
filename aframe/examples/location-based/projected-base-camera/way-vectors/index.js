window.onload = () => {

    let gettingData = false, osmElement = document.getElementById('osmElement');

    document.getElementById('status').innerHTML = 'Loading OSM data...';
    
    let gpsProjCamera = document.querySelector('a-camera').components['gps-projected-camera'];

    osmElement.setAttribute('osm', {
        longitude: gpsProjCamera.data.simulateLongitude,
        latitude: gpsProjCamera.data.simulateLatitude 
    });

    osmElement.addEventListener('vector-ways-loaded', e=> {
        document.getElementById('status').innerHTML = '';
        gettingData = false;
    });
}
