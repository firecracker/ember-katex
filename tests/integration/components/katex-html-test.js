/* jshint expr:true */
import Ember from 'ember';

const {
  String: {htmlSafe}
} = Ember;

import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'katex-html',
  'Integration: KatexHtmlComponent',
  {
    integration: true
  },
  function() {
    let m;

    const goodFormula  = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi";
    const goodHtml     = `<h2>Start</h2> <div>\\(${goodFormula}\\)</div> <h2>End</h2>`;
    const goodSafeHtml = htmlSafe(goodHtml);

    const badFormula   = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xix";
    const badHtml      = `<h2>Start</h2> <div>\\(${badFormula}\\)</div> <h2>End</h2>`;
    const badSafeHtml  = htmlSafe(badHtml);




    it('empty', function() {
      this.render(hbs`{{#katex-html}}{{/katex-html}}`);
      expect(this.$('span')).length(0);
    });




    it('goodHtml block', function() {
      this.setProperties({
        html: goodHtml
      });

      this.render(hbs`{{#katex-html}} {{{html}}} {{/katex-html}}`);

      expect(this.$('span').length).gt(1);
    });




    it('goodHtml inline', function() {
      this.setProperties({
        safeHtml: goodSafeHtml
      });

      this.render(hbs`{{katex-html safeHtml = safeHtml}}`);

      m = "The formula should be rendered.";
      expect(this.$('span').length, m).gt(1);

      this.setProperties({
        safeHtml: badSafeHtml
      });

      m = "The formula should be empty after error.";
      expect(this.$('span').length, m).eq(0);
    });
  }
);
