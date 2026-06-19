document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  if (slides.length > 1) {
    var active = 0;
    setInterval(function () {
      slides[active].classList.remove('is-active');
      active = (active + 1) % slides.length;
      slides[active].classList.add('is-active');
    }, 4200);
  }

  var localFilter = document.querySelector('[data-local-filter]');
  if (localFilter) {
    var input = localFilter.querySelector('[data-filter-keyword]');
    var year = localFilter.querySelector('[data-filter-year]');
    var genre = localFilter.querySelector('[data-filter-genre]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    var applyFilter = function () {
      var keyword = (input && input.value || '').trim().toLowerCase();
      var selectedYear = year && year.value || '';
      var selectedGenre = genre && genre.value || '';

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okYear = !selectedYear || (card.getAttribute('data-year') || '') === selectedYear;
        var okGenre = !selectedGenre || (card.getAttribute('data-genre') || '').indexOf(selectedGenre) !== -1;
        card.style.display = okKeyword && okYear && okGenre ? '' : 'none';
      });
    };

    [input, year, genre].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });
  }
});
