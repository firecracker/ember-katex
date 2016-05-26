/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'katex-formula',
  'Integration: KatexFormulaComponent',
  {
    integration: true
  },
  function() {

    const formula = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi";

    it('empty', function() {
      this.render(hbs`{{katex-formula}}`);
      expect(this.$('span')).length(0);
    });

    it('formula good, then bad', function() {
      this.setProperties({
        formula
      });

      this.render(hbs`{{katex-formula formula=formula throwOnError=true}}`);

      expect(this.$('span').length).gt(1);

      expect(() => {
        this.set('formula', "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xix");
      }).throw();
    });
  }
);
