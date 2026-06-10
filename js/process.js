/* VEM — §05 Investment Process: narrowing funnel + stage accordion.
   The funnel pours downward (band by band) once the section scrolls into
   view; each band's figure counts up as it fills. A slow stream of particles
   falls through the silhouette — many enter, few survive — and the trickle
   that reaches the tip visualizes "continuous review". Clicking a stage
   expands its explanation and highlights the matching funnel band. */
(function () {
  "use strict";

  var root = document.querySelector("[data-process]");
  if (!root) return;

  var bands  = Array.prototype.slice.call(root.querySelectorAll(".pband-g"));
  var stages = Array.prototype.slice.call(root.querySelectorAll(".pstage"));
  if (!bands.length || !stages.length) return;

  var svg    = root.querySelector(".pfunnel__svg");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var maxFilled = -1;

  /* ---------- Count-up labels ---------- */
  /* target number, prefix/suffix to wrap the final formatted value */
  var COUNTS = [
    { to: 9000, prefix: "",  suffix: "+", final: null },
    { to: 1000, prefix: "≈ ", suffix: "", final: null },
    { to: 250,  prefix: "",  suffix: "", final: "150–250" },
    { to: 60,   prefix: "",  suffix: "", final: "40–60" },
    null /* tip band has no in-band label */
  ];

  function fmt(n) { return n.toLocaleString("en-US"); }

  function countUp(i) {
    var spec = COUNTS[i];
    if (!spec) return;
    var label = bands[i].querySelector(".pband-label");
    if (!label) return;
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      label.textContent = spec.final || (spec.prefix + fmt(spec.to) + spec.suffix);
    }
    if (reduce) { finish(); return; }
    var start = null, dur = 620;
    function tick(ts) {
      if (done) return;
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      label.textContent = spec.prefix + fmt(Math.round(spec.to * eased)) + spec.suffix;
      if (p < 1) { requestAnimationFrame(tick); } else { finish(); }
    }
    requestAnimationFrame(tick);
    /* rAF can be frozen in hidden/background tabs — guarantee the number */
    setTimeout(finish, dur + 400);
  }

  /* Pour the funnel down to (and including) band n; never un-pours. */
  function fillTo(n) {
    for (var i = 0; i <= n && i < bands.length; i++) {
      if (!bands[i].classList.contains("is-filled")) {
        bands[i].classList.add("is-filled");
        countUp(i);
      }
    }
    if (n > maxFilled) maxFilled = n;
  }

  function setActiveBand(k) {
    bands.forEach(function (b, i) { b.classList.toggle("is-active", i === k); });
  }

  function openStage(k) {
    stages.forEach(function (s, i) {
      var on = i === k;
      s.classList.toggle("is-open", on);
      s.querySelector(".pstage__head").setAttribute("aria-expanded", String(on));
    });
    setActiveBand(k);
    fillTo(k);
  }

  function closeStage(s) {
    s.classList.remove("is-open");
    s.querySelector(".pstage__head").setAttribute("aria-expanded", "false");
  }

  function openIndex() {
    for (var i = 0; i < stages.length; i++) {
      if (stages[i].classList.contains("is-open")) return i;
    }
    return -1;
  }

  stages.forEach(function (s, k) {
    var head = s.querySelector(".pstage__head");
    head.addEventListener("click", function () {
      if (s.classList.contains("is-open")) {
        closeStage(s);              /* allow collapsing the open one */
        setActiveBand(-1);
      } else {
        openStage(k);
      }
    });
    /* Hovering a stage previews its band; leaving restores the open one */
    s.addEventListener("mouseenter", function () { setActiveBand(k); });
    s.addEventListener("mouseleave", function () { setActiveBand(openIndex()); });
  });

  /* Initial paint: stage 0 open, its band highlighted (poured on scroll). */
  setActiveBand(0);

  /* Blank the countable labels until the pour reveals them. */
  if (!reduce) {
    COUNTS.forEach(function (spec, i) {
      if (!spec) return;
      var label = bands[i].querySelector(".pband-label");
      if (label) label.textContent = "";
    });
  }

  function pour() {
    var i = 0;
    fillTo(0);
    var t = setInterval(function () {
      i++;
      if (i >= bands.length) { clearInterval(t); return; }
      fillTo(i);
    }, 430);
  }

  /* ---------- Falling particles ----------
     Funnel half-width by y (piecewise linear through the band edges).
     Particles fall from the rim; a share dies at each band boundary, so the
     stream visibly thins from a crowd at the top to a trickle at the tip. */
  var EDGES = [[0, 172], [68, 128], [147, 89], [226, 58], [305, 39], [384, 34]];
  var CULL_Y = [68, 147, 226, 305];       /* boundaries where names drop out */
  var SURVIVE = [0.42, 0.38, 0.34, 0.55]; /* share that advances per boundary */
  var CX = 180, BOTTOM = 384;

  function halfW(y) {
    for (var i = 1; i < EDGES.length; i++) {
      if (y <= EDGES[i][0]) {
        var a = EDGES[i - 1], b = EDGES[i];
        var p = (y - a[0]) / (b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * p;
      }
    }
    return EDGES[EDGES.length - 1][1];
  }

  var particles = [];
  var particlesOn = false;
  var rafId = null;

  function makeParticle(group, randomY) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    el.setAttribute("r", (1.4 + Math.random() * 1.1).toFixed(2));
    el.setAttribute("class", "pgrain");
    group.appendChild(el);
    var p = { el: el, y: 0, lane: 0, speed: 0, alive: true, nextCull: 0 };
    resetParticle(p, randomY);
    return p;
  }

  function resetParticle(p, randomY) {
    p.y = randomY ? Math.random() * BOTTOM : -4 - Math.random() * 60;
    p.lane = (Math.random() * 2 - 1) * 0.92;   /* -1..1 across the width */
    p.speed = 0.22 + Math.random() * 0.3;      /* px per frame at 60fps */
    p.alive = true;
    p.nextCull = 0;
    while (p.nextCull < CULL_Y.length && p.y > CULL_Y[p.nextCull]) p.nextCull++;
    p.el.setAttribute("opacity", "0");
  }

  function stepParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y += p.speed;
      if (p.nextCull < CULL_Y.length && p.y >= CULL_Y[p.nextCull]) {
        if (Math.random() > SURVIVE[p.nextCull]) p.alive = false;
        p.nextCull++;
      }
      if (!p.alive || p.y > BOTTOM + 4) { resetParticle(p); continue; }
      var x = CX + p.lane * (halfW(p.y) - 7);
      var fadeIn = Math.min(1, (p.y + 4) / 26);
      p.el.setAttribute("opacity", (0.5 * fadeIn).toFixed(2));
      p.el.setAttribute("cx", x.toFixed(1));
      p.el.setAttribute("cy", p.y.toFixed(1));
    }
    if (particlesOn) rafId = requestAnimationFrame(stepParticles);
  }

  function startParticles() {
    if (particlesOn || reduce || !svg) return;
    if (!particles.length) {
      var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("aria-hidden", "true");
      /* insert beneath the band shapes so dots pass behind the labels */
      svg.insertBefore(group, svg.firstChild);
      for (var i = 0; i < 26; i++) particles.push(makeParticle(group, true));
    }
    particlesOn = true;
    rafId = requestAnimationFrame(stepParticles);
  }

  function stopParticles() {
    particlesOn = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* Pour once on scroll-in; run particles only while the section is visible. */
  if (reduce) {
    fillTo(bands.length - 1);
  } else if ("IntersectionObserver" in window) {
    var poured = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (!poured) { poured = true; pour(); }
          startParticles();
        } else {
          stopParticles();
        }
      });
    }, { threshold: 0.25 });
    io.observe(root);
  } else {
    pour();
    startParticles();
  }
})();
