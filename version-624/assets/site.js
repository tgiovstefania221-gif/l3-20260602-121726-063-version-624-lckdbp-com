document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var input = document.querySelector('[data-filter-input]');
  var year = document.querySelector('[data-year-filter]');
  var category = document.querySelector('[data-category-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }
  function applyFilters() {
    var term = normalize(input ? input.value : '');
    var selectedYear = year ? year.value : '';
    var selectedCategory = category ? category.value : '';
    cards.forEach(function (card) {
      var text = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.category,
        card.textContent
      ].join(' '));
      var byTerm = !term || text.indexOf(term) !== -1;
      var byYear = !selectedYear || card.dataset.year === selectedYear;
      var byCategory = !selectedCategory || card.dataset.category === selectedCategory;
      card.classList.toggle('is-hidden', !(byTerm && byYear && byCategory));
    });
  }
  if (input) {
    input.addEventListener('input', applyFilters);
  }
  if (year) {
    year.addEventListener('change', applyFilters);
  }
  if (category) {
    category.addEventListener('change', applyFilters);
  }
});
