document.addEventListener('DOMContentLoaded', function () {
  var video = document.getElementById('moviePlayer');
  var playButton = document.getElementById('playButton');
  var message = document.getElementById('playerMessage');

  if (!video || !playButton) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hasStarted = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function startPlayback() {
    if (!source) {
      setMessage('当前播放源暂不可用。');
      return;
    }

    if (hasStarted) {
      video.play();
      return;
    }

    hasStarted = true;
    playButton.style.display = 'none';
    setMessage('正在加载播放源...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      }, { once: true });
      setMessage('播放源已绑定，可正常播放。');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
        setMessage('播放源已绑定，可正常播放。');
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage('播放加载异常，请刷新页面后重试。');
        }
      });
      return;
    }

    video.src = source;
    video.play();
    setMessage('浏览器正在尝试直接播放该视频源。');
  }

  playButton.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (!hasStarted) {
      startPlayback();
    }
  });
});
