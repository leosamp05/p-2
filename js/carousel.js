document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const btnPrev = document.querySelector(".carousel-btn--prev");
  const btnNext = document.querySelector(".carousel-btn--next");

  let index = 0;

  function getCardDimensions() {
    const card = cards[0];
    const cardStyle = getComputedStyle(card);
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseInt(cardStyle.marginRight) || 16;
    return { cardWidth, gap };
  }

  // Calcola quante card stanno effettivamente nella vista (in base a dimensioni reali)
  function getPerView() {
    const { cardWidth, gap } = getCardDimensions();
    const available = track.clientWidth + gap; // È la larghezza interna del container + gap (per tener conto dell’ultimo spazio)
    const per = Math.floor(available / (cardWidth + gap));
    return per > 0 ? per : 1;
  }

  function updateButtons() {
    const perView = getPerView();
    const maxIndex = Math.max(0, cards.length - perView);

    btnPrev.style.opacity = index <= 0 ? "0.5" : "1";
    btnPrev.style.pointerEvents = index <= 0 ? "none" : "auto";

    btnNext.style.opacity = index >= maxIndex ? "0.5" : "1";
    btnNext.style.pointerEvents = index >= maxIndex ? "none" : "auto";
  }

  function scrollToIndex() {
    const { cardWidth, gap } = getCardDimensions();
    const perView = getPerView();
    const maxIndex = Math.max(0, cards.length - perView);

    // “index” non può essere < 0 né > maxIndex
    index = Math.max(0, Math.min(index, maxIndex));

    // calcolo l'offset “di base” per scorrere index
    const rawOffset = index * (cardWidth + gap);
    // scorro massimo fino a (scrollWidth - clientWidth)
    const maxOffset = track.scrollWidth - track.clientWidth;

    let offset;
    if (index < maxIndex) {
      // finche non siamo all’ultimo “indice utile”, uso l’offset ‘raw’
      offset = rawOffset;
    } else {
      // se sono già su maxIndex, calcolo un offset che porti l’ultima card al centro del container
      const lastCard = cards[cards.length - 1];
      const lastCardPosition = lastCard.offsetLeft; // pixel da inizio track a inizio ultima card
      const containerWidth = track.clientWidth;
      const lastCardWidth = lastCard.getBoundingClientRect().width;
      const centeredOffset =
        lastCardPosition - (containerWidth - lastCardWidth) / 2;
      // non devo superare mai maxOffset
      offset = Math.min(centeredOffset, maxOffset);
    }

    track.scrollTo({
      left: offset,
      behavior: "smooth",
    });

    updateButtons();
  }

  function handlePrevClick() {
    if (index > 0) {
      index--;
      scrollToIndex();
    }
  }

  function handleNextClick() {
    const perView = getPerView();
    const maxIndex = Math.max(0, cards.length - perView);
    if (index < maxIndex) {
      index++;
      scrollToIndex();
    }
  }

  // Collegamento bottoni
  btnPrev.addEventListener("click", handlePrevClick);
  btnNext.addEventListener("click", handleNextClick);

  // Navigazione da tastiera
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handlePrevClick();
    if (e.key === "ArrowRight") handleNextClick();
  });

  // Swipe touch
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextClick();
      else handlePrevClick();
    }
  });

  // Quando ridimensioni il browser, aggiorna “index” e scroll
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const perView = getPerView();
      index = Math.min(index, Math.max(0, cards.length - perView));
      scrollToIndex();
    }, 250);
  });

  // Avvio
  updateButtons();
});
