# pulito

Conventions and structure for a Vanilla JS application with a supporting webpack config.

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

Skeleton
--------

If you are starting a fresh project, pulito contains a project skeleton
to get you going.

    $ yarn init
    $ yarn add pulito
    $ unzip node_modules/pulito/skeleton.zip

You will be prompted to overwrite `package.json`, select 'yes'.

    $ make serve

At this point you should be able to visit the running skeleton
app at `http://localhost:8080`.

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

Usage
-----

The `webpack.config.js` for such a project can be very simple, just run:

    $ yarn add pulito

Then create a `webpack.config.js` file that looks like:

    const { commonBuilder } = require('pulito');
    module.exports = commonBuilder(__dirname);

At this point there's a lot of functionality present.

    $ npx webpack

Will build a debug version of all the demo pages and all the app pages
in `dist`.

    $ npx webpack-dev-server --watch

Will do the same as build, but served by the webpack-dev-server, which
will rebuild all source and reload the webpage any time you edit a file.

    $ npx webpack --watch

Will do the same as build, but will rebuild all the files in `dist`
when you edit a file.

    $ NODE_ENV=production npx webpack

Will build a release version of the pages in `dist`, no demo pages will be
emitted.
