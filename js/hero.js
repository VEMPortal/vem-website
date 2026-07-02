/* VEM — hero interactions: scrolled header, parallax, reduced-motion safe.
   Vanilla JS, no deps. Transform/opacity only (no layout thrash). */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var hero   = document.querySelector(".hero");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- See-through → translucent navy header on scroll ---
     A single classList.toggle isn't layout-forcing, so this stays outside the
     rAF gate (it's cheap, and gating it would delay the header's own CSS
     transition by up to a frame for no benefit). It no longer has a
     backdrop-filter to contend with — that was the actual scroll-judder
     source (see css/hero.css .site-header.is-scrolled), removed separately. */
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  /* --- Hero parallax (cross-browser, INP-safe) ------------------------------
     Two layers move at different speeds for depth: the background drifts down
     up to 55% while the foreground content rises up to 8% as the hero scrolls
     away. Downward-only drift is head-safe by construction: it can only
     REVEAL more of the image's top edge, never hide it (and .hero__media now
     has zero top bleed — all travel room is at the bottom). Driven by
     scrollY only (NEVER getBoundingClientRect — that per-frame layout read is
     what previously hurt Interaction-to-Next-Paint), rAF-batched and passive.
     We drive it in JS rather than CSS `animation-timeline: scroll()` because
     that feature isn't yet universal (Firefox/older Safari would show NO
     parallax at all).

     NOTE: a lerp/easing version of this was tried and reverted — smoothing
     the transform toward scrollY instead of setting it directly trades
     "possible snap on fast scroll" for "guaranteed input lag" (the layer
     visibly dragging a beat behind your scroll on every scroll, since the
     rest of the page has zero-latency native scroll right next to it) — a
     worse trade. The real judder fix was removing `.site-header.is-scrolled`'s
     backdrop-filter (see css/hero.css) — a fixed, blurred element re-sampling
     this actively-moving layer on every frame. Direct, unsmoothed scrollY
     coupling is correct here; do not reintroduce lerp/easing. */
  var hMedia   = document.querySelector(".hero__media");
  var hContent = document.querySelector(".hero__content");
  var pTick = false;
  function applyParallax() {
    pTick = false;
    var vh = window.innerHeight || 1;
    var p = window.scrollY / vh;           // 0..1 across the first viewport
    if (p < 0) p = 0; if (p > 1) p = 1;
    if (hMedia)   hMedia.style.transform   = "translate3d(0," + (p * 55).toFixed(2) + "%,0)";
    if (hContent) hContent.style.transform = "translate3d(0," + (p * -8).toFixed(2) + "%,0)";
  }
  function requestParallax() {
    if (!prefersReduced && !pTick) { window.requestAnimationFrame(applyParallax); pTick = true; }
  }
  function onScroll() {
    onScrollHeader();
    requestParallax();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", requestParallax, { passive: true });
  onScrollHeader();
  if (!prefersReduced) applyParallax();

  /* Cursor halo is now a site-wide effect — see js/halo.js. */

  /* --- Forward-only crossfade loop -------------------------------------
     Two stacked copies of the clip dissolve into each other at the seam, so the
     footage always plays FORWARD (no boomerang rewind) with no visible jump.
     The standby copy starts from frame 0 and fades in on top a moment before the
     visible copy ends; once it's fully in, the old copy pauses and becomes the
     next standby. Reduced-motion users keep the still poster (we never play). */
  var vidA = document.querySelector(".hero__video--a");
  var vidB = document.querySelector(".hero__video--b");
  // Desktop only: on phones (<=760px) the decorative clip costs ~2MB and wrecks
  // mobile LCP for motion almost no one notices, so we keep the still poster.
  if (vidA && vidB && !prefersReduced && window.innerWidth > 760) {
    var FADE = 0.9;                 // seconds of dissolve
    var vis = vidA, hid = vidB;     // vis = visible/playing, hid = standby @ frame 0
    var fading = false;

    vis.style.zIndex = 2; vis.style.opacity = 1;
    hid.style.zIndex = 1; hid.style.opacity = 0;

    function onTick() {
      if (fading) return;
      var d = vis.duration;
      if (!d || isNaN(d) || vis.currentTime < d - FADE) return;
      fading = true;
      hid.currentTime = 0;
      var pr = hid.play(); if (pr && pr.catch) pr.catch(function () {});
      hid.style.zIndex = 2; hid.style.opacity = 1;   // dissolve in on top
      vis.style.zIndex = 1;                          // outgoing drops behind
      window.setTimeout(function () {
        vis.pause();
        vis.style.opacity = 0;        // hide outgoing (already covered → invisible)
        var t = vis; vis = hid; hid = t;             // swap roles
        fading = false;
      }, FADE * 1000);
    }
    vidA.addEventListener("timeupdate", onTick);
    vidB.addEventListener("timeupdate", onTick);

    var p0 = vidA.play(); if (p0 && p0.catch) p0.catch(function () { /* poster stays */ });
  }

  /* (Mobile 3-slide crossfade removed — mobile now shows the same advisor still
     as desktop via a <picture> mobile <source> in index.html.) */

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
