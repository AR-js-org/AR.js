var path = require('path');

module.exports = env => {
  const mode = env.production ? 'production' : 'development';
  const devtool = env.production ? false : 'inline-source-map';
  console.log(`${mode} build`);

  return [{
    name: 'default',
    mode,
    devtool,
    entry: './aframe/src/index.js',
    output: {
      library: 'ARjs',
      path: path.resolve(__dirname, 'aframe/build'),
      filename: 'aframe-ar.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    resolve: {
      alias: {
        jsartoolkit: 'artoolkit5-js'
      }
    },
    externals: {
      aframe: {
        commonjs: 'aframe',
        commonjs2: 'aframe',
        amd: 'aframe',
        root: 'AFRAME' // indicates global variable
      },
      three: {
        commonjs: 'three',
        commonjs2: 'three',
        amd: 'three',
        root: 'THREE' // indicates global variable
      }
    }
    // {
    //   name: 'nft',
    //   mode,
    //   devtool,
    //   entry: './aframe/src/index-nft.js',
    //   output: {
    //     library: 'ARjs',
    //     path: path.resolve(__dirname, 'aframe/build'),
    //     filename: 'aframe-ar-nft.js',
    //     libraryTarget: 'umd',
    //     globalObject: 'this'
    //   },
    //   resolve: {
    //     alias: {
    //       $jsartoolkit: 'artoolkit5-js'
    //     }
    //   }
    // }
  }];
};
