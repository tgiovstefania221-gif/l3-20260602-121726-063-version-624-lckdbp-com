(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".nav-links");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function filterCards(input) {
    var list = document.querySelector(".searchable-list");
    if (!input || !list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

    function applyFilter() {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-filtered-out", query && text.indexOf(query) === -1);
      });
    }

    input.addEventListener("input", applyFilter);
    applyFilter();
  }

  function setupSearch() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var input = document.querySelector(".js-page-search");
    var button = document.getElementById("global-search-button");
    if (input && query) {
      input.value = query;
    }
    filterCards(input);
    if (button && input) {
      button.addEventListener("click", function () {
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }
  }

  function mountPlayer(streamUrl) {
    ready(function () {
      var video = document.getElementById("player-video");
      var cover = document.querySelector(".play-cover");
      var hlsInstance = null;
      if (!video || !streamUrl) {
        return;
      }

      function attachStream() {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          return;
        }
        video.src = streamUrl;
      }

      function startPlayback() {
        if (cover) {
          cover.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      attachStream();

      if (cover) {
        cover.addEventListener("click", startPlayback);
      }

      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });

      video.addEventListener("click", function () {
        if (video.paused) {
          startPlayback();
        } else {
          video.pause();
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });

  window.MovieApp = {
    mountPlayer: mountPlayer
  };
})();
