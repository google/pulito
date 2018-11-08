import localResolve from 'rollup-plugin-local-resolve';
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve';
import html from 'rollup-plugin-fill-html';
import clean from 'rollup-plugin-clean';

let hash = (Math.random()+"").split(".")[1];

export default {
  input: 'pages/index.js',
  output: {
    file: `dist/bundle.${hash}.js`,
    format: 'iife'
  },
  plugins: [
    clean(),
    localResolve(),
    resolve(),
    postcss({
      extract: true,
      plugins: []
    }),
    html({
      template: 'pages/index.html',
      filename: 'index.html'
    }),
  ],
}
