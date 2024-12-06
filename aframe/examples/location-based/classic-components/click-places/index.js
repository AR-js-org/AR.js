import 'arjs/aframe/build/aframe-ar-nft.js'

AFRAME.registerComponent('clicker', {
    init: function() {
        this.el.addEventListener('click', e => {
            alert('Box clicked!');
        });
    }
});

