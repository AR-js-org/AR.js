
window.onload = () => {
    const osmElement = document.querySelector('[osm]');
    document.getElementById('status').innerHTML = 'Loading OpenStreetMap data...';
    osmElement.addEventListener('vector-ways-loaded', e => {
        document.getElementById('status').innerHTML = '';
    });
};
