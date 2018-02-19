// The commonBuilder function generates a common configuration for webpack.
// You can require() it at the start of your webpack.config.js and then make
// modifications to it from there. Users should at a minimum fill in the entry
// points.  See webpack.config.js in this directory as an example.
//
// Usage:
//    A webpack.config.js can be as simple as:
//
//       const { commonBuilder } = require('pulito');
//       module.exports = commonBuilder(__dirname);
//
//    For an application you need to add the entry points and associate them
//    with HTML files:
//
//        const { commonBuilder } = require('../res/mod/webpack.common.js');
//        const HtmlWebpackPlugin = require('html-webpack-plugin');
//
//        let common = commonBuilder(__dirname);
//        common.entry.index = './pages/index.js'
//        common.plugins.push(
//            new HtmlWebpackPlugin({
//              filename: 'index.html',
//              template: './pages/index.html',
//              chunks: ['index'],
//            })
//        );
//
//        module.exports = common
//
// You do not need to add any of the plugins or loaders used here to your
// local package.json, on the other hand, if you add new loaders or plugins
// in your local project then you should 'yarn add' them to your local
// package.json.
//
// This config understands NODE_ENV and can build production versions
// of assets by setting the environment variable. An example Makefile:
//
//     build:
//      	npx webpack
//
//     release:
//      	NODE_ENV=production npx webpack
//
const path = require('path');
const { lstatSync, readdirSync } = require('fs')
const { basename, join, resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");


/* A function that will look at all subdirectories of 'dir',
 *
 * Presumes that each element will have a file structure of:
 *
 *    push-selection-sk/
 *      index.js
 *      push-selection-sk-demo.html
 *      push-selection-sk-demo.js
 *      push-selection-sk.css
 *      push-selection-sk.js
 *
 * Where the -demo.html and -demo.js files are only used to demo
 * the element.
 *
 * The function will find those demo files and do the equivalent
 * of the following to the webpack_config:
 *
 *      webpack_config.entry.["pusk-selection-sk"] = './push-selection-sk/push-selection-sk-demo.js';
 *      webpack_config.plugins.push(
 *        new HtmlWebpackPlugin({
 *          filename: 'push-selection-sk.html',
 *          template: './push-selection-sk/push-selection-sk-demo.html',
 *        }),
 *      );
 *
 * */
function demoFinder(dir, webpack_config) {
  // Look at all sub-directories of dir and if a directory contains
  // both a -demo.html and -demo.js file then add the corresponding
  // entry points and Html plugins to the config.

  // Find all the dirs below 'dir'.
  const isDir = filename => lstatSync(filename).isDirectory()
  const dirs = readdirSync(dir).map(name => join(dir, name)).filter(isDir);

  dirs.forEach(d => {
    // Look for both a *-demo.js and *-demo.html file in the directory.
    const files = readdirSync(d);
    let demoHTML = '';
    let demoJS = '';
    files.forEach(file => {
      if (file.endsWith('-demo.html')) {
        if (!!demoHTML) {
          throw 'Only one -demo.html file is allowed per directory: ' + file;
        }
        demoHTML = file;
      }
      if (file.endsWith('-demo.js')) {
        if (demoJS != '') {
          throw 'Only one -demo.js file is allowed per directory: ' + file;
        }
        demoJS = file;
      }
    });
    if (!!demoJS && !!demoHTML) {
      let name = basename(d);
      webpack_config.entry[name] = join(d, demoJS);
      webpack_config.plugins.push(
        new HtmlWebpackPlugin({
          filename: name + '.html',
          template: join(d, demoHTML),
          chunks: [name],
        }),
      );
    } else if (!!demoJS || !!demoHTML) {
      console.log("WARNING: An element needs both a *-demo.js and a *-demo.html file.");
    }
  });

  return webpack_config
}

module.exports.commonBuilder = function(dirname) {
  let common = {
    entry: {
      // Users of webpack.common must fill in the entry point(s).
    },
    output: {
      path: path.resolve(dirname, 'dist'),
      filename: '[name]-bundle.js?[chunkhash]',
      publicPath: '/',
    },
    resolveLoader: {
      // This config file references loaders, make sure users of this common
      // config can find those loaders by including the local node_modules
      // directory.
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.[s]?css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2, // postcss-loader and sass-loader.
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: path.resolve(__dirname, 'postcss.config.js')
                  },
                },
              },
              {
                loader: 'sass-loader', // Since SCSS is a superset of CSS we can always apply this loader.
                options: {
                  includePaths: [__dirname],
                }
              }
            ],
          })
        },
        {
          test: /\.html$/,
          use: [
            {
              loader:'html-loader',
              options: {
                name: '[name].[ext]',
              },
            }
          ],
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name]-bundle.css?[contenthash]',
      }),
      new CleanWebpackPlugin(
        ['dist'],
        {
          root: path.resolve(dirname),
        }
      ),
      // Users of pulito can append any plugins they want, but they
      // need to make sure they installed them in their project via yarn.
    ],
  };
  if (process.env.NODE_ENV == 'production') {
    common.plugins.push(
      new MinifyPlugin({}, {
        comments: false,
      })
    )
  } else {
    common = demoFinder(dirname, common);
  }
  return common;
};
