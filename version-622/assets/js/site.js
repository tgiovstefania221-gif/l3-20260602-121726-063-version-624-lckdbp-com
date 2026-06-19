(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = $('.menu-toggle');
  var mobilePanel = $('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = $('.hero');
    if (!hero) return;
    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dot', hero);
    var prev = $('.hero-prev', hero);
    var next = $('.hero-next', hero);
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var scopes = $all('.filter-scope');
    if (!scopes.length) return;
    var input = $('.page-search');
    var type = $('.type-filter');
    var year = $('.year-filter');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input && query) input.value = query;

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var t = type ? type.value : '';
      var y = year ? year.value : '';
      scopes.forEach(function (scope) {
        $all('.movie-card', scope).forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' ').toLowerCase();
          var ok = (!q || haystack.indexOf(q) !== -1) && (!t || haystack.indexOf(t.toLowerCase()) !== -1) && (!y || haystack.indexOf(y) !== -1);
          card.classList.toggle('hidden-by-filter', !ok);
        });
      });
    }

    [input, type, year].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
    apply();
  }

  window.initMoviePlayer = function (videoId, buttonId, src) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !src) return;
    var ready = false;

    function load() {
      if (!ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        ready = true;
      }
      button.classList.add('hidden');
      video.play().catch(function () {});
    }

    button.addEventListener('click', load);
    video.addEventListener('click', function () {
      if (video.paused) {
        load();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupHero();
    setupFilters();
  });
})();
