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
        use: { loader: 'worker-loader' }
      }
    ]
  };

  return [{
    name: 'default',
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
        jsartoolkit: 'artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/threex-armarkercontrols.js')
      }
    },
    module,
    externals
  },
  {
    name: 'nft',
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
        jsartoolkit: 'artoolkit5-js',
        threexArmarkercontrols$: path.resolve(__dirname, 'three.js/src/threex/threex-armarkercontrols-nft.js')
      }
    },
    module,
    externals
  }];
};
