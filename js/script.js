document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "ef1d584d371d6e149e54d970ae78ed71";
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");
  const catInput = document.querySelector('input[name="Categoria"]');
  const langInput = document.querySelector('input[name="Language"]');
  const resultsEl = document.getElementById("results");
  const cards = Array.from(resultsEl.getElementsByClassName("card"));

  // Mappatura filtro → parametri GNews
  const catMap = {
    Arte: "entertainment",
    Musica: "entertainment",
    Fotografia: "entertainment",
  };
  const langMap = {
    Italiano: "it",
    English: "en",
    Español: "es",
  };

  // Funzione unica che esegue la ricerca
  async function performSearch() {
    const q = input.value.trim();
    if (!q) {
      resultsEl.classList.remove("visible");
      return;
    }

    // leggi filtri
    const topic = catMap[catInput.value.trim()] || "";
    const lang = langMap[langInput.value.trim()] || "";

    // build params
    const params = new URLSearchParams({ q, token: API_KEY, max: 5 });
    if (lang) params.set("lang", lang);
    if (topic) params.set("topic", topic);

    // mostra area risultati
    resultsEl.classList.add("visible");

    try {
      const resp = await fetch(`https://gnews.io/api/v4/search?${params}`);
      const data = await resp.json();
      const items = data.articles || [];

      cards.forEach((card, i) => {
        const art = items[i];
        const ph = card.querySelector(".placeholder");
        const t = card.querySelector(".title");
        const d = card.querySelector(".desc");
        const more = card.querySelector(".more p");

        if (art) {
          ph.innerHTML = art.image
            ? `<img class="preview" src="${art.image}" alt="">`
            : "";
          t.innerHTML = `<a href="${art.url}" target="_blank">${art.title}</a>`;

          const titleWords = art.title.split(/\s+/);
          const shortTitle =
            titleWords.length > 8
              ? titleWords.slice(0, 8).join(" ") + "…"
              : art.title;
          t.innerHTML = `<a href="${art.url}" target="_blank">${shortTitle}</a>`;

          // descrizione: max 15 parole (resta invariato)
          const desc = art.description || "";
          const words = desc.split(/\s+/);
          d.textContent =
            words.length > 15 ? words.slice(0, 15).join(" ") + "…" : desc;

          more.style.visibility = "visible";
        } else {
          ph.innerHTML = "";
          t.textContent = "—";
          d.textContent = "";
          more.style.visibility = "hidden";
        }
      });
    } catch (err) {
      console.error(err);
      cards.forEach((card) => {
        card.querySelector(".placeholder").innerHTML = "";
        card.querySelector(".title").textContent = "Errore";
        card.querySelector(".desc").textContent = "";
        card.querySelector(".more p").style.visibility = "hidden";
      });
    }
  }

  // Evento submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch();
  });

  // Ogni volta che cambio categoria o lingua, rifaccio la ricerca se la query non è vuota
  [catInput, langInput].forEach((el) =>
    el.addEventListener("input", () => {
      if (input.value.trim()) performSearch();
    })
  );

  // All'avvio nascondiamo
  resultsEl.classList.remove("visible");
});

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Apply theme based on system preference
  const applyTheme = (e) => {
    root.setAttribute("data-theme", e.matches ? "dark" : "light");
  };

  // Initial check
  applyTheme(darkModeQuery);

  // Listen for system theme changes
  darkModeQuery.addEventListener("change", applyTheme);
});

document.addEventListener("DOMContentLoaded", () => {
  // Get all required elements
  const track = document.querySelector(".carousel-track");
  const leftBtn = document.querySelector(".carousel-btn--left");
  const rightBtn = document.querySelector(".carousel-btn--right");

  // Check if carousel elements exist before adding logic
  if (track && leftBtn && rightBtn) {
    // Calcola la larghezza di una card + gap
    const cardWidth = () => {
      const card = track.querySelector(".c-card");
      if (!card) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap) || 0;
      return card.offsetWidth + gap;
    };

    // Funzione per lo scroll smooth
    const scrollToCard = (direction) => {
      const scrollAmount = cardWidth();
      if (scrollAmount === 0) return;

      const currentScroll = track.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      track.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });

      requestAnimationFrame(() => updateButtons(targetScroll));
    };

    // Gestione visibilità bottoni
    const updateButtons = (currentScroll) => {
      const { scrollWidth, clientWidth } = track;
      const scrollLeft = currentScroll ?? track.scrollLeft;
      const maxScroll = scrollWidth - clientWidth;

      leftBtn.style.opacity = scrollLeft > 10 ? "1" : "0.5";
      rightBtn.style.opacity = scrollLeft < maxScroll - 10 ? "1" : "0.5";
      track.style.cursor = "grab";
    };

    // Event listeners
    leftBtn.addEventListener("click", () => scrollToCard("left"));
    rightBtn.addEventListener("click", () => scrollToCard("right"));

    // Initialize button states
    updateButtons();
  }
});
