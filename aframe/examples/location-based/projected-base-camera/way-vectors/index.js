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
