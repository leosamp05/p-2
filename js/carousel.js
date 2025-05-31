document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const btnPrev = document.querySelector(".carousel-btn--prev");
  const btnNext = document.querySelector(".carousel-btn--next");

  // larghezza + margine
  const cardStyle = getComputedStyle(cards[0]);
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseInt(cardStyle.marginRight);

  let index = 0;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    return 3;
  }

  function updateButtons() {
    const perView = getPerView();
    btnPrev.style.visibility = index === 0 ? "hidden" : "visible";
    btnNext.style.visibility =
      index >= cards.length - perView ? "hidden" : "visible";
  }

  function scrollToIndex() {
    const offset = (cardWidth + gap) * index;
    track.scrollTo({ left: offset, behavior: "smooth" });
    updateButtons();
  }

  btnPrev.addEventListener("click", () => {
    if (index > 0) {
      index--;
      scrollToIndex();
    }
  });

  btnNext.addEventListener("click", () => {
    const perView = getPerView();
    if (index < cards.length - perView) {
      index++;
      scrollToIndex();
    }
  });

  window.addEventListener("resize", () => {
    updateButtons();
  });

  // init
  updateButtons();
});
