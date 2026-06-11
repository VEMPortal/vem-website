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

  /* =====================================================================
     STRATEGY-PLATFORM FUNNEL (website engine, ported)
     Clamped-particle funnel: every dot is constrained to the funnel's
     half-width at its current height, so nothing falls outside.
     ===================================================================== */
  var funnel = (function () {
    var root = document.querySelector("[data-process]");
    if (!root) return null;
    var bands  = Array.prototype.slice.call(root.querySelectorAll(".pband-g"));
    var stages = Array.prototype.slice.call(root.querySelectorAll(".pstage"));
    var svg    = root.querySelector(".pfunnel__svg");
    if (!bands.length || !stages.length) return null;
    var maxFilled = -1;

    function fillTo(n) {
      for (var i = 0; i <= n && i < bands.length; i++) bands[i].classList.add("is-filled");
      if (n > maxFilled) maxFilled = n;
    }
    function setActiveBand(k) { bands.forEach(function (b, i) { b.classList.toggle("is-active", i === k); }); }
    function openIndex() { for (var i = 0; i < stages.length; i++) if (stages[i].classList.contains("is-open")) return i; return -1; }
    function openStage(k) {
      stages.forEach(function (s, i) {
        var on = i === k;
        s.classList.toggle("is-open", on);
        s.querySelector(".pstage__head").setAttribute("aria-expanded", String(on));
      });
      setActiveBand(k); fillTo(k);
    }
    stages.forEach(function (s, k) {
      var head = s.querySelector(".pstage__head");
      head.addEventListener("click", function () {
        if (s.classList.contains("is-open")) {
          s.classList.remove("is-open"); head.setAttribute("aria-expanded", "false"); setActiveBand(-1);
        } else { openStage(k); }
      });
      s.addEventListener("mouseenter", function () { setActiveBand(k); });
      s.addEventListener("mouseleave", function () { setActiveBand(openIndex()); });
    });
    /* clicking a funnel band opens its matching stage */
    bands.forEach(function (b, k) {
      b.querySelector(".pband").addEventListener("click", function () { openStage(k); });
    });
    setActiveBand(0);

    function pour() {
      var i = 0; fillTo(0);
      var t = setInterval(function () { i++; if (i >= bands.length) { clearInterval(t); return; } fillTo(i); }, 430);
    }

    /* ---- clamped falling particles ---- */
    var EDGES = [[0,172],[68,128],[147,89],[226,58],[305,39],[384,34]];
    var CULL_Y = [68,147,226,305];
    var SURVIVE = [0.55,0.5,0.48,0.62];
    var CX = 180, BOTTOM = 384;
    function halfW(y) {
      for (var i = 1; i < EDGES.length; i++) {
        if (y <= EDGES[i][0]) { var a = EDGES[i-1], b = EDGES[i]; var p = (y-a[0])/(b[0]-a[0]); return a[1]+(b[1]-a[1])*p; }
      }
      return EDGES[EDGES.length-1][1];
    }
    var particles = [], particlesOn = false, prafId = null;
    function resetParticle(p, randomY) {
      p.y = randomY ? Math.random()*BOTTOM : -4 - Math.random()*60;
      p.lane = (Math.random()*2-1)*0.92;
      p.speed = 0.22 + Math.random()*0.3;
      p.alive = true; p.nextCull = 0;
      while (p.nextCull < CULL_Y.length && p.y > CULL_Y[p.nextCull]) p.nextCull++;
      p.el.setAttribute("opacity", "0");
    }
    function makeParticle(group, randomY) {
      var el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("r", (1.4 + Math.random()*1.1).toFixed(2));
      el.setAttribute("class", "pgrain");
      group.appendChild(el);
      var p = { el: el, y: 0, lane: 0, speed: 0, alive: true, nextCull: 0 };
      resetParticle(p, randomY); return p;
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
        var depth = Math.min(1, p.y / BOTTOM);
        var op = Math.min(0.96, (0.55 + 0.41 * depth) * fadeIn);
        p.el.setAttribute("opacity", op.toFixed(2));
        p.el.setAttribute("cx", x.toFixed(1));
        p.el.setAttribute("cy", p.y.toFixed(1));
      }
      if (particlesOn) prafId = requestAnimationFrame(stepParticles);
    }
    function startParticles() {
      if (particlesOn || reduced || !svg) return;
      if (!particles.length) {
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("aria-hidden", "true"); group.setAttribute("class", "pgrains");
        svg.appendChild(group);
        for (var i = 0; i < 34; i++) particles.push(makeParticle(group, true));
      }
      particlesOn = true; prafId = requestAnimationFrame(stepParticles);
    }
    function stopParticles() { particlesOn = false; if (prafId) { cancelAnimationFrame(prafId); prafId = null; } }

    var poured = false;
    return {
      el: root.closest(".slide"),
      start: function () { if (!poured) { poured = true; if (reduced) fillTo(bands.length - 1); else pour(); } startParticles(); },
      stop: stopParticles,
      finalize: function () { fillTo(bands.length - 1); }
    };
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
    var zoomed = false; /* zoom mode: brighter, freer rotation */

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
      /* ring strokes */
      for (var k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.arc(CX, CY, B[k], 0, Math.PI * 2);
        var isActive = (k === activeStage) || (activeStage === 4 && k === 4);
        ctx.strokeStyle = isActive ? "rgba(148,171,214,0.95)" : "rgba(148,171,214," + (0.16 + k * 0.07) + ")";
        ctx.lineWidth = isActive ? (zoomed ? 3.2 : 2.6) : 1.1;
        if (isActive) { ctx.shadowColor = "rgba(148,171,214," + (zoomed ? 0.95 : 0.8) + ")"; ctx.shadowBlur = zoomed ? 22 : 14; }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      /* ---- the portfolio core: a lit 3D sphere (the sun/planet) ---- */
      var cr = B[4];
      var lx = CX - cr * 0.34, ly = CY - cr * 0.34;   /* light from upper-left */
      /* outer atmosphere glow */
      var halo = ctx.createRadialGradient(CX, CY, cr * 0.7, CX, CY, cr * (zoomed ? 2.1 : 1.7));
      halo.addColorStop(0, "rgba(148,171,214," + (zoomed ? 0.6 : 0.45) + ")");
      halo.addColorStop(1, "rgba(148,171,214,0)");
      ctx.beginPath(); ctx.arc(CX, CY, cr * (zoomed ? 2.1 : 1.7), 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();
      /* the sphere body — offset radial gradient = shaded ball */
      var sph = ctx.createRadialGradient(lx, ly, cr * 0.12, CX, CY, cr * 1.05);
      sph.addColorStop(0, "rgba(234,243,255,0.99)");
      sph.addColorStop(0.34, "rgba(160,184,224,0.96)");
      sph.addColorStop(0.72, "rgba(78,108,168,0.92)");
      sph.addColorStop(1, "rgba(26,42,82,0.96)");
      ctx.beginPath(); ctx.arc(CX, CY, cr, 0, Math.PI * 2);
      ctx.fillStyle = sph; ctx.fill();
      /* rim light on the shadow side */
      ctx.beginPath(); ctx.arc(CX, CY, cr, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(148,171,214,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      /* specular highlight */
      ctx.beginPath(); ctx.arc(lx, ly, cr * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fill();
      /* particles — flowing in toward the sphere */
      var boost = zoomed ? 1 : 0;
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        var a = Math.min(1, p.alpha * (p.dying > 0 ? p.dying : 1) + boost * 0.28);
        var x = CX + Math.cos(p.a) * p.r, y = CY + Math.sin(p.a) * p.r;
        ctx.beginPath(); ctx.arc(x, y, p.size + boost * 0.5, 0, Math.PI * 2);
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

    /* ---- pointer tilt + zoom: the scene morphs and can spin ---- */
    var orbitEl = scene.closest(".orbit");
    var tilt = { x: 58, z: 0 }, target = { x: 58, z: 0 }, spin = 0, tiltRaf = null;
    function applyTransform() {
      var scale = zoomed ? 1.16 : 1;
      plane.style.transform = "translate(-50%,-50%) scale(" + scale + ") rotateX(" + tilt.x.toFixed(2) + "deg) rotateZ(" + (tilt.z + spin).toFixed(2) + "deg)";
    }
    function tiltLoop() {
      tilt.x += (target.x - tilt.x) * 0.08;
      tilt.z += (target.z - tilt.z) * 0.08;
      if (zoomed) spin += 0.16;          /* zoom mode slowly rotates the disc */
      applyTransform();
      var moving = zoomed || Math.abs(target.x - tilt.x) > 0.05 || Math.abs(target.z - tilt.z) > 0.05;
      if (moving && !reduced) { tiltRaf = requestAnimationFrame(tiltLoop); } else { tiltRaf = null; }
    }
    function kickTilt() { if (!tiltRaf && !reduced) tiltRaf = requestAnimationFrame(tiltLoop); }
    scene.addEventListener("pointermove", function (e) {
      var r = scene.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;   /* -0.5 .. 0.5 */
      var ny = (e.clientY - r.top) / r.height - 0.5;
      var range = zoomed ? 30 : 14;
      target.x = 58 - ny * range;
      if (!zoomed) target.z = nx * 9;    /* in zoom mode, auto-spin owns Z */
      kickTilt();
    });
    scene.addEventListener("pointerleave", function () { target.x = 58; if (!zoomed) target.z = 0; kickTilt(); });

    /* ---- zoom toggle: click the button (or the universe) to zoom in ---- */
    var zoomBtn = document.getElementById("orbitZoom");
    function setZoom(on) {
      zoomed = on;
      if (orbitEl) orbitEl.classList.toggle("is-zoomed", zoomed);
      if (zoomBtn) {
        zoomBtn.setAttribute("aria-pressed", String(zoomed));
        var lbl = zoomBtn.querySelector(".orbit__zoomlabel");
        if (lbl) lbl.textContent = zoomed ? "Reset view" : "Zoom in";
      }
      if (!zoomed) { target.x = 58; target.z = 0; spin = spin % 360; }
      if (reduced) draw();
      kickTilt();
    }
    if (zoomBtn) zoomBtn.addEventListener("click", function () { setZoom(!zoomed); });

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
      igniteFrame(slide);
    }
    /* orbit + funnel run while visible, pause when not */
    if (orbit) { if (slide === orbit.el) orbit.start(); else orbit.stop(); }
    if (funnel) { if (slide === funnel.el) funnel.start(); else funnel.stop(); }
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

  /* ---- Deep-link: land on a specific slide via #hash. "Back to Brochure" from
     the universe (#process) and the fact sheets (#equity-models) returns the
     viewer to the slide they launched from — never the start. Runs on load,
     on hashchange, and on bfcache restore (pageshow) so back-navigation lands
     on the right slide regardless of how the browser restores the page. ---- */
  function jumpToHash() {
    var id = (window.location.hash || "").replace(/^#/, "");
    if (!id) return;
    var target = document.getElementById(id);
    var idx = target ? slides.indexOf(target) : -1;
    if (idx >= 0) {
      deck.scrollTo({ left: idx * deck.clientWidth, behavior: "auto" });
      activate(idx);
    }
  }
  jumpToHash();
  window.addEventListener("hashchange", jumpToHash);
  window.addEventListener("pageshow", function (e) { if (e.persisted) jumpToHash(); });

  /* keep alignment on resize */
  var rT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () { deck.scrollTo({ left: current * deck.clientWidth, behavior: "auto" }); }, 120);
  });

  /* ---- Print: open everything, draw orbit once ---- */
  function finalizeForPrint() {
    slides.forEach(function (s) { s.classList.add("is-in"); played.add(s); });
    Array.prototype.forEach.call(document.querySelectorAll(".frame__node"), function (el) { el.classList.add("is-lit"); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-expand]"), function (el) { el.setAttribute("aria-expanded", "true"); });
    Array.prototype.forEach.call(document.querySelectorAll(".pstage"), function (el) {
      el.classList.add("is-open"); var h = el.querySelector(".pstage__head"); if (h) h.setAttribute("aria-expanded", "true");
    });
    if (funnel) funnel.finalize();
    if (orbit) orbit.draw();
  }
  window.addEventListener("beforeprint", finalizeForPrint);
})();
