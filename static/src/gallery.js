window.addEventListener("load", () => {
    const galleryParent = document.getElementById("galleryWrapper");
    const galleryDisplay = document.getElementById("galleryDisplay");
    var imageSources = [];
    images.forEach((link) => {
      galleryParent.innerHTML += `<div class="gallery__item"><img src="${
        link + "=w1920"
      }"/></div>`;
      imageSources.push(link);
    });
    galleryDisplay.src = imageSources[0];
    imageElements = document
      .querySelectorAll(".gallery__item")
      .forEach((image) => {
        image.addEventListener("click", () => {
          galleryDisplay.src = image.childNodes[0].src;
        });
      });
});

