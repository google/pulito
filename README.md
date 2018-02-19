# pulito
Conventions and structure for a Vanilla JS application with a supporting webpack config.

Pulito expects a project to be laid out in the following format:

    /modules
       util.js
    /modules/element-name
               index.js
               element-name.js
               element-name.[s]css
               element-name-demo.js
               element-name-demo.html
    /pages
       index.js
       index.html
       page2.js
       page2.html

Where JS modules are under `/modules` and each custom element has its own
directory under `modules/`. Each element may have a demo page, which is
indicated by the presence of a file ending in `-demo.html` and `-demo.js` in
the element's directory. If both files exist then a demo page will be written
into the `dist` directory.

Similary, pages of the webapp are expected to sit under the `/pages`
directory, and consist of both a JS and HTML file. These will be processed and
their output will also appear in the `dist` directory.
