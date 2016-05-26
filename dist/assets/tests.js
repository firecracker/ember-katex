define('dummy/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | app.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('app.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/controllers/index.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | controllers/index.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('controllers/index.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('dummy/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/destroy-app.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/destroy-app.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'dummy/tests/helpers/start-app', 'dummy/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _dummyTestsHelpersStartApp, _dummyTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _dummyTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _dummyTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('dummy/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/module-for-acceptance.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/module-for-acceptance.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/helpers/reporter', ['exports'], function (exports) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /*
   * A Mocha reporter meant to be used with ember-cli-mocha and ember-cli-blanket
   *
   * Based on Edward Faulnker's better-mocha-html-reporter:
   * <https://github.com/ef4/better-mocha-html-reporter>
   *
   * With modifications from Elad Shahar:
   * <https://gist.github.com/SaladFork/15683b00388bfe1d1458>
   *
   * And Andrey Mikhaylov (lolmaus):
   * <https://gist.github.com/lolmaus/8b5e84762c85142e43c2>
   */

  /* global Url, mocha, Mocha, chai */

  var Reporter = (function () {
    function Reporter(runner, mocha) {
      _classCallCheck(this, Reporter);

      this.passes = 0;
      this.failures = 0;
      this.runner = runner;

      this.setupDOM();
      this.setupEvents(runner);
      this.setupBlanket();

      if (Url.queryString("no_try_catch")) {
        mocha.allowUncaught();
        this.monkeyPatchRunnableForAllowUncaughtInAsync();
      }
    }

    _createClass(Reporter, [{
      key: 'monkeyPatchRunnableForAllowUncaughtInAsync',
      value: function monkeyPatchRunnableForAllowUncaughtInAsync() {
        Mocha.Runnable.prototype.run = function (fn) {
          var self = this;
          var start = new Date();
          var ctx = this.ctx;
          var finished;
          var emitted;

          // Sometimes the ctx exists, but it is not runnable
          if (ctx && ctx.runnable) {
            ctx.runnable(this);
          }

          // called multiple times
          function multiple(err) {
            if (emitted) {
              return;
            }
            emitted = true;
            self.emit('error', err || new Error('done() called multiple times; stacktrace may be inaccurate'));
          }

          // finished
          function done(err) {
            var ms = self.timeout();
            if (self.timedOut) {
              return;
            }
            if (finished) {
              return multiple(err || self._trace);
            }

            self.clearTimeout();
            self.duration = new Date() - start;
            finished = true;
            if (!err && self.duration > ms && self._enableTimeouts) {
              err = new Error('timeout of ' + ms + 'ms exceeded. Ensure the done() callback is being called in this test.');
            }
            fn(err);
          }

          // for .resetTimeout()
          this.callback = done;

          // explicit async with `done` argument
          if (this.async) {
            this.resetTimeout();

            if (this.allowUncaught) {
              return callFnAsync(this.fn);
            }
            try {
              callFnAsync(this.fn);
            } catch (err) {
              done(Mocha.utils.getError(err));
            }
            return;
          }

          if (this.allowUncaught) {
            callFn(this.fn);
            done();
            return;
          }

          // sync or promise-returning
          try {
            if (this.pending) {
              done();
            } else {
              callFn(this.fn);
            }
          } catch (err) {
            done(Mocha.utils.getError(err));
          }

          function callFn(fn) {
            var result = fn.call(ctx);
            if (result && typeof result.then === 'function') {
              self.resetTimeout();
              result.then(function () {
                done();
                // Return null so libraries like bluebird do not warn about
                // subsequently constructed Promises.
                return null;
              }, function (reason) {
                done(reason || new Error('Promise rejected with no or falsy reason'));
              });
            } else {
              if (self.asyncOnly) {
                return done(new Error('--async-only option in use without declaring `done()` or returning a promise'));
              }

              done();
            }
          }

          function callFnAsync(fn) {
            fn.call(ctx, function (err) {
              if (err instanceof Error || Object.prototype.toString.call(err) === '[object Error]') {
                if (mocha.options.allowUncaught && !(err instanceof chai.AssertionError)) {
                  throw err;
                }
                return done(err);
              }
              if (err) {
                if (Object.prototype.toString.call(err) === '[object Object]') {
                  return done(new Error('done() invoked with non-Error: ' + JSON.stringify(err)));
                }
                return done(new Error('done() invoked with non-Error: ' + err));
              }
              done();
            });
          }
        };
      }
    }, {
      key: 'setupDOM',
      value: function setupDOM() {
        var _this = this;

        var $rootNode = $('#mocha');

        if (!$rootNode) {
          throw new Error('#mocha missing, ensure it is in your document');
        }

        $rootNode.append(template);

        $('#test-title').text(document.title).on('click', function (e) {
          e.preventDefault();
          if (Url.queryString("grep")) {
            Url.updateSearchParam("grep");
            window.location.reload();
          }
        });

        this.setupCanvas();

        this.$stats = $('#mocha-stats');
        this.stack = [$('#mocha-report')];

        this.$hidePassed = this.$stats.find('#hide-passed');

        this.$hidePassed.attr('checked', Url.queryString('hide_passed')).on('change', function () {
          return _this.updateHidePassed();
        });

        this.updateHidePassed();

        this.$coverage = this.$stats.find('#enable-coverage');
        this.$coverage.attr('checked', Url.queryString("coverage")).on('change', function () {
          return _this.updateCoverageEnabled();
        });

        this.updateCoverageEnabled();

        this.$noTryCatch = this.$stats.find('#no-try-catch');
        this.$noTryCatch.attr('checked', Url.queryString("no_try_catch")).on('change', function () {
          return _this.updateNoTryCatch();
        });

        this.updateNoTryCatch();
      }
    }, {
      key: 'setupEvents',
      value: function setupEvents(runner) {
        var _this2 = this;

        function handlerForEvent(event) {
          // e.g., "suite end" => "onSuiteEnd"
          return ('on ' + event).replace(/ [\w]/g, function (m) {
            return m[1].toUpperCase();
          });
        }

        var events = ['start', // execution of testing started
        'end', // execution of testing ended
        'suite', // execution of a test suite started
        'suite end', // execution of a test suite ended
        'test', // execution of a test started
        'test end', // execution of a test ended
        'hook', // execution of a hook started
        'hook end', // execution of a hook ended
        'pass', // execution of a test ended in pass
        'fail', // execution of a test ended in fail
        'pending'];
        events.forEach(function (event) {
          var reporter = _this2;
          runner.on(event, function () /* arguments */{
            var handler = reporter[handlerForEvent(event)];
            if (handler) {
              handler.apply(reporter, arguments);
            }
          });
        });
      }
    }, {
      key: 'setupBlanket',
      value: function setupBlanket() {
        var _this3 = this;

        if (!window.blanket) {
          return;
        }
        var blanket = window.blanket;
        var origOnTestsDone = blanket.onTestsDone;

        blanket.onTestsDone = function () {
          origOnTestsDone.apply(blanket);
          _this3.onBlanketDone();
        };
      }
    }, {
      key: 'setupCanvas',
      value: function setupCanvas() {
        var ratio = window.devicePixelRatio || 1;

        this.canvas = $('.mocha-progress canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(ratio, ratio);
      }
    }, {
      key: 'updateDuration',
      value: function updateDuration() {
        var seconds = (new Date() - this.startedAt) / 1000;
        this.$stats.find('.duration .value').text(seconds.toFixed(2));
      }
    }, {
      key: 'updateProgress',
      value: function updateProgress() {
        try {
          var width = this.canvas.clientWidth;

          this.renderProgressRing(width);
        } catch (err) {
          // don't fail if we can't render progress
        }
      }
    }, {
      key: 'renderProgressRing',
      value: function renderProgressRing(diameter) {
        var totalTests = this.passes + this.failures;
        var progress = totalTests / this.runner.total * 100 | 0;
        var percent = Math.min(progress, 100);
        var angle = Math.PI * 2 * (percent / 100);
        var halfSize = diameter / 2;
        var rad = halfSize - 1;
        var fontSize = 11;
        var ctx = this.ctx;

        var quarterCircle = 0.5 * Math.PI;

        ctx.font = fontSize + 'px helvetica, arial, sans-serif';

        ctx.clearRect(0, 0, diameter, diameter);

        // outer circle
        ctx.strokeStyle = '#9f9f9f';
        ctx.beginPath();
        ctx.arc(halfSize, halfSize, rad, -quarterCircle, angle - quarterCircle, false);
        ctx.stroke();

        // inner circle
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.arc(halfSize, halfSize, rad - 1, -quarterCircle, angle - quarterCircle, true);
        ctx.stroke();

        // text
        var text = (percent | 0) + '%';
        var textWidth = ctx.measureText(text).width;

        ctx.fillText(text, halfSize - textWidth / 2 + 1, halfSize + fontSize / 2 - 1);
      }
    }, {
      key: 'updateHidePassed',
      value: function updateHidePassed() {
        if (this.$stats.find('#hide-passed').is(':checked')) {
          $('#mocha-report').addClass('hide-passed');
          $('#blanket-main').addClass('hide-passed');
          Url.updateSearchParam('hide_passed', true);
        } else {
          $('#mocha-report').removeClass('hide-passed');
          $('#blanket-main').removeClass('hide-passed');
          Url.updateSearchParam('hide_passed');
        }
      }
    }, {
      key: 'updateCoverageEnabled',
      value: function updateCoverageEnabled() {
        if (this.$stats.find('#enable-coverage').is(':checked')) {
          if (!Url.queryString("coverage")) {
            Url.updateSearchParam("coverage", true);
            Url.updateSearchParam("no_try_catch");
            this.$noTryCatch.attr('checked', false);
            window.location.reload();
          }
        } else {
          if (Url.queryString("coverage")) {
            Url.updateSearchParam("coverage");
            window.location.reload();
          }
        }
      }
    }, {
      key: 'updateNoTryCatch',
      value: function updateNoTryCatch() {
        if (this.$stats.find('#no-try-catch').is(':checked')) {
          if (!Url.queryString("no_try_catch")) {
            Url.updateSearchParam("no_try_catch", true);
            Url.updateSearchParam("coverage");
            this.$coverage.attr('checked', false);
            window.location.reload();
          }
        } else {
          if (Url.queryString("no_try_catch")) {
            Url.updateSearchParam("no_try_catch");
            window.location.reload();
          }
        }
      }
    }, {
      key: 'setMood',
      value: function setMood(mood) {
        this.$stats.removeClass(this.mood);

        this.mood = mood;
        this.$stats.addClass(mood);
        setFavicon(mood);
      }
    }, {
      key: 'onStart',
      value: function onStart() {
        this.startedAt = new Date();
      }
    }, {
      key: 'onEnd',
      value: function onEnd() {
        if (this.mood !== 'sad') {
          this.setMood('happy');
        }

        groupDescribes('JSHint');
        groupDescribes('JSCS');
      }
    }, {
      key: 'onSuite',
      value: function onSuite(suite) {
        if (suite.root) {
          return;
        }

        var title = suite.fullTitle();
        var $fragment = $('<li class="suite"><h1><a></a></h1><ul></ul></li>');

        $fragment.find('a').text(suite.title).attr('href', grepUrl(title));

        this.stack[0].append($fragment);
        this.stack.unshift($fragment.find('ul'));
      }
    }, {
      key: 'onSuiteEnd',
      value: function onSuiteEnd(suite) {
        if (suite.root) {
          return;
        }

        var $ul = this.stack.shift();

        if ($ul.find('.fail').length > 0) {
          $ul.parent().addClass('fail');
        } else {
          $ul.parent().addClass('pass');
        }
      }
    }, {
      key: 'onTestEnd',
      value: function onTestEnd(test) {
        this.updateDuration();

        var $fragment = fragmentForTest(test);

        if (!this.stack[0]) {
          var $report = $('#mocha-report');
          $report.append('<li class="suite"><h1></h1><ul></ul></li>');
          $report.find('h1').text('ORPHAN TESTS');
          this.stack.unshift($report.find('ul'));
        }

        this.stack[0].append($fragment);

        this.updateProgress();
      }
    }, {
      key: 'onPass',
      value: function onPass() {
        this.passes++;
        this.$stats.find('.passes .value').text(this.passes);
      }
    }, {
      key: 'onFail',
      value: function onFail(test, err) {
        this.failures++;
        this.$stats.find('.failures .value').text(this.failures);
        this.setMood('sad');

        test.err = err;
        if (test.type === 'hook') {
          // This is a bizarre misfeature in mocha, but apparently without
          // the reporter feeding this back, you will never hear these
          // hook failures. Things like the testem mocha adapter assume
          // this behavior.
          this.runner.emit('test end', test);
        }
      }
    }, {
      key: 'onBlanketDone',
      value: function onBlanketDone() {
        var $blanket = $('#blanket-main');
        var $title = $blanket.find('.bl-title > .bl-file');

        $title.text('Code Coverage');

        this.updateHidePassed();
      }
    }]);

    return Reporter;
  })();

  exports['default'] = Reporter;

  function grepUrl(pattern) {
    var location = window.location;
    var search = location.search;

    if (search) {
      search = search.replace(/[?&]grep=[^&\s]*/g, '').replace(/^&/, '?');
    }

    var prefix = search ? search + '&' : '?';
    var locationPath = location.pathname;

    var encodedPattern = encodeURIComponent(pattern);

    return '' + locationPath + prefix + 'grep=' + encodedPattern;
  }

  function fragmentForTest(test) {
    var $fragment = $('<li class="test"><h2><span class="title"></h2></li>');

    $fragment.find('h2 .title').text(test.title);
    $fragment.addClass(speedOfTest(test));

    if (test.state === 'passed') {
      $fragment.addClass('pass');

      $fragment.find('h2').append('<span class="duration"></span>');
      $fragment.find('.duration').text(test.duration + 'ms');
    } else if (test.pending) {
      $fragment.addClass('pass').addClass('pending');
    } else {
      $fragment.addClass('fail');

      $fragment.append('<pre class="error"></pre>');
      $fragment.find('.error').text(errorSummaryForTest(test)).append('<div class="dump">Dump stack to console</div>');

      $fragment.find('.dump').on('click', function () {
        return console.info(test.err.stack);
      });
    }

    if (!test.pending) {
      (function () {
        var h2 = $fragment.find('h2');
        h2.append('<a class="replay" title="Replay">‣</a>');
        h2.find('.replay').attr('href', grepUrl(test.fullTitle()));

        var code = $('<pre><code></code></pre>');
        if (test.state === 'passed') {
          code.css('display', 'none');
        }
        code.find('code').text(cleanCode(test.fn.toString()));
        $fragment.append(code);
        h2.on('click', function () {
          return code.toggle();
        });
      })();
    }

    return $fragment;
  }

  function speedOfTest(test) {
    var slow = test.slow();
    var medium = slow / 2;

    if (test.duration > slow) {
      return 'slow';
    } else if (test.duration > medium) {
      return 'medium';
    }

    return 'fast';
  }

  function errorSummaryForTest(test) {
    var summary = test.err.stack || test.err.toString();

    if (summary.indexOf(test.err.message) === -1) {
      summary = test.err.message + '\n' + summary;
    }

    if (summary === '[object Error]') {
      summary = test.err.message;
    }

    if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
      summary += '\n(' + test.err.sourceURL + ':' + test.err.line + ')';
    }

    return summary;
  }

  function cleanCode(code) {
    code = code.replace(/\r\n?|[\n\u2028\u2029]/g, '\n').replace(/^\uFEFF/, '').replace(/^function *\(.*\) *{|\(.*\) *=> *{?/, '').replace(/\s+\}$/, '');

    var spaces = code.match(/^\n?( *)/)[1].length;
    var tabs = code.match(/^\n?(\t*)/)[1].length;
    var count = tabs ? tabs : spaces;
    var ws = tabs ? '\t' : ' ';

    var re = new RegExp('^\n?' + ws + '{' + count + '}', 'gm');

    code = code.replace(re, '');

    return code.trim();
  }

  // Original from <https://gist.github.com/timrwood/7754098>
  function setFavicon(mood) {
    var pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/';
    var redGraphic = pngPrefix + '9hAAAAH0lEQVQ4T2P8z8AAROQDxlEDGEbDgGE0DIBZaBikAwCl1B/x0/RuTAAAAABJRU5ErkJggg==';
    var greenGraphic = pngPrefix + '9hAAAAHklEQVQ4T2Nk+A+EFADGUQMYRsOAYTQMgHloGKQDAJXkH/HZpKBrAAAAAElFTkSuQmCC';

    var uri = mood === 'happy' ? greenGraphic : redGraphic;
    var links = $('link');

    // Remove existing favicons
    links.each(function (idx, link) {
      if (/\bicon\b/i.test(link.getAttribute('rel'))) {
        link.parentNode.removeChild(link);
      }
    });

    // Add new favicon
    var $link = $('<link type="image/x-icon" rel="icon">');
    $link.attr('href', uri);
    $('head').append($link);
  }

  function groupDescribes(linter) {
    var $linter = $('<li class="suite"><h1><a></a></h1><ul></ul></li>');
    $linter.find('a').text(linter).attr('href', grepUrl('{linter}'));

    var $suites = $('.suite:contains("' + linter + '")');

    $suites.each(function (idx, suite) {
      var $suite = $(suite);
      var suiteTitle = $suite.find('h1').text();
      var matches = suiteTitle.match('^' + linter + ' \\| (.*)$');

      if (!matches || !matches.length) {
        return;
      }

      var _matches = _slicedToArray(matches, 2);

      var fileName = _matches[1];

      var $test = $suite.find('.test');

      $test.find('.title').text(fileName);

      $linter.find('ul').append($test);
      $suite.remove();
    });

    if ($linter.find('.test.fail').length > 0) {
      $linter.addClass('fail');
    } else {
      $linter.addClass('pass');
    }

    $('#mocha-report').append($linter);
  }

  // jscs:disable disallowVar
  var template = '<h1 id=\'test-title\'></h1>\n<ul id="mocha-stats">\n  <li class="test-option">\n    <label>\n      <input type="checkbox" id="enable-coverage"> Enable coverage\n    </label>\n  </li>\n  <li class="test-option">\n    <label>\n      <input type="checkbox" id="hide-passed"> Hide passed\n    </label>\n  </li>\n  <li class="test-option">\n    <label>\n      <input type="checkbox" id="no-try-catch"> No try/catch\n    </label>\n  </li>\n  <li class="passes">passes: <em class="value">0</em></li>\n  <li class="failures">failures: <em class="value">0</em></li>\n  <li class="duration">duration: <em class="value">0</em>s</li>\n  <li class="mocha-progress"><canvas width="40" height="40"></canvas></li>\n</ul>\n<ul id="mocha-report"></ul>';
  // jscs:enable disallowVar
});
define('dummy/tests/helpers/reporter.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/reporter.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/reporter.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/helpers/resolver', ['exports', 'dummy/resolver', 'dummy/config/environment'], function (exports, _dummyResolver, _dummyConfigEnvironment) {

  var resolver = _dummyResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _dummyConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _dummyConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('dummy/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/resolver.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/resolver.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/config/environment'], function (exports, _ember, _dummyApp, _dummyConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _dummyConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _dummyApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('dummy/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | helpers/start-app.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('helpers/start-app.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/integration/components/katex-formula-test', ['exports', 'chai', 'ember-mocha'], function (exports, _chai, _emberMocha) {

  (0, _emberMocha.describeComponent)('katex-formula', 'Integration: KatexFormulaComponent', {
    integration: true
  }, function () {

    var formula = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi";

    (0, _emberMocha.it)('empty', function () {
      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.6.0-beta.4',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 17
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['content', 'katex-formula', ['loc', [null, [1, 0], [1, 17]]]]],
          locals: [],
          templates: []
        };
      })()));
      (0, _chai.expect)(this.$('span')).length(0);
    });

    (0, _emberMocha.it)('formula good, then bad', function () {
      var _this = this;

      this.setProperties({
        formula: formula
      });

      this.render(Ember.HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.6.0-beta.4',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 51
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'katex-formula', [], ['formula', ['subexpr', '@mut', [['get', 'formula', ['loc', [null, [1, 24], [1, 31]]]]], [], []], 'throwOnError', true], ['loc', [null, [1, 0], [1, 51]]]]],
          locals: [],
          templates: []
        };
      })()));

      (0, _chai.expect)(this.$('span').length).gt(1);

      (0, _chai.expect)(function () {
        _this.set('formula', "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xix");
      })['throw']();
    });
  });
});
/* jshint expr:true */
define('dummy/tests/integration/components/katex-formula-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/katex-formula-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/katex-formula-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/integration/components/katex-html-test', ['exports', 'ember', 'chai', 'ember-mocha'], function (exports, _ember, _chai, _emberMocha) {
  var htmlSafe = _ember['default'].String.htmlSafe;

  (0, _emberMocha.describeComponent)('katex-html', 'Integration: KatexHtmlComponent', {
    integration: true
  }, function () {
    var m = undefined;

    var goodFormula = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi";
    var goodHtml = '<h2>Start</h2> <div>\\(' + goodFormula + '\\)</div> <h2>End</h2>';
    var goodSafeHtml = htmlSafe(goodHtml);

    var badFormula = "f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xix";
    var badHtml = '<h2>Start</h2> <div>\\(' + badFormula + '\\)</div> <h2>End</h2>';
    var badSafeHtml = htmlSafe(badHtml);

    (0, _emberMocha.it)('empty', function () {
      this.render(_ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'fragmentReason': {
                'name': 'missing-wrapper',
                'problems': ['empty-body']
              },
              'revision': 'Ember@2.6.0-beta.4',
              'loc': {
                'source': null,
                'start': {
                  'line': 1,
                  'column': 0
                },
                'end': {
                  'line': 1,
                  'column': 15
                }
              }
            },
            isEmpty: true,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.6.0-beta.4',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 30
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['block', 'katex-html', [], [], 0, null, ['loc', [null, [1, 0], [1, 30]]]]],
          locals: [],
          templates: [child0]
        };
      })()));
      (0, _chai.expect)(this.$('span')).length(0);
    });

    (0, _emberMocha.it)('goodHtml block', function () {
      this.setProperties({
        html: goodHtml
      });

      this.render(_ember['default'].HTMLBars.template((function () {
        var child0 = (function () {
          return {
            meta: {
              'fragmentReason': {
                'name': 'missing-wrapper',
                'problems': ['wrong-type']
              },
              'revision': 'Ember@2.6.0-beta.4',
              'loc': {
                'source': null,
                'start': {
                  'line': 1,
                  'column': 0
                },
                'end': {
                  'line': 1,
                  'column': 27
                }
              }
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode(' ');
              dom.appendChild(el0, el1);
              var el1 = dom.createComment('');
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(' ');
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createUnsafeMorphAt(fragment, 1, 1, contextualElement);
              return morphs;
            },
            statements: [['content', 'html', ['loc', [null, [1, 16], [1, 26]]]]],
            locals: [],
            templates: []
          };
        })();

        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.6.0-beta.4',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 42
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['block', 'katex-html', [], [], 0, null, ['loc', [null, [1, 0], [1, 42]]]]],
          locals: [],
          templates: [child0]
        };
      })()));

      (0, _chai.expect)(this.$('span').length).gt(1);
    });

    (0, _emberMocha.it)('goodHtml inline', function () {
      this.setProperties({
        safeHtml: goodSafeHtml
      });

      this.render(_ember['default'].HTMLBars.template((function () {
        return {
          meta: {
            'fragmentReason': {
              'name': 'missing-wrapper',
              'problems': ['wrong-type']
            },
            'revision': 'Ember@2.6.0-beta.4',
            'loc': {
              'source': null,
              'start': {
                'line': 1,
                'column': 0
              },
              'end': {
                'line': 1,
                'column': 34
              }
            }
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment('');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [['inline', 'katex-html', [], ['safeHtml', ['subexpr', '@mut', [['get', 'safeHtml', ['loc', [null, [1, 24], [1, 32]]]]], [], []]], ['loc', [null, [1, 0], [1, 34]]]]],
          locals: [],
          templates: []
        };
      })()));

      m = "The formula should be rendered.";
      (0, _chai.expect)(this.$('span').length, m).gt(1);

      this.setProperties({
        safeHtml: badSafeHtml
      });

      m = "The formula should be empty after error.";
      (0, _chai.expect)(this.$('span').length, m).eq(0);
    });
  });
});
/* jshint expr:true */
define('dummy/tests/integration/components/katex-html-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | integration/components/katex-html-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('integration/components/katex-html-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | resolver.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('resolver.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | router.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('router.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/routes/index.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | routes/index.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('routes/index.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/test-helper', ['exports', 'dummy/tests/helpers/resolver', 'ember-mocha', 'dummy/tests/helpers/reporter'], function (exports, _dummyTestsHelpersResolver, _emberMocha, _dummyTestsHelpersReporter) {

  (0, _emberMocha.setResolver)(_dummyTestsHelpersResolver['default']);

  window.mocha.reporter(function (runner) {
    return new _dummyTestsHelpersReporter['default'](runner, window.mocha);
  });

  window.mocha.setup({
    timeout: 10000,
    slow: 2000
  });
});
define('dummy/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | test-helper.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('test-helper.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
define('dummy/tests/unit/utils/katex-test', ['exports', 'chai', 'mocha', 'katex'], function (exports, _chai, _mocha, _katex) {

  (0, _mocha.describe)('katex', function () {
    // Replace this with your real tests.
    (0, _mocha.it)('exists', function () {

      (0, _chai.expect)(_katex['default']).ok;
      (0, _chai.expect)(_katex['default'].render).a('function');
      (0, _chai.expect)(_katex['default'].renderToString).a('function');
    });
  });
});
/* jshint expr:true */

//
define('dummy/tests/unit/utils/katex-test.jshint', ['exports'], function (exports) {
  'use strict';

  describe('JSHint | unit/utils/katex-test.js', function () {
    it('should pass jshint', function () {
      if (!true) {
        var error = new chai.AssertionError('unit/utils/katex-test.js should pass jshint.');
        error.stack = undefined;throw error;
      }
    });
  });
});
/* jshint ignore:start */

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map