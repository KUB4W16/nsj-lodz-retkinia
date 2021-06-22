"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

window.addEventListener('load', function () {
  // IE forEach polyfill
  if ('NodeList' in window && !NodeList.prototype.forEach) {
    console.info('polyfill for IE11');

    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;

      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  var modal = document.getElementById('modal');
  var grid = document.querySelector('.grid');
  var iframes = document.querySelectorAll('iframe');
  var printButtons = document.querySelectorAll('#printButton');
  var image = document.querySelector('.article__image');
  var articles = document.querySelectorAll('#article');
  var searchButton = document.getElementById('searchButton');
  var searchModal = document.getElementById('searchModal');
  var searchModalButton = searchModal.querySelector('.search-banner__inner__search-button');
  var searchModalFields = document.forms[0].elements;
  var articleTypes = {
    '/': 'ogloszenia',
    '/ogloszenia/ostatnie': 'ogloszenia',
    '/aktualnosci': 'aktualnosci',
    '/kaplani': 'kaplani',
    '/kancelaria': 'kancelaria',
    '/sakramenty': 'sakramenty',
    '/ministranci': 'ministranci',
    '/informacje': 'informacje',
    '/strony': 'strony',
    '/msze-swiete': 'msze',
    '/galeria': 'galeria',
    '/cmentarz': 'cmentarz',
    '/najswietsze-serce-jezusa': 'nsj',
    '/wspolnoty-parafialne': 'wspolnoty'
  };
  var nodes = {
    sidebarLeft: document.getElementById('sidebarLeft'),
    counter: document.getElementById('counter')
  };
  var modalClasses = {
    sidebarLeft: 'modal__sidebar modal__sidebar--left',
    counter: 'modal__counter'
  };
  var dafaultClasses = {
    sidebarLeft: 'grid__left sidebar sidebar--left',
    counter: 'counter'
  };

  function showModal() {
    modal.style.display = 'grid';

    for (var _i = 0, _Object$entries = Object.entries(nodes); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          node = _Object$entries$_i[1];

      node.setAttribute('class', modalClasses[key]);
      modal.append(node);
    }
  }

  function hideModal() {
    modal.style.display = 'none';

    for (var _i2 = 0, _Object$entries2 = Object.entries(nodes); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          key = _Object$entries2$_i[0],
          node = _Object$entries2$_i[1];

      node.setAttribute('class', dafaultClasses[key]);
      grid.append(node);
    }
  }

  var elements = document.querySelectorAll('#facebook, #youtube, #niedziela, #caritas, #archidiecezja, #address, #mail');
  var links = {
    niedziela: 'https://niezbednik.niedziela.pl/',
    mail: 'mailto:nsjretkinia@archidiecezja.lodz.pl',
    address: 'https://www.google.com/maps/place/Parafia+rzymskokatolicka+pw.+Naj%C5%9Bwi%C4%99tszego+Serca+Jezusowego/@51.7451265,19.4027436,585m/data=!3m1!1e3!4m5!3m4!1s0x0:0x3d0c712b8cf928b8!8m2!3d51.7451349!4d19.4046383',
    facebook: 'https://www.facebook.com/Parafia-Naj%C5%9Bwi%C4%99tszego-Serca-Jezusowego-w-%C5%81odzi-259124130779033/',
    youtube: 'https://www.youtube.com/channel/UCdhcImbqZocrElkRBPPcGRg',
    archidiecezja: 'https://www.archidiecezja.lodz.pl/',
    caritas: '/'
  };
  elements.forEach(function (element) {
    element.addEventListener('click', function () {
      window.open(links[element.id], '_blank');
    });
    return false;
  });

  if (searchButton) {
    searchButton.addEventListener('click', function () {
      gsap.to(searchModal, {
        autoAlpha: 1
      });
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', function (e) {
      if (e.target == searchModal) {
        gsap.to(searchModal, {
          autoAlpha: 0
        });
      }
    });
  }

  if (searchModalButton) {
    searchModalButton.addEventListener('click', function () {
      var query = "?";

      for (var i = 0; i < searchModalFields.length; i++) {
        if (searchModalFields[i].value) {
          query += "".concat(searchModalFields[i].name, "=").concat(searchModalFields[i].value, "&");
        }
      }

      query = query.slice(0, -1);
      console.log(query);
      location.href = "/szukaj".concat(query);
    });
  }

  var menuTrigger = document.getElementById('menuTrigger');
  var closeButton = document.getElementById('closeButton');

  if (window.location.pathname == '/kaplani') {
    document.querySelectorAll('.article__text img').forEach(function (image) {
      var style = "width: 150px; height: auto;";
      image.style = style;
    });
  } else if (window.location.pathname == '/galeria') {
    document.querySelectorAll('.article__text img').forEach(function (image) {
      var style = "width: 200px; height: auto;";
      image.style = style;
    });
    document.querySelector('.article__text').setAttribute('class', 'article__text galery');
    document.querySelectorAll('article a').forEach(function (a) {
      a.href = '/galeria' + a.pathname;
    });
  }

  iframes.forEach(function (iframe) {
    var parent = iframe.parentNode;
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'iframe__wrapper');
    parent.replaceChild(wrapper, iframe);
    wrapper.appendChild(iframe);
  });
  printButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var articleType;

      if (Object.keys(articleTypes).includes(window.location.pathname)) {
        articleType = articleTypes[window.location.pathname];
      } else {
        articleType = 'ogloszenia';
      }

      window.open("/drukuj?artykul=".concat(articleType, "&data=").concat(button.parentNode.querySelector('#articleDate').innerText), '_blank');
    });
  });
  articles.forEach(function (article, i) {
    image.innerHTML += "<div \n            class=\"article__image__inner\">\n            <div class=\"article__image__inner__img\" style=\"background-image: url(".concat(article.dataset.image, ");\"></div>\n            <div class=\"article__image__inner__shadow\" style=\"background-image: url(").concat(article.dataset.image, ");\"></div>\n        </div>");
  });
  var ua = window.navigator.userAgent;
  var isIE = /MSIE|Trident/.test(ua);

  if (isIE) {
    document.querySelectorAll('.article__image__inner__shadow').forEach(function (shdw) {
      shdw.parentNode.removeChild(shdw);
    });
  }

  menuTrigger.addEventListener('click', function () {
    showModal();
  });
  closeButton.addEventListener('click', function () {
    hideModal();
  });
});