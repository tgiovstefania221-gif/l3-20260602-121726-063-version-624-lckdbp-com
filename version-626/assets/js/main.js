(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slides = selectAll('[data-hero-slide]');
    var dots = selectAll('[data-hero-dot]');
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function reset() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        reset();
      });
    });
    start();
  }

  function setupSearchPage() {
    var root = document.querySelector('[data-search-page]');
    if (!root || !window.movieIndex) {
      return;
    }
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var count = document.getElementById('searchCount');
    var chips = selectAll('[data-search-category]');
    var activeCategory = '';
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;

    function textMatch(movie, query) {
      if (!query) {
        return true;
      }
      var haystack = [
        movie.title,
        movie.description,
        movie.category,
        movie.genre,
        movie.region,
        movie.year,
        movie.tags.join(' ')
      ].join(' ').toLowerCase();
      return haystack.indexOf(query.toLowerCase()) !== -1;
    }

    function render() {
      var query = input.value.trim();
      var items = window.movieIndex.filter(function (movie) {
        var categoryOk = !activeCategory || movie.category === activeCategory;
        return categoryOk && textMatch(movie, query);
      }).slice(0, 80);
      count.textContent = items.length.toString();
      if (!items.length) {
        results.innerHTML = '<div class="empty-state">没有找到匹配的影片，请换一个关键词继续浏览。</div>';
        return;
      }
      results.innerHTML = items.map(function (movie) {
        return [
          '<a class="search-result-card" href="' + movie.url + '">',
          '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
          '<div class="search-result-body">',
          '<h3>' + escapeHtml(movie.title) + '</h3>',
          '<p>' + escapeHtml(movie.description) + '</p>',
          '<div class="meta-row">',
          '<span>' + escapeHtml(movie.category) + '</span>',
          '<span>' + escapeHtml(movie.year) + '</span>',
          '<span>' + escapeHtml(movie.region) + '</span>',
          '<span>' + escapeHtml(movie.genre) + '</span>',
          '</div>',
          '</div>',
          '</a>'
        ].join('');
      }).join('');
    }

    input.addEventListener('input', render);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.getAttribute('data-search-category') || '';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        render();
      });
    });
    render();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.setupMoviePlayer = function (videoId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !sourceUrl) {
      return;
    }
    var ready = false;
    var hls = null;

    function loadSource() {
      if (ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      ready = true;
    }

    function startPlayback() {
      loadSource();
      button.classList.add('is-hidden');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        startPlayback();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupSearchPage();
  });
})();
