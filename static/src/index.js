window.addEventListener('load', () => {
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
  const modal = document.getElementById('modal');
  const grid = document.querySelector('.grid');
  const iframes = document.querySelectorAll('iframe');
  const printButtons = document.querySelectorAll('#printButton');
  const image = document.querySelector('.article__image');
  const articles = document.querySelectorAll('#article');
  const searchButton = document.getElementById('searchButton');
  const searchModal = document.getElementById('searchModal');
  const searchModalButton = searchModal.querySelector(
    '.search-modal__inner__search-button'
  );
  const searchModalFields = document.forms[0].elements;

  const articleTypes = {
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
    '/wspolnoty-parafialne': 'wspolnoty',
  };

  const nodes = {
    sidebarLeft: document.getElementById('sidebarLeft'),
    counter: document.getElementById('counter'),
  };
  const modalClasses = {
    sidebarLeft: 'modal__sidebar modal__sidebar--left',
    counter: 'modal__counter',
  };
  const dafaultClasses = {
    sidebarLeft: 'grid__left sidebar sidebar--left',
    counter: 'counter',
  };

  function showModal() {
    modal.style.display = 'grid';
    for (const [key, node] of Object.entries(nodes)) {
      node.setAttribute('class', modalClasses[key]);
      modal.append(node);
    }
  }
  function hideModal() {
    modal.style.display = 'none';
    for (const [key, node] of Object.entries(nodes)) {
      node.setAttribute('class', dafaultClasses[key]);
      grid.append(node);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const elements = document.querySelectorAll(
    '#facebook, #youtube, #niedziela, #caritas, #archidiecezja, #address, #mail'
  );
  const links = {
    niedziela: 'https://niezbednik.niedziela.pl/',
    mail: 'mailto:nsjretkinia@archidiecezja.lodz.pl',
    address:
      'https://www.google.com/maps/place/Parafia+rzymskokatolicka+pw.+Naj%C5%9Bwi%C4%99tszego+Serca+Jezusowego/@51.7451265,19.4027436,585m/data=!3m1!1e3!4m5!3m4!1s0x0:0x3d0c712b8cf928b8!8m2!3d51.7451349!4d19.4046383',
    facebook:
      'https://www.facebook.com/Parafia-Naj%C5%9Bwi%C4%99tszego-Serca-Jezusowego-w-%C5%81odzi-259124130779033/',
    youtube: 'https://www.youtube.com/channel/UCdhcImbqZocrElkRBPPcGRg',
    archidiecezja: 'https://www.archidiecezja.lodz.pl/',
    caritas: '/',
  };

  elements.forEach((element) => {
    element.addEventListener('click', () => {
      window.open(links[element.id], '_blank');
    });
    return false;
  });

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      gsap.to(searchModal, { autoAlpha: 1 });
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target == searchModal) {
        gsap.to(searchModal, { autoAlpha: 0 });
      }
    });
  }

  if (searchModalButton) {
    const banner = document.querySelector('.banner');
    searchModalButton.addEventListener('click', () => {
      var query = `?`;
      for (var i = 0; i < searchModalFields.length; i++) {
        if (searchModalFields[i].value) {
          query += `${searchModalFields[i].name}=${searchModalFields[i].value}&`;
        }
      }
      query = query.slice(0, -1);
      gsap.to(searchModal, { autoAlpha: 0 });
      gsap.fromTo(
        banner,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          onComplete: async () => {
            await sleep(250);
            location.href = `/szukaj${query}`;
          },
        }
      );
    });
  }

  var menuTrigger = document.getElementById('menuTrigger');
  var closeButton = document.getElementById('closeButton');

  if (window.location.pathname == '/kaplani') {
    document.querySelectorAll('.article__text img').forEach((image) => {
      var style = `width: 150px; height: auto;`;
      image.style = style;
    });
  } else if (window.location.pathname == '/galeria') {
    document.querySelectorAll('.article__text img').forEach((image) => {
      var style = `width: 200px; height: auto;`;
      image.style = style;
    });
    document
      .querySelector('.article__text')
      .setAttribute('class', 'article__text galery');
    document.querySelectorAll('article a').forEach((a) => {
      a.href = '/galeria' + a.pathname;
    });
  }

  iframes.forEach((iframe) => {
    var parent = iframe.parentNode;
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'iframe__wrapper');
    parent.replaceChild(wrapper, iframe);
    wrapper.appendChild(iframe);
  });

  printButtons.forEach((button) => {
    button.addEventListener('click', () => {
      var articleType;
      if (Object.keys(articleTypes).includes(window.location.pathname)) {
        articleType = articleTypes[window.location.pathname];
      } else {
        articleType = 'ogloszenia';
      }
      window.open(
        `/drukuj?artykul=${articleType}&data=${
          button.parentNode.querySelector('#articleDate').innerText
        }`,
        '_blank'
      );
    });
  });

  articles.forEach((article, i) => {
    image.innerHTML += `<div 
            class="article__image__inner">
            <div class="article__image__inner__img" style="background-image: url(${article.dataset.image});"></div>
        </div>`;
  });

  menuTrigger.addEventListener('click', () => {
    showModal();
  });
  closeButton.addEventListener('click', () => {
    hideModal();
  });
});
