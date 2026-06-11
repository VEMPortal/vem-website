/* VEM — Interactive Brochure deck controller
   Builds the dot rail, tracks the active slide, drives keyboard / arrow /
   dot navigation, the progress bar, and the per-slide reveal. The deck is a
   native scroll-snap container, so we navigate by scrolling slides into view.

   Slide-enter choreography (each runs once):
   - .bro-funnel slide  -> bands pour gold sequentially, then grains fall;
                           list items and bands highlight each other on hover
   - .count[data-count] -> numbers count up to their final text
   - .frame__node       -> sequential gold ignition along the connector line
   Printing finalizes every animation so the PDF handout is complete. */
(function () {
  "use strict";

  var deck = document.getElementById("deck");
  if (!deck) return;

  var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
  var total = slides.length;
  var rail = document.querySelector(".bro-rail");
  var bar = document.getElementById("broBar");
  var count = document.getElementById("broCount");
  var prevBtn = document.getElementById("broPrev");
  var nextBtn = document.getElementById("broNext");
  var current = 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---- Build the dot rail ---- */
  var dots = slides.map(function (s, i) {
    var b = document.createElement("button");
    b.className = "bro-rail__dot";
    b.type = "button";
    b.setAttribute("data-label", s.getAttribute("data-label") || "Section " + (i + 1));
    b.setAttribute("aria-label", "Go to " + b.getAttribute("data-label"));
    b.addEventListener("click", function () { goTo(i); });
    if (rail) rail.appendChild(b);
    return b;
  });

  function setActive(i) {
    if (i === current) return;
    current = i;
    dots.forEach(function (d, k) {
      d.classList.toggle("is-active", k === i);
      if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    if (bar) bar.style.width = (((i + 1) / total) * 100) + "%";
    if (count) count.textContent = pad(i + 1) + " / " + pad(total);
    if (prevBtn) prevBtn.disabled = (i === 0);
    if (nextBtn) nextBtn.disabled = (i === total - 1);
  }

  function goTo(i) {
    i = Math.max(0, Math.min(total - 1, i));
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* =====================================================================
     Slide-enter choreography
     ===================================================================== */
  var played = new WeakSet();

  /* ---- Funnel pour: bands fill top-to-bottom, then grains fall ---- */
  function pourFunnel(slide) {
    var svg = slide.querySelector(".bro-funnel__svg");
    if (!svg) return;
    var bands = Array.prototype.slice.call(svg.querySelectorAll(".bfunnel-band"));
    var labels = Array.prototype.slice.call(svg.querySelectorAll(".bfunnel-label"));
    bands.forEach(function (b, i) {
      setTimeout(function () {
        b.classList.add("is-poured");
        var lab = labels[i];
        if (lab) lab.classList.add("is-poured");
      }, reduced ? 0 : 240 * i + 250);
    });
    setTimeout(function () { svg.classList.add("grains-on"); },
      reduced ? 0 : 240 * bands.length + 500);
  }

  /* ---- Count-ups: animate 0 -> final text (final text already in HTML,
         so print / no-JS / reduced-motion always show the real values) ---- */
  function runCounts(slide) {
    var els = Array.prototype.slice.call(slide.querySelectorAll(".count[data-count]"));
    els.forEach(function (el, idx) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var finalText = el.textContent; // authoritative final string
      if (!target || reduced) return;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1100, t0 = null, done = false;
      function frame(ts) {
        if (done) return;
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = Math.round(target * eased);
        el.textContent = prefix + v.toLocaleString("en-US") + suffix;
        if (p < 1) { requestAnimationFrame(frame); }
        else { done = true; el.textContent = finalText; }
      }
      setTimeout(function () { requestAnimationFrame(frame); }, 350 + idx * 140);
      // Frozen-rAF fallback: guarantee the final text lands
      setTimeout(function () { if (!done) { done = true; el.textContent = finalText; } }, 3200 + idx * 140);
    });
  }

  /* ---- Framework ignition: nodes light gold left-to-right ---- */
  function igniteFrame(slide) {
    var nodes = Array.prototype.slice.call(slide.querySelectorAll(".frame__node"));
    nodes.forEach(function (n, i) {
      setTimeout(function () { n.classList.add("is-lit"); },
        reduced ? 0 : 380 + 260 * i);
    });
  }

  function playSlide(slide) {
    if (played.has(slide)) return;
    played.add(slide);
    pourFunnel(slide);
    runCounts(slide);
    igniteFrame(slide);
  }

  /* ---- Funnel hover sync: band <-> lineup item (shared data-k) ---- */
  (function bindFunnelSync() {
    var pairs = {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-k]"), function (el) {
      var k = el.getAttribute("data-k");
      (pairs[k] = pairs[k] || []).push(el);
    });
    Object.keys(pairs).forEach(function (k) {
      pairs[k].forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          pairs[k].forEach(function (other) { other.classList.add("is-hot"); });
        });
        el.addEventListener("mouseleave", function () {
          pairs[k].forEach(function (other) { other.classList.remove("is-hot"); });
        });
      });
    });
  })();

  /* ---- Track which slide is in view + reveal + choreograph ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        playSlide(e.target);
        setActive(slides.indexOf(e.target));
      }
    });
  }, { root: deck, threshold: 0.55 });
  slides.forEach(function (s) { io.observe(s); });
  // First slide visible immediately
  slides[0].classList.add("is-in");
  playSlide(slides[0]);
  setActive(0);

  /* ---- Print: finalize every animation so the PDF is complete ---- */
  function finalizeForPrint() {
    slides.forEach(function (s) {
      s.classList.add("is-in");
      played.add(s); // suppress re-animation
      Array.prototype.forEach.call(s.querySelectorAll(".bfunnel-band, .bfunnel-label"), function (el) {
        el.classList.add("is-poured");
      });
      Array.prototype.forEach.call(s.querySelectorAll(".frame__node"), function (el) {
        el.classList.add("is-lit");
      });
    });
  }
  window.addEventListener("beforeprint", finalizeForPrint);

  /* ---- Arrow buttons ---- */
  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  /* ---- Keyboard ---- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowDown": case "ArrowRight": case "PageDown":
        e.preventDefault(); goTo(current + 1); break;
      case " ": // space advances (shift+space goes back)
        e.preventDefault(); goTo(current + (e.shiftKey ? -1 : 1)); break;
      case "ArrowUp": case "ArrowLeft": case "PageUp":
        e.preventDefault(); goTo(current - 1); break;
      case "Home": e.preventDefault(); goTo(0); break;
      case "End": e.preventDefault(); goTo(total - 1); break;
    }
  });
})();
