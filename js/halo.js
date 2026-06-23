/* VEM — site-wide adaptive crystal cursor halo.
   Self-contained: injects its own styles + a fixed overlay and tracks the cursor
   on every page it's included from. A bright core leads; a larger soft glow
   trails (the "glow trail").

   Adaptive: it samples the surface luminance under the cursor and switches —
     • over DARK surfaces  → a cool WHITE glow that adds light  (mix-blend: screen)
     • over LIGHT surfaces → a soft BLUE halo that tints the page (mix-blend: multiply)
   so it reads on both the navy and the white sections.

   Pointer-only + reduced-motion safe (does nothing on touch or for users who
   opt out of motion). */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;   // no cursor → skip
  // Only ever run in the top-level page. If this file is also loaded inside an
  // embedded iframe (e.g. the process universe on the homepage), skip it there —
  // otherwise the parent's halo and the iframe's halo both render and "double up"
  // at the iframe edge. The parent halo handles the whole viewport instead.
  if (window.self !== window.top) return;

  var css =
    ".vem-halo{position:fixed;inset:0;z-index:49;pointer-events:none;opacity:0;" +
      "transition:opacity .7s cubic-bezier(.16,1,.3,1)}" +
    ".vem-halo.is-on{opacity:1}" +
    ".vem-halo__trail,.vem-halo__core{position:absolute;top:0;left:0;border-radius:50%;will-change:transform}" +
    ".vem-halo__trail{width:520px;height:520px;margin:-260px 0 0 -260px;filter:blur(14px)}" +
    ".vem-halo__core{width:230px;height:230px;margin:-115px 0 0 -115px;filter:blur(6px)}" +
    /* DARK surfaces — cool white glow, adds light */
    ".vem-halo.is-dark{mix-blend-mode:screen}" +
    ".vem-halo.is-dark .vem-halo__trail{background:radial-gradient(circle closest-side," +
      "rgba(148,171,214,.18),rgba(92,124,184,.11) 40%,rgba(52,81,140,.05) 62%,transparent 78%)}" +
    ".vem-halo.is-dark .vem-halo__core{background:radial-gradient(circle closest-side," +
      "rgba(228,240,255,.28),rgba(180,205,240,.15) 38%,rgba(120,150,200,.07) 60%,transparent 75%)}" +
    /* LIGHT surfaces — a crisp, saturated azure halo (tighter + brighter core
       than the dark-mode glow, so multiply reads as a cool crystal tint, not a
       dull shadow). */
    /* On white we want it VERY faint — just a whisper of cool blue, far softer
       than the dark-surface glow (which is the prominent, "cool" one). */
    ".vem-halo.is-light{mix-blend-mode:multiply}" +
    ".vem-halo.is-light .vem-halo__trail{filter:blur(13px);background:radial-gradient(circle closest-side," +
      "rgba(70,120,205,.10),rgba(48,85,170,.06) 44%,rgba(34,60,130,.025) 66%,transparent 82%)}" +
    ".vem-halo.is-light .vem-halo__core{filter:blur(5px);background:radial-gradient(circle closest-side," +
      "rgba(95,150,235,.14),rgba(60,110,205,.08) 38%,rgba(40,80,165,.03) 60%,transparent 78%)}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var halo = document.createElement("div");
  halo.className = "vem-halo is-dark";   // default until first sample
  halo.setAttribute("aria-hidden", "true");
  halo.innerHTML = '<span class="vem-halo__trail"></span><span class="vem-halo__core"></span>';

  /* Walk up from the point to the first opaque-ish background and return its
     relative luminance (0 = black, 1 = white). The halo is pointer-events:none,
     so elementFromPoint returns the real page element beneath it. */
  function surfaceLuminance(x, y) {
    var el = document.elementFromPoint(x, y);
    var guard = 0;
    while (el && guard++ < 12) {
      var bg = window.getComputedStyle(el).backgroundColor;
      var m = bg && bg.match(/rgba?\(([^)]+)\)/);
      if (m) {
        var p = m[1].split(",");
        var a = p[3] === undefined ? 1 : parseFloat(p[3]);
        if (a >= 0.5) {
          var r = parseFloat(p[0]), g = parseFloat(p[1]), b = parseFloat(p[2]);
          return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        }
      }
      el = el.parentElement;
    }
    return 0.05;   // nothing opaque found → assume dark
  }

  function mount() {
    document.body.appendChild(halo);
    var core  = halo.querySelector(".vem-halo__core");
    var trail = halo.querySelector(".vem-halo__trail");
    var hx = 0, hy = 0;       // cursor target (viewport coords)
    var cx = 0, cy = 0;       // core eased position
    var tx = 0, ty = 0;       // trail eased position
    var active = false, raf = null;
    var lastSample = -1e9, isLight = false;

    function render() {
      raf = null;
      cx += (hx - cx) * 0.22;   // core catches up quickly (leads)
      cy += (hy - cy) * 0.22;
      tx += (hx - tx) * 0.10;   // trail lags further behind
      ty += (hy - ty) * 0.10;
      core.style.transform  = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      trail.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
      if (active || Math.abs(hx - tx) > 0.4 || Math.abs(hy - ty) > 0.4) request();
    }
    function request() { if (raf == null) raf = window.requestAnimationFrame(render); }

    window.addEventListener("pointermove", function (e) {
      hx = e.clientX; hy = e.clientY;
      // Over an embedded iframe (the process universe), fade the halo out cleanly
      // instead of leaving it frozen at the boundary. The halo is pointer-events:
      // none, so elementFromPoint returns the real element underneath it.
      var elAt = document.elementFromPoint(hx, hy);
      if (elAt && elAt.tagName === "IFRAME") { if (active) hide(); return; }
      if (!active) {            // first move: snap in so it fades up in place
        cx = tx = hx; cy = ty = hy;
        active = true;
        halo.classList.add("is-on");
      }
      // Sample the surface at most ~10×/sec and flip dark/light when it crosses.
      var now = e.timeStamp || 0;
      if (now - lastSample > 110) {
        lastSample = now;
        var light = surfaceLuminance(hx, hy) > 0.45;
        if (light !== isLight) {
          isLight = light;
          halo.classList.toggle("is-light", light);
          halo.classList.toggle("is-dark", !light);
        }
      }
      request();
    }, { passive: true });

    function hide() { active = false; halo.classList.remove("is-on"); }
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
