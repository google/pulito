# pulito

Conventions and structure for a Vanilla JS application with a supporting webpack config.

See [A la carte Web Development](https://bitworking.org/news/2018/03/a-la-carte-web-development)
for more background on pulito and how it fits into "A la carte" web
development.

Pulito expects a project to be laid out in the following format:

    /modules
       util.js            <-- JS modules. They can also be subdirs.
       ...
    /modules/element-name <-- Custom elment name.
               index.js
               element-name.js
               element-name.[s]css
               element-name-demo.js
               element-name-demo.html
    /pages                <- pages in your application.
       index.js
       index.html
       page2.js
       page2.html
       ...

If your project follows the conventions then pulito provides a webpack config
file that will build your application, both development and production profiles,
and will build demo pages for custom elements if they are present.

Disclaimer
----------

This is not an officially supported Google product.

Skeleton
--------

If you are starting a fresh project, pulito contains a project skeleton
to get you going.

    $ npm init
    $ npm add pulito
    $ unzip node_modules/pulito/skeleton.zip

You will be prompted to overwrite `package.json`, select 'yes'.

    $ make serve

At this point you should be able to visit the running skeleton
app at `http://localhost:8080/index.html`. This page is a built
version of `pages/index.html` which has an `<example-element>` on it - a simple spinner.

You can visit the demo page directly for the spinner by navigating to
`http://localhost:8080/example-element.html`.

Directory Structure
-------------------

JS modules are stored under `/modules` and each custom element has its own
directory under `modules/`. Each element may have a demo page, which is
indicated by the presence of a file ending in `-demo.html` and `-demo.js` in
the element's directory. If both files exist then a demo page will be written
into the `dist` directory.

Similary, pages of the webapp are expected to sit under the `/pages`
directory, and consist of both a JS and HTML file. These will be processed and
their output will also appear in the `dist` directory.

See also, section **Public Path**.

Element Structure
-----------------

Each element has its own directory.

* *index.js* - This file imports (via ES6 module imports) all the JS and CSS that define the element.
* *???.js* - This file contains all the JS for the custom element.
* *???.css* - This file contains all the CSS for the custom element. Note that this can also be an SCSS file with a .scss extension.
* *???-demo.js* -This file contains any JS that will run on the demo page.
* *???-demo.html* - This file is the HTML for the demo page.

You do not need to have a demo for each element. If you don't have
a demo, just omit the `-demo.js` and `-demo.html` files.

Usage
-----

The `webpack.config.js` for such a project can be very simple, just run:

    $ npm add pulito

Then create a `webpack.config.js` file that looks like:

    const { commonBuilder } = require('pulito');
    module.exports = commonBuilder(__dirname);

At this point there's a lot of functionality present.

    $ npx webpack --mode=development

Will build a debug version of all the demo pages and all the app pages
in `dist`. In the example Makefile, this is the default `make` command.

    $ npx webpack-dev-server --mode=production --watch-poll

Will do the same as build, but served by the webpack-dev-server, which
will rebuild all source and reload the webpage any time you edit a file.
In the example Makefile, this is command `make serve`.

    $ npx webpack --mode=development --watch-poll

Will do the same as build, but will rebuild all the files in `dist`
when you edit a file. In the example Makefile, this is the command `make watch`.

    $ NODE_ENV=production npx webpack --mode=production

Will build a release version of the pages in `dist`, no demo pages will be
emitted. In the example Makefile, this is the command `make release`.


Public Path
-----------

Sometimes, an app wants to specify that the js/css files are in an absolute path
(e.g. `/js/`, `/static/`). Webpack supports this with [publicPath](https://webpack.js.org/guides/public-path/).
Since Pulito just returns a Webpack object, the output of `commonBuilder` can be
modified directly, like:

    const { commonBuilder } = require('pulito');
    module.exports = commonBuilder(__dirname);
    module.exports.output.publicPath='/static/';

After re-creating the files (e.g. `make release`), the js and css will be linked in like

    <!-- In index.html -->
    <link href="/static/index-bundle.css?025351514c76002d06e1" rel="stylesheet">
    <script type="text/javascript" src="/static/index-bundle.js?b4a24109eb00b1ce7dc9"></script>


Also note that when running the dev server `make serve`, **all** pages will be served out
of that localhost:8080/[publicPath], for example, `localhost:8080/static/example-element.html`.
