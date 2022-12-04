
window.onload = () => {
    const osmElement = document.getElementById('osmElement');
    document.getElementById('status').innerHTML = 'Loading OpenStreetMap data...';
    const gpsProjCamera = document.querySelector('a-camera').components['gps-projected-camera'];

    window.addEventListener("gps-camera-update-position", e=> {
        osmElement.setAttribute('osm', {
            longitude: e.detail.position.longitude,
            latitude: e.detail.position.latitude
        });
    });

    osmElement.addEventListener('vector-ways-loaded', e => {
        document.getElementById('status').innerHTML = '';
    });
};
