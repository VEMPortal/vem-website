/* VEM — PSN Top Guns page: "See the calculation" widget.
   Reads the monthly return tables DIRECTLY from the page, so the output can
   never disagree with the published (as-reported-to-PSN) numbers. */
(function () {
  "use strict";

  function parseMonthly(table) {
    // Flat chronological list of monthly returns; skips em-dash cells and YTD.
    var out = [];
    var rows = table.querySelectorAll("tbody tr");
    Array.prototype.forEach.call(rows, function (row) {
      var cells = row.querySelectorAll("td");
      for (var i = 0; i < 12 && i < cells.length; i++) {
        var v = parseFloat(cells[i].textContent);
        if (!isNaN(v)) out.push(v);
      }
    });
    return out;
  }

  function fmt(v) { return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + "%"; }

  function describe(series, months) {
    var n = months === "all" ? series.length : Math.min(parseInt(months, 10), series.length);
    var slice = series.slice(series.length - n);
    var growth = 1;
    for (var i = 0; i < slice.length; i++) growth *= 1 + slice[i] / 100;
    var total = (growth - 1) * 100;
    if (n <= 12) {
      return n + " monthly returns compounded: " + fmt(total);
    }
    var annual = (Math.pow(growth, 12 / n) - 1) * 100;
    return n + " monthly returns compounded: " + fmt(total) + " in total — an average of " + fmt(annual) + " per year";
  }

  function init() {
    var calc = document.querySelector(".psn-calc");
    var tables = document.querySelectorAll(".gips-table--monthly");
    if (!calc || tables.length < 2) return;
    var net = parseMonthly(tables[0]);
    var gross = parseMonthly(tables[1]);
    var outNet = calc.querySelector('[data-calc="net"]');
    var outGross = calc.querySelector('[data-calc="gross"]');
    var chips = calc.querySelectorAll(".psn-calc__chips button");

    function render(months) {
      outNet.textContent = describe(net, months);
      outGross.textContent = describe(gross, months);
    }

    Array.prototype.forEach.call(chips, function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(chips, function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        render(btn.dataset.months);
      });
    });

    render("3");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
