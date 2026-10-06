(function () {
  // Design unit: 1 design px = (viewport width without scrollbar) / 1440, so the layout always spans edge to edge.
  var root = document.documentElement;
  function setVw() { root.style.setProperty('--vw', root.clientWidth + 'px'); }
  setVw();
  if ('ResizeObserver' in window) new ResizeObserver(setVw).observe(root);
  else window.addEventListener('resize', setVw, { passive: true });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.rv, .decor');

  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Line-animation videos start when they scroll into view (they play once, like the original).
  var videos = document.querySelectorAll('video[data-play-in-view]');
  if (videos.length && 'IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var p = e.target.play();
          if (p && p.catch) p.catch(function () {});
          vo.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { vo.observe(v); });
  }
})();
