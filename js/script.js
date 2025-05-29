document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "ef1d584d371d6e149e54d970ae78ed71"; // API key per GNews
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");
  const catInput = document.querySelector('input[name="Categoria"]');
  const langInput = document.querySelector('input[name="Language"]');
  const resultsEl = document.getElementById("results");
  const cards = Array.from(resultsEl.getElementsByClassName("card"));

  // Mappatura filtro → parametri GNews
  const catMap = {
    Arte: "Art",
    Musica: "Music",
    Fotografia: "Photography",
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

    // costruzione parametri URL
    // uso URLSearchParams per gestire i parametri
    const params = new URLSearchParams({ q, token: API_KEY, max: 5 });
    if (lang) params.set("lang", lang);
    if (topic) params.set("topic", topic);

    // mostra area contenente i risultati
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

        //Imposto immagine, titolo e descrizione
        // Se non c'è articolo, mostro un placeholder
        if (art) {
          // Mostra l'immagine se disponibile
          ph.innerHTML = art.image
            ? `<img class="preview" src="${art.image}" alt="">`
            : "";
          t.innerHTML = `<a href="${art.url}" target="_blank">${art.title}</a>`;

          // titolo: max 8 parole
          const titleWords = art.title.split(/\s+/);
          const shortTitle =
            titleWords.length > 8
              ? titleWords.slice(0, 8).join(" ") + "…"
              : art.title;
          t.innerHTML = `<a href="${art.url}" target="_blank">${shortTitle}</a>`;

          // descrizione: max 15 parole
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

  // Evento submit per il form di ricerca
  // previene il comportamento di default e chiama performSearch
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch();
  });

  // Ogni volta che cambio categoria o lingua
  // rifaccio la ricerca se la query non è vuota
  [catInput, langInput].forEach((el) =>
    el.addEventListener("input", () => {
      if (input.value.trim()) performSearch();
    })
  );

  // All'avvio nascondiamo le card dei risultati
  resultsEl.classList.remove("visible");
});

// Gestione del tema scuro/chiaro
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
