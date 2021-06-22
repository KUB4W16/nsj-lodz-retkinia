"use strict";

window.addEventListener('load', function () {
  var galleryParent = document.getElementById('galleryWrapper');
  var galleryDisplay = document.getElementById('galleryDisplay');
  var imageSources = [];
  images.forEach(function (link) {
    galleryParent.innerHTML += "<div class=\"gallery__item\"><img src=\"".concat(link + '=w1920', "\"/></div>");
    imageSources.push(link);
  });
  galleryDisplay.src = imageSources[0];
  var imageElements = document.querySelectorAll('.gallery__item').forEach(function (image) {
    image.addEventListener('click', function () {
      galleryDisplay.src = image.childNodes[0].src;
    });
  });
});