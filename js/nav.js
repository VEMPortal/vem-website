/* VEM — header navigation: dropdown menus + mobile slide-in panel.
   Accessible: aria-expanded, Esc to close, outside-click close, focus-friendly. */
(function () {
  "use strict";
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".nav__trigger"));
  var subTriggers = Array.prototype.slice.call(document.querySelectorAll(".nav__subtrigger"));

  function closeAllSubmenus(except) {
    subTriggers.forEach(function (btn) {
      if (btn === except) return;
      btn.closest(".has-submenu").classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function closeAllDropdowns(except) {
    triggers.forEach(function (btn) {
      if (btn === except) return;
      btn.closest(".has-dropdown").classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
    closeAllSubmenus();
  }

  function closeMobile() {
    if (!header) return;
    header.classList.remove("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    document.body.style.overflow = "";
  }

  /* Mobile menu toggle */
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
      /* Keep the accessible NAME in sync with state, not just aria-expanded —
         otherwise a screen reader still says "Open menu" while it's open. */
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (!open) closeAllDropdowns();
    });
  }

  /* Dropdown triggers (click / tap / keyboard) */
  triggers.forEach(function (btn) {
    var item = btn.closest(".has-dropdown");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");
      closeAllDropdowns(btn);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  /* Nested submenu triggers ("Disclosures") — toggle the flyout/accordion */
  subTriggers.forEach(function (btn) {
    var item = btn.closest(".has-submenu");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains("is-open");
      closeAllSubmenus(btn);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  /* Close on outside click */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) closeAllDropdowns();
  });

  /* Esc closes dropdowns + mobile menu */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeAllDropdowns();
      closeMobile();
    }
  });

  /* Clicking any nav link closes the mobile menu */
  document.querySelectorAll(".nav__panel a").forEach(function (a) {
    a.addEventListener("click", function () { closeMobile(); closeAllDropdowns(); });
  });
})();
