/* VEM — hero interactions: scrolled header, parallax, reduced-motion safe.
   Vanilla JS, no deps. Transform/opacity only (no layout thrash). */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var media  = document.querySelector(".hero__media");
  var hero   = document.querySelector(".hero");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- See-through → translucent navy header on scroll --- */
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }

  /* --- Parallax: video drifts slower than the page while hero is in view --- */
  var ticking = false;
  function applyParallax() {
    ticking = false;
    if (!media || !hero || prefersReduced) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return; // off-screen
    var offset = window.scrollY * 0.35;       // back layer moves at 35%
    media.style.transform = "translate3d(0," + offset + "px,0)";
  }
  function requestParallax() {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  function onScroll() {
    onScrollHeader();
    requestParallax();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", applyParallax, { passive: true });
  onScrollHeader();
  applyParallax();

  /* --- Ensure autoplay actually starts (some browsers need a nudge) --- */
  var video = document.querySelector(".hero__video");
  if (video && !prefersReduced) {
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () { /* poster remains — acceptable fallback */ });
    }
  }

  /* --- Rotating hero headline: crossfade only. The container is LOCKED to a
         fixed height (the tallest slide) and never animates, so rotating the
         headline produces ZERO page movement — no jitter, ever. --- */
  var rotator = document.querySelector("[data-rotator]");
  // Skip the rotation on small screens: headlines wrap to different heights on
  // narrow widths, so we show a single static headline (cleaner, no movement).
  if (rotator && !prefersReduced && window.innerWidth > 760) {
    var slides = Array.prototype.slice.call(rotator.querySelectorAll(".hero__slide"));
    if (slides.length > 1) {
      var idx = 0;
      var lockHeight = function () {
        var max = 0;
        slides.forEach(function (s) { var h = s.offsetHeight; if (h > max) max = h; });
        if (max) rotator.style.minHeight = max + "px";   // fixed to the tallest slide; constant on rotate
      };
      lockHeight();                            // measured while the first slide still defines flow height
      rotator.classList.add("is-enhanced");    // now all slides are absolutely stacked inside the locked box
      // Re-lock once the serif web fonts settle and on resize (height never animates)
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(lockHeight); }
      window.addEventListener("resize", lockHeight, { passive: true });

      window.setInterval(function () {
        slides[idx].classList.remove("is-active");
        slides[idx].setAttribute("aria-hidden", "true");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("is-active");
        slides[idx].removeAttribute("aria-hidden");
        // NOTE: height is intentionally NOT touched here — the box stays fixed.
      }, 7000);
    }
  }

  /* --- Mobile menu toggle (progressive; full menu lands with later sections) --- */
  /* Header nav (dropdowns + mobile menu) lives in js/nav.js */
})();
