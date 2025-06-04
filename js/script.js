document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "ef1d584d371d6e149e54d970ae78ed71"; // GNews API key
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");

  // Riferimenti per Categoria
  const catInput = document.getElementById("catInput");
  const catList = document.getElementById("catList");
  // Riferimenti per Lingua
  const langInput = document.getElementById("langInput");
  const langList = document.getElementById("langList");

  const resultsEl = document.getElementById("results");
  const cards = Array.from(resultsEl.getElementsByClassName("card"));

  // Array di opzioni (statiche)
  const categories = ["Arte", "Musica", "Fotografia"];
  const languages = ["Italiano", "English", "Español"];

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

  //  FUNZIONE DI AUTOCOMPLETE (mostra/filtra la lista)

  function renderCatList(filterText = "") {
    catList.innerHTML = ""; // svuoto prima di ricreare
    const filtered = categories.filter((item) =>
      item.toLowerCase().includes(filterText.toLowerCase())
    );
    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        catInput.value = item;
        catList.classList.add("hidden");
        // Eseguo subito la ricerca (anche se query vuota)
        performSearch();
      });
      catList.appendChild(li);
    });
    if (filtered.length === 0) {
      catList.classList.add("hidden");
    } else {
      catList.classList.remove("hidden");
    }
  }

  function renderLangList(filterText = "") {
    langList.innerHTML = "";
    const filtered = languages.filter((item) =>
      item.toLowerCase().includes(filterText.toLowerCase())
    );
    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        langInput.value = item;
        langList.classList.add("hidden");
        // Se c'è query o categoria, aggiorno i risultati
        if (input.value.trim() || catInput.value.trim()) {
          performSearch();
        }
      });
      langList.appendChild(li);
    });
    if (filtered.length === 0) {
      langList.classList.add("hidden");
    } else {
      langList.classList.remove("hidden");
    }
  }

  //  FUNZIONE CHE ESEGUE LA RICERCA SU GNEWS

  async function performSearch() {
    const rawQuery = input.value.trim();
    const rawCat = catInput.value.trim();
    const rawLang = langInput.value.trim();

    const topic = catMap[rawCat] || "";
    const lang = langMap[rawLang] || "";

    // Se non ho né query né categoria, nascondo risultati
    if (!rawQuery && !topic) {
      resultsEl.classList.remove("visible");
      return;
    }

    // Se la search è vuota ma ho categoria, la uso come query
    const q = rawQuery || topic;

    // Costruisco i parametri della chiamata GNews
    const params = new URLSearchParams({ q, token: API_KEY, max: 5 });
    if (lang) params.set("lang", lang);
    if (topic) params.set("topic", topic);

    // Mostro l’area dei risultati
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
          // Immagine di anteprima
          ph.innerHTML = art.image
            ? `<img class="preview" src="${art.image}" alt="">`
            : "";

          // Titolo limitato a 8 parole
          const titleWords = art.title.split(/\s+/);
          const shortTitle =
            titleWords.length > 8
              ? titleWords.slice(0, 8).join(" ") + "…"
              : art.title;
          t.innerHTML = `<a href="${art.url}" target="_blank">${shortTitle}</a>`;

          // Descrizione limitata a 15 parole
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

  //  EVENT LISTENER (Autocomplete + Ricerca)

  // 1) Quando l’utente mette a fuoco il campo Categoria
  catInput.addEventListener("focus", () => renderCatList(""));

  // 2) Filtra mentre digita in Categoria
  catInput.addEventListener("input", () => renderCatList(catInput.value));

  // 3) Nasconde la lista se perdo il focus
  catInput.addEventListener("blur", () => {
    setTimeout(() => catList.classList.add("hidden"), 150);
  });

  // 4) Quando l’utente mette a fuoco il campo Lingua
  langInput.addEventListener("focus", () => renderLangList(""));

  // 5) Filtra mentre digita in Lingua
  langInput.addEventListener("input", () => renderLangList(langInput.value));

  // 6) Nascondi la lista se perdo il focus
  langInput.addEventListener("blur", () => {
    setTimeout(() => langList.classList.add("hidden"), 150);
  });

  // 7) Al submit del form di ricerca
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch();
  });

  // All’avvio, nascondi le card dei risultati
  resultsEl.classList.remove("visible");

  //  GESTIONE TEMA SCURO/CHIARO
  const root = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(e) {
    root.setAttribute("data-theme", e.matches ? "dark" : "light");
  }

  applyTheme(darkQuery); // controllo iniziale
  darkQuery.addEventListener("change", applyTheme);

  const contactForm = document.querySelector(".form form"); // Selezioniamo il form correttamente
  const successMessage = document.getElementById("successMessage");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Form submitted");
      successMessage.classList.add("show");
      contactForm.reset();
    });

    const closeBtn = document.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        console.log("Close clicked");
        successMessage.classList.remove("show");
      });
    }

    // Click outside to close
    successMessage.addEventListener("click", (e) => {
      if (e.target === successMessage) {
        successMessage.classList.remove("show");
      }
    });
  }
});
