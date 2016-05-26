/* globals define, katex, renderMathInElement */

define('katex', [], function() {
  'use strict';

  return {
    default:             katex,
    render:              katex.render,
    renderToString:      katex.renderToString,
    ParseError:          katex.ParseError,
    renderMathInElement: renderMathInElement
  };
});
