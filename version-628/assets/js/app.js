(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input || !input.value.trim()) {
                event.preventDefault();
            }
        });
    });

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        var setSlide = function (index) {
            current = index;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide((current + 1) % slides.length);
            }, 5200);
        }
    }

    var filterBar = document.querySelector("[data-filter-bar]");
    if (filterBar) {
        var keywordInput = filterBar.querySelector("[data-filter-keyword]");
        var yearSelect = filterBar.querySelector("[data-filter-year]");
        var typeSelect = filterBar.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

        var applyFilter = function () {
            var keyword = keywordInput.value.trim().toLowerCase();
            var year = yearSelect.value;
            var type = typeSelect.value;

            cards.forEach(function (card) {
                var title = (card.dataset.title || "").toLowerCase();
                var cardYear = card.dataset.year || "";
                var cardType = card.dataset.type || "";
                var cardRegion = (card.dataset.region || "").toLowerCase();
                var matchKeyword = !keyword || title.indexOf(keyword) > -1 || cardRegion.indexOf(keyword) > -1;
                var matchYear = !year || cardYear === year;
                var matchType = !type || cardType === type;
                card.style.display = matchKeyword && matchYear && matchType ? "" : "none";
            });
        };

        [keywordInput, yearSelect, typeSelect].forEach(function (control) {
            control.addEventListener("input", applyFilter);
            control.addEventListener("change", applyFilter);
        });
    }
}());
