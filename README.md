ember-katex
===========

[![Travis](https://api.travis-ci.org/firecracker/ember-katex.svg?branch=gen-1)](https://travis-ci.org/firecracker/ember-katex)
[![npm](https://img.shields.io/npm/v/ember-katex.svg?maxAge=2592000)](https://www.npmjs.com/package/ember-katex)
[![Ember Observer Score](https://emberobserver.com/badges/ember-katex.svg)](https://emberobserver.com/addons/ember-katex)
![1.13+](https://embadge.io/v1/badge.svg?start=1.13.0)


Render your math-tex formulas using [KaTeX](http://khan.github.io/KaTeX/). 



Installation
------------

    ember i ember-katex


Usage
-----

### Rendering individual formulas using `{{katex-formula}}`

Pass a formula as an argument.

#### Example

```hbs
{{katex-formula
  formula = "f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi"
}}
```

#### Arguments

| Argument       | Type    | Default           | Description                                                           |
|:---------------|:--------|:------------------|:----------------------------------------------------------------------|
| `formula`      | String  | <required>        | A formula to render                                                   |
| `throwOnError` | Boolean | `false` :warning: | Whether to crash on parse errors                                      |
| `errorColor`   | String  | `'#cc0000'`       | A color which unsupported commands are rendered in                    |
| `displayMode`  | Boolean | `false`           | Whether to display the formula in inline (false) or block (true) form |

#### Security warning

`{{katex-formula}}` wraps output into `Ember.String.htmlSafe` so that KaTeX resulting HTML gets injected into the page. If a user manages to pass malicious HTML through KaTeX own sanitization, it will be injected into the page and open your app to XSS attacks. 

It is your duty to properly sanitize incoming formulas, so that no malicious HTML elements or attributes get through.
 

### Rendering HTML with formulas using `{{katex-html}} inline form`

The `{{katex-html}}` component accepts `safeHtml` -- a string of HTML wrapped into `Ember.String.htmlSafe()`. It is your duty to properly sanitize the HTML and explicitly mark it as safe via `Ember.String.htmlSafe()`. If you neglect to sanitize your HTML, it will be marked

Formulas must be wrapped with `\(` and `\)` (configurable). Note: sometimes you'll need to use double backslashes, e. g. `'\\('` and `'\\)', in order to prevent the backslash to be treated as an escape character.


#### Example

```js
{
  safeHtml: Ember.computed(function () {
    return Ember.String.htmlSafe(`
      <div>
        \\(
          f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi
        \\)
      </div>
    `);
  });
}
```


```hbs
{{katex-html safeHtml = safeHtml}}
```

#### Arguments


| Argument      | Type                                            | Default                                                                            | Description                                                |
|:--------------|:------------------------------------------------|:-----------------------------------------------------------------------------------|:-----------------------------------------------------------|
| `safeHtml`    | A falsy value or String wrapped in `htmlSafe()` | <required>                                                                         | HTML with formulas to render in place.                     |
| `delimiters`  | Array of hashes                                 | [see](https://github.com/Khan/KaTeX/blob/master/contrib/auto-render/README.md#api) | A list of delimiters to look for math.                     |
| `ignoredTags` | Array of strings                                | [see](https://github.com/Khan/KaTeX/blob/master/contrib/auto-render/README.md#api) | A list of DOM node types to ignore when recursing through. |

Note: this comopnent leverages KaTeX in-place rendering (`renderMathInElement` aka auto-render). KaTeX in-place rendering does not support voluntarily crashing on errors. All parse error will be reported via `browser.error` and formula sources will be displayed.



### Rendering HTML with formulas using `{{#katex-html}} block form`

Instead of passing the `safeHtml` argument, you can pass a Handlebars block:

```hbs
{{#katex-html}}
  <div>
    \(
      f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi
    \)
  </div>
{{/katex-html}}
```

You get the benefit of using Handlebars, but formula bindings will **not** be updated dynamically. Use this feature only if your formula content is static.

The `\(` and `\)` formula markers should be within one HTML text node, otherwise KaTeX will not recognize the formula. This will **not** work:

```hbs
{{! faulty example}}

{{#katex-html}}
  <div>
    \( {{formula}} \)
  </div>
{{/katex-html}}
```

You can overcome this limitation using a computed property or a custom helper (not included):

```hbs
{{! faulty example}}

{{#katex-html}}
  <div>
    {{wrap-formula formula}}
  </div>
{{/katex-html}}
```


License
-------

This software is free to use under the MIT license. See the [LICENSE](https://github.com/firecracker/ember-katex/blob/gen-1/LICENSE.md) file for license text and copyright information.

Includes fragments of code borrowed from [andybluntish/ember-cli-latex-maths](https://github.com/andybluntish/ember-cli-latex-maths).
