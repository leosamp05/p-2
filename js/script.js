const form = document.getElementById("searchForm");
const resultsEl = document.getElementById("results");
const cards = Array.from(resultsEl.getElementsByClassName("card"));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = document.getElementById("query").value.trim();
  if (!q) return;
  // attiva slide-down dei risultati
  resultsEl.classList.add("visible");

  try {
    // Fetch top 3 risultati da Wikipedia (API OpenSearch)
    const resp = await fetch(
      `https://it.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        q
      )}&limit=3&namespace=0&origin=*`
    );
    const data = await resp.json();
    const [term, titles, descs, links] = data;

    // popola le card
    cards.forEach((card, i) => {
      const titleEl = card.querySelector(".title");
      const descEl = card.querySelector(".desc");
      if (titles[i]) {
        titleEl.textContent = titles[i];
        descEl.textContent = descs[i] || "Nessuna descrizione disponibile.";
        // puoi trasformare il titolo in link se vuoi:
        titleEl.innerHTML = `<a href="${links[i]}" target="_blank">${titles[i]}</a>`;
      } else {
        titleEl.textContent = "—";
        descEl.textContent = "";
      }
    });
  } catch (err) {
    console.error(err);
    cards.forEach((card) => {
      card.querySelector(".title").textContent = "Errore nel caricamento";
      card.querySelector(".desc").textContent = "";
    });
  }
});
