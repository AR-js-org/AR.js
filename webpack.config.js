var path = require('path');

module.exports = (env, argv) => {
  let devtool = false;
  if (argv.mode === 'development') {
    devtool = 'inline-source-map';
  }
  console.log(`${argv.mode} build`);
  const externals = {
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
  };
  const module = {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: 'no-fallback'
          }
        }
      }
    ]
  };

  return [{
    name: 'aframe',
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
        jsartoolkit: '@ar-js-org/artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
      }
    },
    module,
    externals
  },
  {
    name: 'aframe-nft',
    devtool,
    entry: './aframe/src/index-nft.js',
    output: {
      library: 'ARjs',
      path: path.resolve(__dirname, 'aframe/build'),
      filename: 'aframe-ar-nft.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    resolve: {
      alias: {
        jsartoolkit: '@ar-js-org/artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
      }
    },
    module,
    externals
  },
  {
    name: 'aframe-location-only',
    devtool,
    entry: './aframe/src/location-based/index.js',
    output: {
      library: 'ARjs',
      path: path.resolve(__dirname, 'aframe/build'),
      filename: 'aframe-ar-location-only.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module,
    externals
  },
  {
    name: 'aframe-new-location-only',
    devtool,
    entry: './aframe/src/new-location-based/index.js',
    output: {
      library: 'ARjs',
      path: path.resolve(__dirname, 'aframe/build'),
      filename: 'aframe-ar-new-location-only.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module,
    externals
  },
  {
    name: 'threex',
    devtool,
    entry: './three.js/src/index-threex.js',
    output: {
      library: 'THREEx',
      path: path.resolve(__dirname, 'three.js/build'),
      filename: 'ar-threex.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    resolve: {
      alias: {
        jsartoolkit: '@ar-js-org/artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
      }
    },
    module,
    externals: {
      three: {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE' // indicates global variable
      }
    }
  },
  {
    name: 'threex-location-only',
    devtool,
    entry: './three.js/src/location-based/index.js',
    output: {
      library: 'THREEx',
      path: path.resolve(__dirname, 'three.js/build'),
      filename: 'ar-threex-location-only.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module,
    externals: {
      three: {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE' // indicates global variable
      }
    }
  },
  {
    name: 'ar.js',
    devtool,
    entry: './three.js/src/index-arjs.js',
    output: {
      library: 'ARjs',
      path: path.resolve(__dirname, 'three.js/build'),
      filename: 'ar.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    resolve: {
      alias: {
        jsartoolkit: '@ar-js-org/artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/arjs-markercontrols.js')
      }
    },
    module,
    externals: {
      three: {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE' // indicates global variable
      }
    }
  }
 ];
};
