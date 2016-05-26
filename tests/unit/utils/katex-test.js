/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
//
import katex from 'katex';

describe('katex', function() {
  // Replace this with your real tests.
  it('exists', function() {

    expect(katex).ok;
    expect(katex.render).a('function');
    expect(katex.renderToString).a('function');
  });
});
