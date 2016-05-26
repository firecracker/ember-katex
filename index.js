/* jshint node: true */

/**
 * @module ember-katex
 * */

'use strict';

var fs   = require('fs');
var path = require('path');

module.exports = {
  name: 'ember-katex',

  included: function(app) {
    this._super.included.apply(this, ...arguments);

    var libPath  = path.join(app.bowerDirectory, 'KaTeX', 'dist');
    var fontPath = path.join(libPath, 'fonts');

    app.import(path.join(libPath, 'katex.min.js'), {
      exports: {
        katex: [
          'default',
          'render',
          'renderToString',
          'ParseError',
        ]
      }
    });

    app.import(path.join(libPath, 'contrib', 'auto-render.min.js'), {
      exports: {
        renderMathInElement: ['default']
      }
    });

    app.import(path.join('vendor', 'katex', 'shim.js'));

    app.import(path.join(libPath, 'katex.min.css'));

    fs.readdirSync(fontPath).forEach(function(font) {
      app.import(path.join(fontPath, font), {
        destDir: path.join('assets', 'fonts')
      });
    });
  }
};
