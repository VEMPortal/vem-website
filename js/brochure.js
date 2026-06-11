/* VEM — Interactive Brochure deck controller
   Builds the dot rail, tracks the active slide, drives keyboard / arrow /
   dot navigation, the progress bar, and the per-slide reveal. The deck is a
   native scroll-snap container, so we navigate by scrolling slides into view. */
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

  /* ---- Track which slide is in view + reveal it ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        setActive(slides.indexOf(e.target));
      }
    });
  }, { root: deck, threshold: 0.55 });
  slides.forEach(function (s) { io.observe(s); });
  // First slide visible immediately
  slides[0].classList.add("is-in");
  setActive(0);

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
