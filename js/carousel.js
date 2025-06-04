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

  // Calcola dinamicamente quante card entrano nella vista attuale
  function getPerView() {
    const { cardWidth, gap } = getCardDimensions();
    // Aggiungo gap per considerare lo spazio finale
    const available = track.clientWidth + gap;
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

    // Clamp index tra 0 e maxIndex
    index = Math.max(0, Math.min(index, maxIndex));

    // Calcolo offset raw
    const rawOffset = index * (cardWidth + gap);
    // Massimo offset per vedere l’ultima card
    const maxOffset = track.scrollWidth - track.clientWidth;
    // Clampo rawOffset per non superare maxOffset
    const offset = Math.min(rawOffset, maxOffset);

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

  // Event Listeners
  btnPrev.addEventListener("click", handlePrevClick);
  btnNext.addEventListener("click", handleNextClick);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handlePrevClick();
    if (e.key === "ArrowRight") handleNextClick();
  });

  // Touch events
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

  // Resize handling
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const perView = getPerView();
      index = Math.min(index, Math.max(0, cards.length - perView));
      scrollToIndex();
    }, 250);
  });

  // Setup iniziale
  updateButtons();
});
