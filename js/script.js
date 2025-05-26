document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("query");
  const resultsEl = document.getElementById("results");
  const cards = Array.from(resultsEl.getElementsByClassName("card"));

  // All'avvio: ci assicuriamo che il container sia nascosto
  resultsEl.classList.remove("visible");

  // Se l'utente cancella tutto, nascondi di nuovo
  input.addEventListener("input", () => {
    if (!input.value.trim()) {
      resultsEl.classList.remove("visible");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    resultsEl.classList.add("visible");

    try {
      // 1) search
      const sr = await fetch(
        `https://it.wikipedia.org/w/api.php?` +
          `action=query&list=search&srsearch=${encodeURIComponent(q)}` +
          `&srlimit=3&srprop=snippet&format=json&origin=*`
      );
      const hits = (await sr.json()).query.search;

      // 2) dettaglio thumbnail & extract
      const ids = hits.map((r) => r.pageid).join("|");
      const dt = await fetch(
        `https://it.wikipedia.org/w/api.php?` +
          `action=query&pageids=${ids}` +
          `&prop=pageimages|extracts&exintro&explaintext` +
          `&pilimit=3&format=json&pithumbsize=300&origin=*`
      );
      const pages = (await dt.json()).query.pages;

      // popola le card
      cards.forEach((card, i) => {
        const hit = hits[i];
        const pg = hit ? pages[hit.pageid] : null;
        const ph = card.querySelector(".placeholder");
        const t = card.querySelector(".title");
        const d = card.querySelector(".desc");

        if (hit && pg) {
          if (pg.thumbnail?.source) {
            ph.innerHTML = `<img class="preview" src="${pg.thumbnail.source}" alt="${hit.title}">`;
          } else {
            ph.innerHTML = "";
          }
          t.innerHTML =
            `<a href="https://it.wikipedia.org/?curid=${hit.pageid}" target="_blank">` +
            `${hit.title}</a>`;

          const full = pg.extract || hit.snippet.replace(/<[^>]+>/g, "");
          const words = full.split(/\s+/);
          d.textContent =
            words.length > 15 ? words.slice(0, 15).join(" ") + "…" : full;
        } else {
          ph.innerHTML = "";
          t.textContent = "—";
          d.textContent = "";
        }
      });
    } catch (err) {
      console.error(err);
      cards.forEach((card) => {
        card.querySelector(".placeholder").innerHTML = "";
        card.querySelector(".title").textContent = "Errore";
        card.querySelector(".desc").textContent = "";
      });
    }
  });
});
