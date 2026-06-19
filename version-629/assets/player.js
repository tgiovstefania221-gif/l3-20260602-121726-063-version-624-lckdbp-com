document.addEventListener('DOMContentLoaded', function () {
  var box = document.querySelector('[data-player]');

  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var trigger = box.querySelector('.play-trigger');
  var source = video ? video.querySelector('source') : null;
  var url = source ? source.getAttribute('src') : '';

  function playVideo() {
    if (!video || !url) {
      return;
    }

    if (trigger) {
      trigger.classList.add('is-hidden');
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__streamReady) {
        var hls = new Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video.__streamReady = true;
        video.__hls = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.play().catch(function () {});
      }
      return;
    }

    video.src = url;
    video.play().catch(function () {});
  }

  if (trigger) {
    trigger.addEventListener('click', playVideo);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
  }
});
