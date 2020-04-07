var path = require('path');

module.exports = {
  mode: 'development',
  entry: './aframe/src/index.js',
  output: {
    library: 'ARjs',
    path: path.resolve(__dirname, 'aframe/build'),
    filename: 'aframe-ar.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
  // resolve: {
  //   alias: {
  //     xyz$: path.resolve(__dirname, 'path/to/file.js')
  //   }
  // }
};
