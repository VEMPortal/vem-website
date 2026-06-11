/* VEM — Interactive Brochure v3 deck controller (horizontal)
   - Horizontal scroll-snap deck: wheel, keys, edge arrows, dots, swipe
   - Process Orbit: canvas particle scene (universe -> portfolio) on a
     3D-tilted plane that follows the pointer; rings/labels open stages
   - data-expand accordions, model flip cards, funnel pour + hover sync
   - beforeprint finalizes every animation for the PDF handout */
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

  /* ---- Dot rail ---- */
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
    deck.scrollTo({ left: i * deck.clientWidth, behavior: reduced ? "auto" : "smooth" });
    activate(i); /* drive choreography from intent — never wait on scroll events */
  }

  /* ---- Wheel -> horizontal advance (one slide per gesture) ---- */
  var wheelLock = false;
  deck.addEventListener("wheel", function (e) {
    var d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 12) return;
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    goTo(current + (d > 0 ? 1 : -1));
    setTimeout(function () { wheelLock = false; }, 650);
  }, { passive: false });

  /* ---- Edge arrows ---- */
  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

  /* ---- Keyboard ---- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown":
        e.preventDefault(); goTo(current + 1); break;
      case " ":
        e.preventDefault(); goTo(current + (e.shiftKey ? -1 : 1)); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp":
        e.preventDefault(); goTo(current - 1); break;
      case "Home": e.preventDefault(); goTo(0); break;
      case "End": e.preventDefault(); goTo(total - 1); break;
    }
  });

  /* =====================================================================
     Generic interactivity
     ===================================================================== */

  /* data-expand accordions (cards, diff rows, funnel items, note toggles) */
  Array.prototype.forEach.call(document.querySelectorAll("[data-expand]"), function (el) {
    el.addEventListener("click", function () {
      var open = el.getAttribute("aria-expanded") === "true";
      el.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* model flip cards */
  Array.prototype.forEach.call(document.querySelectorAll(".model[data-flip]"), function (el) {
    el.addEventListener("click", function () {
      var flipped = el.classList.toggle("is-flipped");
      el.setAttribute("aria-pressed", flipped ? "true" : "false");
    });
  });

  /* funnel hover sync: band <-> lineup item (shared data-k) */
  (function bindFunnelSync() {
    var pairs = {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-k]"), function (el) {
      var k = el.getAttribute("data-k");
      (pairs[k] = pairs[k] || []).push(el);
    });
    Object.keys(pairs).forEach(function (k) {
      pairs[k].forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          pairs[k].forEach(function (o) { o.classList.add("is-hot"); });
        });
        el.addEventListener("mouseleave", function () {
          pairs[k].forEach(function (o) { o.classList.remove("is-hot"); });
        });
        // clicking a funnel band opens its lineup item
        if (el.classList.contains("bfunnel-band")) {
          el.addEventListener("click", function () {
            pairs[k].forEach(function (o) {
              if (o.hasAttribute("data-expand")) o.setAttribute("aria-expanded", "true");
            });
          });
        }
      });
    });
  })();

  /* =====================================================================
     THE PROCESS ORBIT
     ===================================================================== */
  var orbit = (function () {
    var scene = document.getElementById("orbitScene");
    var plane = document.getElementById("orbitPlane");
    var canvas = document.getElementById("orbitCanvas");
    if (!scene || !plane || !canvas) return null;

    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height, CX = W / 2, CY = H / 2;
    /* zone boundaries (outer -> core), canvas px */
    var B = [336, 262, 192, 124, 58];
    var SURVIVE = [0.42, 0.5, 0.55, 0.62]; /* survival odds at each boundary */
    var activeStage = 0;
    var running = false;
    var raf = null;

    /* ---- particles: orbiting dots that drift inward; most are filtered ---- */
    var P = [];
    function spawn(p) {
      p = p || {};
      p.a = Math.random() * Math.PI * 2;
      p.r = B[0] - 4 - Math.random() * 30;
      p.va = (0.0018 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1);
      p.vr = 0.10 + Math.random() * 0.16;
      p.size = 1.1 + Math.random() * 1.3;
      p.alpha = 0.35 + Math.random() * 0.45;
      p.zone = 0;
      p.dying = 0;     /* >0 = fading out */
      p.flash = 0;     /* core arrival pulse */
      return p;
    }
    for (var i = 0; i < 150; i++) { var pp = spawn({}); pp.r = 60 + Math.random() * 270; pp.zone = zoneOf(pp.r); P.push(pp); }
    function zoneOf(r) { for (var z = 0; z < 4; z++) { if (r > B[z + 1]) return z; } return 4; }

    function step() {
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        if (p.dying > 0) { p.dying -= 0.04; if (p.dying <= 0) spawn(p); continue; }
        p.a += p.va;
        p.r -= p.vr;
        var z = zoneOf(p.r);
        if (z !== p.zone) {
          if (z >= 1 && z <= 4 && Math.random() > SURVIVE[z - 1]) { p.dying = 1; continue; }
          p.zone = z;
          p.alpha = Math.min(1, p.alpha + 0.16);
          p.size = Math.min(2.6, p.size + 0.18);
        }
        if (p.r <= B[4] - 14) { p.flash = 1; spawn(p); p.flash = 0; }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      /* zone fills + rings, brightening inward */
      var fills = ["rgba(148,171,214,0.030)", "rgba(148,171,214,0.055)", "rgba(148,171,214,0.085)", "rgba(124,152,208,0.13)"];
      for (var z = 0; z < 4; z++) {
        ctx.beginPath(); ctx.arc(CX, CY, B[z], 0, Math.PI * 2);
        ctx.arc(CX, CY, B[z + 1], 0, Math.PI * 2, true);
        ctx.fillStyle = fills[z]; ctx.fill();
      }
      /* core glow */
      var g = ctx.createRadialGradient(CX, CY, 4, CX, CY, B[4]);
      g.addColorStop(0, "rgba(148,171,214,0.95)");
      g.addColorStop(0.55, "rgba(92,124,184,0.55)");
      g.addColorStop(1, "rgba(92,124,184,0.10)");
      ctx.beginPath(); ctx.arc(CX, CY, B[4], 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      /* ring strokes */
      for (var k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.arc(CX, CY, B[k], 0, Math.PI * 2);
        var isActive = (k === activeStage) || (activeStage === 4 && k === 4);
        ctx.strokeStyle = isActive ? "rgba(148,171,214,0.95)" : "rgba(148,171,214," + (0.16 + k * 0.07) + ")";
        ctx.lineWidth = isActive ? 2.6 : 1.1;
        if (isActive) { ctx.shadowColor = "rgba(148,171,214,0.8)"; ctx.shadowBlur = 14; }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      /* particles */
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        var a = p.alpha * (p.dying > 0 ? p.dying : 1);
        var x = CX + Math.cos(p.a) * p.r, y = CY + Math.sin(p.a) * p.r;
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(234,242,251," + a.toFixed(3) + ")";
        ctx.fill();
      }
    }

    function loop() { step(); draw(); raf = running ? requestAnimationFrame(loop) : null; }
    function start() {
      if (running) return;
      running = true;
      draw(); /* immediate static frame — survives frozen rAF environments */
      if (!reduced) raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

    /* ---- pointer tilt: the scene morphs under the mouse ---- */
    var tilt = { x: 58, z: 0 }, target = { x: 58, z: 0 }, tiltRaf = null;
    function tiltLoop() {
      tilt.x += (target.x - tilt.x) * 0.08;
      tilt.z += (target.z - tilt.z) * 0.08;
      plane.style.transform = "translate(-50%,-50%) rotateX(" + tilt.x.toFixed(2) + "deg) rotateZ(" + tilt.z.toFixed(2) + "deg)";
      if (Math.abs(target.x - tilt.x) > 0.05 || Math.abs(target.z - tilt.z) > 0.05) {
        tiltRaf = requestAnimationFrame(tiltLoop);
      } else { tiltRaf = null; }
    }
    function kickTilt() { if (!tiltRaf && !reduced) tiltRaf = requestAnimationFrame(tiltLoop); }
    scene.addEventListener("pointermove", function (e) {
      var r = scene.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;   /* -0.5 .. 0.5 */
      var ny = (e.clientY - r.top) / r.height - 0.5;
      target.x = 58 - ny * 14;   /* 51 .. 65 */
      target.z = nx * 9;         /* -4.5 .. 4.5 */
      kickTilt();
    });
    scene.addEventListener("pointerleave", function () { target.x = 58; target.z = 0; kickTilt(); });

    /* ---- stage activation ---- */
    var stages = Array.prototype.slice.call(document.querySelectorAll(".orbit__stage"));
    var tags = Array.prototype.slice.call(document.querySelectorAll(".orbit__tag"));
    var hits = Array.prototype.slice.call(document.querySelectorAll(".orbit__hit"));
    function setStage(n) {
      activeStage = n;
      stages.forEach(function (s) { s.classList.toggle("is-active", +s.getAttribute("data-stage") === n); });
      tags.forEach(function (t) { t.classList.toggle("is-active", +t.getAttribute("data-stage") === n); });
      if (reduced) draw();
    }
    hits.concat(tags).forEach(function (el) {
      el.addEventListener("click", function () { setStage(+el.getAttribute("data-stage")); });
      el.addEventListener("mouseenter", function () { /* soft preview: brighten ring */ });
    });
    setStage(0);

    return { start: start, stop: stop, draw: draw, el: scene.closest(".slide") };
  })();

  /* =====================================================================
     Slide-enter choreography
     ===================================================================== */
  var played = new WeakSet();

  function pourFunnel(slide) {
    var svg = slide.querySelector(".bro-funnel__svg");
    if (!svg) return;
    var bands = Array.prototype.slice.call(svg.querySelectorAll(".bfunnel-band"));
    var labels = Array.prototype.slice.call(svg.querySelectorAll(".bfunnel-label"));
    bands.forEach(function (b, i) {
      setTimeout(function () {
        b.classList.add("is-poured");
        if (labels[i]) labels[i].classList.add("is-poured");
      }, reduced ? 0 : 240 * i + 250);
    });
    setTimeout(function () { svg.classList.add("grains-on"); },
      reduced ? 0 : 240 * bands.length + 500);
  }

  function igniteFrame(slide) {
    var nodes = Array.prototype.slice.call(slide.querySelectorAll(".frame__node"));
    nodes.forEach(function (n, i) {
      setTimeout(function () { n.classList.add("is-lit"); },
        reduced ? 0 : 380 + 260 * i);
    });
  }

  function playSlide(slide) {
    if (!played.has(slide)) {
      played.add(slide);
      pourFunnel(slide);
      igniteFrame(slide);
    }
    /* orbit runs while visible, pauses when not */
    if (orbit) {
      if (slide === orbit.el) orbit.start(); else orbit.stop();
    }
  }

  /* ---- Track active slide ---- */
  function activate(i) {
    var s = slides[i];
    if (!s) return;
    s.classList.add("is-in");
    playSlide(s);
    setActive(i);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) activate(slides.indexOf(e.target));
    });
  }, { root: deck, threshold: 0.55 });
  slides.forEach(function (s) { io.observe(s); });
  /* scroll-position fallback — IO can lag or freeze in embedded webviews */
  var sT = null;
  deck.addEventListener("scroll", function () {
    clearTimeout(sT);
    sT = setTimeout(function () {
      activate(Math.round(deck.scrollLeft / deck.clientWidth));
    }, 90);
  }, { passive: true });
  slides[0].classList.add("is-in");
  setActive(0);

  /* keep alignment on resize */
  var rT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () { deck.scrollTo({ left: current * deck.clientWidth, behavior: "auto" }); }, 120);
  });

  /* ---- Print: open everything, draw orbit once ---- */
  function finalizeForPrint() {
    slides.forEach(function (s) { s.classList.add("is-in"); played.add(s); });
    Array.prototype.forEach.call(document.querySelectorAll(".bfunnel-band, .bfunnel-label"), function (el) { el.classList.add("is-poured"); });
    Array.prototype.forEach.call(document.querySelectorAll(".frame__node"), function (el) { el.classList.add("is-lit"); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-expand]"), function (el) { el.setAttribute("aria-expanded", "true"); });
    if (orbit) orbit.draw();
  }
  window.addEventListener("beforeprint", finalizeForPrint);
})();
