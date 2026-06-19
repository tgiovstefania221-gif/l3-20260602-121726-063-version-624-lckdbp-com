(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  const filterForm = document.querySelector("[data-filter]");
  if (!filterForm) {
    return;
  }

  const cards = Array.from(document.querySelectorAll("[data-title]"));
  const empty = document.querySelector("[data-empty]");
  const queryInput = filterForm.querySelector("[name='q']");
  const params = new URLSearchParams(window.location.search);

  if (queryInput && params.get("q")) {
    queryInput.value = params.get("q");
  }

  function includesText(source, value) {
    return String(source || "").toLowerCase().includes(String(value || "").toLowerCase());
  }

  function applyFilters() {
    const formData = new FormData(filterForm);
    const query = String(formData.get("q") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const region = String(formData.get("region") || "").trim();
    const type = String(formData.get("type") || "").trim();
    const year = String(formData.get("year") || "").trim();
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = [
        card.dataset.title,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.region,
        card.dataset.type,
        card.dataset.category,
        card.dataset.year
      ].join(" ");
      const matched =
        (!query || includesText(haystack, query)) &&
        (!category || card.dataset.category === category) &&
        (!region || includesText(card.dataset.region, region)) &&
        (!type || card.dataset.type === type) &&
        (!year || card.dataset.year === year);

      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  filterForm.addEventListener("input", applyFilters);
  filterForm.addEventListener("change", applyFilters);
  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilters();
  });
  applyFilters();
})();
