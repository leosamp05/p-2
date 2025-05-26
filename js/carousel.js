document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const btnPrev = document.querySelector(".carousel-btn--prev");
  const btnNext = document.querySelector(".carousel-btn--next");

  // larghezza + margine (solo la prima volta)
  const cardStyle = getComputedStyle(cards[0]);
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseInt(cardStyle.marginRight);

  // Indice corrente (0 = prima card in vista)
  let index = 0;

  function updateButtons() {
    // quante card posso mostrare alla volta?
    const perView = window.innerWidth <= 768 ? 1 : 3;
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
    const perView = window.innerWidth <= 768 ? 1 : 3;
    if (index < cards.length - perView) {
      index++;
      scrollToIndex();
    }
  });

  // Al resize ricaccola e aggiorna i bottoni
  window.addEventListener("resize", () => {
    // ricalcola cardWidth se cambia layout
    const w = cards[0].getBoundingClientRect().width;
    if (w !== cardWidth) {
      // (opzionale) potresti aggiornare `cardWidth` qui
    }
    updateButtons();
  });

  // init
  updateButtons();
});
