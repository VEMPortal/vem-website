/* VEM — GIPS report: collapsible composites + interactive bar charts.
   Charts read their data DIRECTLY from each composite's annual table, so they
   can never disagree with the verified (PDF-matching) numbers. */
(function () {
  "use strict";

  var BRAND = {
    gross: "#1A2750",   // deep navy
    net: "#5C7CB8",     // brand blue
    bench: ["#B69256", "#9AA7BD"], // muted gold, slate (for 1 or 2 benchmarks)
    grid: "rgba(11,31,68,0.08)",
    text: "#5b6b86",
    font: "'Hanken Grotesk', sans-serif"
  };

  function num(t) { var v = parseFloat(String(t).replace(/[^0-9.\-]/g, "")); return isNaN(v) ? null : v; }

  function buildChart(details) {
    if (!window.Chart || details.dataset.charted) return;
    var table = details.querySelector(".gips-table--annual");
    var canvas = details.querySelector(".composite__chart");
    if (!table || !canvas) return;

    var headers = Array.prototype.map.call(
      table.querySelectorAll("thead th"),
      function (t) { return t.textContent.replace(/ /g, " ").trim(); }
    );
    var grossIdx = headers.indexOf("Gross");
    var netIdx = headers.indexOf("Net");
    var dispIdx = headers.findIndex(function (h) { return /^Disp/.test(h); });
    if (grossIdx < 0 || netIdx < 0 || dispIdx < 0) return;
    var benchIdxs = [];
    for (var i = netIdx + 1; i < dispIdx; i++) benchIdxs.push(i);

    var years = [], gross = [], net = [], bench = benchIdxs.map(function () { return []; });
    Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (row) {
      var cells = row.children;
      years.push(cells[0].textContent.replace("*", "").trim());
      gross.push(num(cells[grossIdx].textContent));
      net.push(num(cells[netIdx].textContent));
      benchIdxs.forEach(function (bi, k) { bench[k].push(num(cells[bi].textContent)); });
    });
    // chronological order (oldest → newest) reads better on the x-axis
    years.reverse(); gross.reverse(); net.reverse(); bench.forEach(function (a) { a.reverse(); });

    var datasets = [
      { label: "Gross", data: gross, backgroundColor: BRAND.gross, borderRadius: 2 },
      { label: "Net", data: net, backgroundColor: BRAND.net, borderRadius: 2 }
    ];
    benchIdxs.forEach(function (bi, k) {
      datasets.push({ label: headers[bi], data: bench[k], backgroundColor: BRAND.bench[k] || "#9AA7BD", borderRadius: 2 });
    });

    new window.Chart(canvas, {
      type: "bar",
      data: { labels: years, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12, font: { family: BRAND.font, size: 12 }, color: BRAND.text, padding: 16 } },
          tooltip: {
            backgroundColor: "#0B1F44",
            titleFont: { family: BRAND.font }, bodyFont: { family: BRAND.font },
            callbacks: { label: function (c) { return c.dataset.label + ": " + c.parsed.y.toFixed(2) + "%"; } }
          }
        },
        scales: {
          y: {
            ticks: { font: { family: BRAND.font, size: 11 }, color: BRAND.text, callback: function (v) { return v + "%"; } },
            grid: { color: BRAND.grid }
          },
          x: { ticks: { font: { family: BRAND.font, size: 11 }, color: BRAND.text }, grid: { display: false } }
        }
      }
    });
    details.dataset.charted = "1";
  }

  function init() {
    var items = Array.prototype.slice.call(document.querySelectorAll("details.composite"));
    if (!items.length) return;

    // Open the first composite by default; build its chart now (canvas has size).
    if (!items.some(function (d) { return d.open; })) items[0].open = true;
    items.forEach(function (d) {
      if (d.open) buildChart(d);
      // Lazy-build the chart the first time a composite is opened.
      d.addEventListener("toggle", function () { if (d.open) buildChart(d); });
    });

    // TOC chips + hash links: open the target composite and scroll to it.
    function openTarget(id) {
      var el = document.getElementById(id);
      if (el && el.tagName.toLowerCase() === "details") { el.open = true; buildChart(el); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    }
    document.querySelectorAll('.report__toc a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openTarget(a.getAttribute("href").slice(1)); history.replaceState(null, "", a.getAttribute("href")); });
    });
    if (location.hash.length > 1) openTarget(location.hash.slice(1));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
