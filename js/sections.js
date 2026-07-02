/* VEM — generic scroll-reveal for content sections.
   Adds .is-visible to .reveal elements as they enter the viewport. */
(function () {
  "use strict";
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

  els.forEach(function (el) { io.observe(el); });

  /* --- Count-up for [data-countup] stats (one-shot, reduced-motion safe).
     The static value already lives in the HTML, so no-JS/reduced-motion users
     simply keep it; this only animates 0 -> target on first scroll-in. --- */
  var counts = document.querySelectorAll("[data-countup]");
  if (counts.length && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-countup"));
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var t0 = null, DUR = 1100;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / DUR, 1);
          var eased = 1 - Math.pow(1 - p, 3);           /* easeOutCubic */
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  }

  /* --- Subtle parallax for [data-parallax] images + scroll-linked white-sheet
     wipe for [data-wipe] frames (e.g. the About family panel). One rAF-batched
     pass, one rect read per element. --- */
  var pEls = document.querySelectorAll("[data-parallax], [data-wipe]");
  if (pEls.length && !reduce) {
    /* Arm the wipe overlays only when JS runs — no-JS visitors see the image plain. */
    document.querySelectorAll("[data-wipe]").forEach(function (el) { el.classList.add("wipe-armed"); });
    var pTicking = false;
    var run = function () {
      pTicking = false;
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // ~ -0.8 .. 0.8
        if (el.hasAttribute("data-parallax")) {
          var img = el.querySelector("img");
          if (img) img.style.transform = "translate3d(0," + (progress * -42).toFixed(1) + "px,0)";
        }
        if (el.hasAttribute("data-wipe")) {
          /* The white sheet retreats toward the words as the panel scrolls in:
             starts as soon as it enters (progress ~0.72), fully revealed a bit
             before viewport center. The angled trailing edge itself is drawn
             in CSS (clip-path: polygon(...) using this --wipe value) — a
             pseudo-element's clip-path can't be set directly from JS. */
          var w = (0.72 - progress) / 0.55;
          if (w < 0) w = 0; if (w > 1) w = 1;
          el.style.setProperty("--wipe", w.toFixed(3));
        }
      });
    };
    var onScrollP = function () {
      if (!pTicking) { window.requestAnimationFrame(run); pTicking = true; }
    };
    window.addEventListener("scroll", onScrollP, { passive: true });
    window.addEventListener("resize", run, { passive: true });
    run();
  }

  /* --- Team: tap a person to open their detail panel (one at a time) --- */
  var people = document.querySelectorAll(".person");
  if (people.length) {
    var panels = document.querySelectorAll(".member-panel");
    people.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-key");
        var alreadyOpen = btn.getAttribute("aria-expanded") === "true";
        people.forEach(function (p) { p.setAttribute("aria-expanded", "false"); });
        panels.forEach(function (pa) { pa.hidden = true; });
        if (!alreadyOpen) {
          btn.setAttribute("aria-expanded", "true");
          var panel = document.getElementById("panel-" + key);
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  /* --- §03 explorer: tabs swap the image + the strategy panel --- */
  var tabs = document.querySelectorAll(".explorer__tab");
  if (tabs.length) {
    var imgs = document.querySelectorAll(".explorer__img");
    var expPanels = document.querySelectorAll(".explorer__panel");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
        });
        imgs.forEach(function (img) {
          img.classList.toggle("is-active", img.getAttribute("data-for") === key);
        });
        expPanels.forEach(function (p) {
          var on = p.getAttribute("data-panel") === key;
          p.classList.toggle("is-active", on);
          p.hidden = !on;
        });
      });
    });
  }

  /* --- §05b performance: tabs swap the composite returns table --- */
  var perfTabs = document.querySelectorAll(".perf__tab");
  if (perfTabs.length) {
    var perfPanels = document.querySelectorAll(".perf__panel");
    perfTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-perf-tab");
        perfTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
        });
        perfPanels.forEach(function (p) {
          var on = p.getAttribute("data-perf-panel") === key;
          p.classList.toggle("is-active", on);
          p.hidden = !on;
        });
      });
    });
  }

  /* --- §03 strategy rows: tap a strategy to expand its detail (one per panel) --- */
  var stratHeads = document.querySelectorAll(".strat__head");
  if (stratHeads.length) {
    stratHeads.forEach(function (head) {
      head.addEventListener("click", function () {
        var open = head.getAttribute("aria-expanded") === "true";
        var panel = head.closest(".explorer__panel");
        if (panel) {
          panel.querySelectorAll(".strat__head").forEach(function (h) {
            h.setAttribute("aria-expanded", "false");
            var d = document.getElementById(h.getAttribute("aria-controls"));
            if (d) d.hidden = true;
          });
        }
        if (!open) {
          head.setAttribute("aria-expanded", "true");
          var detail = document.getElementById(head.getAttribute("aria-controls"));
          if (detail) detail.hidden = false;
        }
      });
    });
  }
})();
