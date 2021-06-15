window.addEventListener("load", () => {
  const el = document.querySelector(".banner");
  const image = document.querySelector(".article__image");
  const articles = document.querySelectorAll("#article");
  gsap.registerPlugin(ScrollTrigger);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sleep(250).then(() => {
    gsap.fromTo(
      el,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        duration: 1,
      }
    );
  });

  if (image.children.length == articles.length) {
    for (var i = 0; i < image.children.length; i++) {
      gsap.to(image.children[i], {
        scrollTrigger: {
          toggleActions: "restart none none reverse",
          toggleClass: {
            targets: image.children[i],
            className: "active-image",
          },
          trigger: articles[i],
          scroller: ".article__text",
          start: "top 10%",
          end: "bottom 7.3%",
        },
      });
    }
  }

  document.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      var url = e.target.getAttribute("href");
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          onComplete: async () => {
            await sleep(250);
            location.href = url;
          },
        }
      );
    });
  });
});