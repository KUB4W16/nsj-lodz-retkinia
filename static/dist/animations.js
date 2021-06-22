"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

window.addEventListener('load', function () {
  var el = document.querySelector('.banner');
  var image = document.querySelector('.article__image');
  var articles = document.querySelectorAll('#article');
  gsap.registerPlugin(ScrollTrigger);

  function sleep(ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  sleep(250).then(function () {
    gsap.fromTo(el, {
      autoAlpha: 1
    }, {
      autoAlpha: 0,
      duration: 1
    });
  });

  if (image.children.length == articles.length) {
    for (var i = 0; i < image.children.length; i++) {
      gsap.to(image.children[i], {
        scrollTrigger: {
          toggleActions: 'restart none none reverse',
          toggleClass: {
            targets: image.children[i],
            className: 'active-image'
          },
          trigger: articles[i],
          scroller: '.article__text',
          start: 'top 10%',
          end: 'bottom 7.3%'
        }
      });
    }
  }

  document.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var url = e.target.getAttribute('href');
      gsap.fromTo(el, {
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        duration: 1,
        onComplete: function () {
          var _onComplete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return sleep(250);

                  case 2:
                    location.href = url;

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function onComplete() {
            return _onComplete.apply(this, arguments);
          }

          return onComplete;
        }()
      });
    });
  });
});