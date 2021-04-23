import 'arjs/aframe/build/aframe-ar-nft.js'
import './osm.js'
import './gps-vector-ways.js'

AFRAME.registerComponent("osmapp", {
	init: function() {
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
});
