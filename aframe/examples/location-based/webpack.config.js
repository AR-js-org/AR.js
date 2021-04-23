const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'hello-world/dist/bundle': './hello-world/index.js',
        'always-face-user/dist/bundle': './always-face-user/index.js',
        'avoid-shaking/dist/bundle': './avoid-shaking/index.js',
        'click-places/dist/bundle': './click-places/index.js',
        'places-name/dist/bundle': './places-name/index.js',
        'max-min-distance/dist/bundle': './max-min-distance/index.js',
        'show-arbitrary-distant-places/dist/bundle': './show-arbitrary-distant-places/index.js',
        'projected-base-camera/dist/bundle': './projected-base-camera/index.js',
        'osm-ways/dist/bundle': './osm-ways/index.js',
        'peakfinder-2d/dist/bundle': './peakfinder-2d/index.js',
        'peakfinder-3d/dist/bundle': './peakfinder-3d/index.js'
    },

    output: {
        path: path.resolve(__dirname, '.'),
        filename: '[name].js'
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new NodePolyfillPlugin()
    ]
};

