function setupMoviePlayer(sourceUrl) {
    var container = document.querySelector("[data-player]");
    if (!container) {
        return;
    }

    var video = container.querySelector("video");
    var overlay = container.querySelector(".player-overlay");
    var attached = false;
    var hlsInstance = null;

    var attachSource = function () {
        if (attached || !video) {
            return;
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = sourceUrl;
    };

    var startPlay = function () {
        attachSource();
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
        video.setAttribute("controls", "controls");
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            });
        }
    };

    if (overlay) {
        overlay.addEventListener("click", startPlay);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlay();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
