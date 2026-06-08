/* VEM — §05 Investment Process: interactive "9,000 → 40" dashboard.
   Stepping through the 5 stages animates a count-up number, a "% of universe"
   pill, a thinning dot-grid, the filter chips, and the stage description.
   Auto-plays once when scrolled into view, then hands control to the user. */
(function () {
  "use strict";

  var dash = document.querySelector("[data-process]");
  if (!dash) return;

  var steps = Array.prototype.slice.call(dash.querySelectorAll(".pstep"));
  if (!steps.length) return;

  var elEyebrow = dash.querySelector(".ppanel__eyebrow");
  var elPill    = dash.querySelector(".ppanel__pill");
  var elBig     = dash.querySelector(".ppanel__big");
  var elCap     = dash.querySelector(".ppanel__cap");
  var elChips   = dash.querySelector(".ppanel__chips");
  var elDesc    = dash.querySelector(".ppanel__desc");
  var grid      = dash.querySelector(".ppanel__grid");

  var TOTAL = 144;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Build the dot grid once */
  var dots = [];
  for (var i = 0; i < TOTAL; i++) {
    var d = document.createElement("span");
    d.className = "pdot";
    grid.appendChild(d);
    dots.push(d);
  }

  var current = -1;
  var lastBig = 0;
  var countRAF = null;
  var auto = null;
  var started = false;

  function fmt(n) { return n.toLocaleString("en-US"); }

  function countTo(to, prefix, suffix, instant) {
    prefix = prefix || ""; suffix = suffix || "";
    if (countRAF) { cancelAnimationFrame(countRAF); countRAF = null; }
    if (instant || reduce) {
      elBig.textContent = prefix + fmt(to) + suffix;
      lastBig = to;
      return;
    }
    var from = lastBig;
    if (from === to) { elBig.textContent = prefix + fmt(to) + suffix; return; }
    var start = null;
    var dur = 750;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      var val = Math.round(from + (to - from) * eased);
      elBig.textContent = prefix + fmt(val) + suffix;
      if (p < 1) { countRAF = requestAnimationFrame(tick); }
      else { lastBig = to; countRAF = null; }
    }
    countRAF = requestAnimationFrame(tick);
  }

  function setDots(lit, instant) {
    for (var i = 0; i < TOTAL; i++) {
      dots[i].style.transitionDelay = (instant || reduce) ? "0ms" : (i * 3) + "ms";
      dots[i].classList.toggle("is-lit", i < lit);
    }
  }

  function renderChips(str) {
    elChips.innerHTML = "";
    str.split("|").forEach(function (c) {
      var li = document.createElement("li");
      li.innerHTML = c; /* may contain &amp; entities already decoded */
      elChips.appendChild(li);
    });
  }

  function activate(idx, instant) {
    if (idx === current) return;
    current = idx;
    var btn = steps[idx];

    steps.forEach(function (s, i) {
      var on = i === idx;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-selected", String(on));
      s.tabIndex = on ? 0 : -1;
    });

    elEyebrow.textContent = btn.dataset.eyebrow;
    elPill.textContent    = btn.dataset.pill;
    elCap.textContent     = btn.dataset.cap;
    elDesc.textContent    = btn.dataset.desc;
    renderChips(btn.dataset.chips);

    dash.classList.toggle("is-live", btn.dataset.live === "1");

    countTo(parseInt(btn.dataset.big, 10), btn.dataset.prefix, btn.dataset.suffix, instant);
    setDots(parseInt(btn.dataset.dots, 10), instant);
  }

  function stopAuto() {
    if (auto) { clearInterval(auto); auto = null; }
    dash.classList.remove("is-autoplay");
  }

  function play() {
    if (started) return;
    started = true;
    dash.classList.add("is-autoplay");
    var i = current; /* usually 0 */
    auto = setInterval(function () {
      i++;
      if (i >= steps.length) { stopAuto(); return; }
      activate(i);
    }, 1600);
  }

  /* User interaction takes over */
  steps.forEach(function (btn, idx) {
    btn.addEventListener("click", function () { stopAuto(); started = true; activate(idx); });
    btn.addEventListener("keydown", function (e) {
      var k = e.key, next = -1;
      if (k === "ArrowDown" || k === "ArrowRight") next = (idx + 1) % steps.length;
      else if (k === "ArrowUp" || k === "ArrowLeft") next = (idx - 1 + steps.length) % steps.length;
      else if (k === "Home") next = 0;
      else if (k === "End") next = steps.length - 1;
      if (next < 0) return;
      e.preventDefault();
      stopAuto(); started = true;
      activate(next);
      steps[next].focus();
    });
  });

  /* Initial state (instant), then auto-play when scrolled into view */
  activate(0, true);

  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); play(); }
      });
    }, { threshold: 0.45 });
    io.observe(dash);
  }
})();
