import Ember from 'ember';

const {
  $,
  Component,
  computed,
  merge,
  String: {htmlSafe}
} = Ember;

import {renderMathInElement} from 'katex';

import layout from '../templates/components/katex-html';

/**
 * @class KatexHTML
 * @extends Ember.Component
 * @ember component
 **/

export default Component.extend({

  // ----- Arguments -----

  /**
   * @property catchErrors
   * @type Boolean
   * @default true
   * @ember argument
   **/
  catchErrors: true,

  /**
   * @property delimiters
   * @type Array
   * @optional
   * @default undefined
   * @ember argument
   **/
  delimiters: undefined,

  /**
   * @property ignoredTags
   * @type Array
   * @optional
   * @default undefined
   * @ember argument
   **/
  ignoredTags: undefined,



  // ----- Overridden properties -----

  /**
   * @property layout
   * @final
   **/
  layout,

  /**
   * @property classNames
   * @type Array
   **/
  classNames: ['katexHtml'],



  // ----- Computed properties -----

  /**
   * @proeprty options
   * @comupted delimiters, ignoredTags
   * @final
   **/
  options: computed(
    'delimiters',
    'ignoredTags',
    function () {
      let result = {};

      const delimiters = this.get('delimiters');

      if (delimiters != null) {
        merge(result, {delimiters});
      }

      const ignoredTags = this.get('ignoredTags');

      if (ignoredTags != null) {
        merge(result, {ignoredTags});
      }

      return result;
    }
  ),


  /**
   * @proeprty result
   *
   * An htmlSafe string containing HTML with formulas rendered.
   *
   * @comupted safeHtml, options
   * @final
   **/
  result: computed('safeHtml', 'options', function () {
    //ToDo: error if `safeHtml` string is not html safe
    const $element = $(`<div>${this.get('safeHtml')}</div>`);
    renderMathInElement($element[0], this.get('options'));
    return htmlSafe($element.prop('outerHTML'));
  }),
});
