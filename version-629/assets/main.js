document.addEventListener('DOMContentLoaded', function () {
  var menu = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (menu && panel) {
    menu.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));

  filterInputs.forEach(function (input) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var noResult = document.querySelector('.no-result');
    var count = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';

    if (q && !input.value) {
      input.value = q;
    }

    function applyFilter() {
      var value = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var match = !value || text.indexOf(value) !== -1;

        card.style.display = match ? '' : 'none';

        if (match) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }

      if (noResult) {
        noResult.classList.toggle('is-visible', visible === 0);
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  });
});
