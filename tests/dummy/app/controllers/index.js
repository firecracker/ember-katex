import Ember from 'ember';

const {
  computed,
  Controller,
  String: {htmlSafe}
} = Ember;

export default Controller.extend({

  formula: "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi",

  throwOnError: false,

  html: "<h4>Start</h4>\n\n<div>\n  \\(f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi\\)\n</div>\n\n<h4>End</h4>",

  safeHtml: computed('html', function () {
    return htmlSafe(this.get('html'));
  })
});
