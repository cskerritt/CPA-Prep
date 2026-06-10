/* Study Planner — generates a week-by-week schedule from the phased-plan templates. */
(function () {
  "use strict";
  var esc, fmtDate, addDays, sectionBadge;

  /* Generate [{section, label, start}] from a config {length, seq, disc, start}. */
  function generate(cfg) {
    var plan = window.CPA_PLANS[cfg.length];
    var seq = window.CPA_SEQUENCES[cfg.seq];
    if (!plan || !seq) return [];
    var weeks = [];
    seq.order.forEach(function (slot) {
      var sectionCode = slot === "DISC" ? cfg.disc : slot;
      var blockKey = slot === "DISC" ? "DISC" : slot;
      (plan.blocks[blockKey] || []).forEach(function (label) {
        weeks.push({
          section: sectionCode,
          label: label.replace(/\{D\}/g, cfg.disc)
        });
      });
    });
    weeks.forEach(function (w, i) { w.start = window.App ? window.App.addDays(cfg.start, i * 7) : cfg.start; });
    return weeks;
  }

  /* The week containing the Discipline SIT — check it lands in Jan/Apr/Jul/Oct (2026 rule). */
  function disciplineWindowWarning(cfg, schedule) {
    var sitWeek = null;
    for (var i = schedule.length - 1; i >= 0; i--) {
      if (schedule[i].section === cfg.disc) { sitWeek = schedule[i]; break; }
    }
    if (!sitWeek) return null;
    var month = new Date(sitWeek.start + "T00:00:00").getMonth() + 1; /* 1-12 */
    var ok = [1, 4, 7, 10].indexOf(month) !== -1;
    return { sitWeek: sitWeek, ok: ok, month: month };
  }

  window.Planner = { generate: generate };

  window.Views.plan = function (root) {
    esc = window.App.esc; fmtDate = window.App.fmtDate; addDays = window.App.addDays; sectionBadge = window.App.sectionBadge;
    var cfg = window.Store.get("plan.config", null);
    var html = "<h2>Study Plan</h2>";

    /* ----- config form ----- */
    html += '<div class="card">';
    html += '<div class="row">';
    html += '<div><label class="fld">Plan length</label><select id="p-length">';
    Object.keys(window.CPA_PLANS).forEach(function (k) {
      html += '<option value="' + k + '"' + (cfg && String(cfg.length) === String(k) ? " selected" : (!cfg && k === "16" ? " selected" : "")) + ">" + esc(window.CPA_PLANS[k].label) + "</option>";
    });
    html += "</select></div>";
    html += '<div><label class="fld">Sequence</label><select id="p-seq">';
    Object.keys(window.CPA_SEQUENCES).forEach(function (k) {
      html += '<option value="' + k + '"' + (cfg && cfg.seq === k ? " selected" : "") + ">" + esc(window.CPA_SEQUENCES[k].label) + "</option>";
    });
    html += "</select></div>";
    html += '<div><label class="fld">Discipline</label><select id="p-disc">';
    window.CPA_DISCIPLINES.forEach(function (d) {
      html += '<option value="' + d + '"' + (cfg && cfg.disc === d ? " selected" : "") + ">" + d + " — " + esc(window.CPA_SECTIONS[d].name) + "</option>";
    });
    html += "</select></div>";
    html += '<div><label class="fld">Start date (a Monday works best)</label><input type="date" id="p-start" value="' + esc(cfg ? cfg.start : window.App.todayISO()) + '"></div>';
    html += '<div><button class="primary" id="p-build">' + (cfg ? "Rebuild plan" : "Build plan") + "</button></div>";
    html += "</div>";
    if (cfg) html += '<p class="small muted mt">Rebuilding regenerates the schedule; week check-offs are kept by position.</p>';
    html += "</div>";

    /* ----- schedule ----- */
    if (cfg) {
      var schedule = generate(cfg);
      var done = window.Store.get("plan.done", {});
      var planMeta = window.CPA_PLANS[cfg.length];
      var seqMeta = window.CPA_SEQUENCES[cfg.seq];

      html += '<div class="flex mt"><h3 style="margin:0">' + esc(planMeta.label) + "</h3><span class=\"badge gray\">" + esc(planMeta.weeklyHours) + "</span></div>";
      html += '<p class="small muted">' + esc(planMeta.fits) + " — " + esc(seqMeta.note) + "</p>";

      var warn = disciplineWindowWarning(cfg, schedule);
      if (warn && !warn.ok) {
        html += '<div class="notice">⚠️ Your <b>' + esc(cfg.disc) + "</b> sit week starts " + fmtDate(warn.sitWeek.start)
          + " — but in 2026, Discipline sections are administered only in <b>January, April, July, and October</b>. Shift your start date so the final "
          + esc(cfg.disc) + " week lands in one of those months.</div>";
      } else if (warn && warn.ok) {
        html += '<div class="card small mb">✅ Your ' + esc(cfg.disc) + " sit week (" + fmtDate(warn.sitWeek.start) + ") lands inside a 2026 Discipline testing month.</div>";
      }

      html += '<div class="card" style="padding:0">';
      schedule.forEach(function (w, i) {
        var isDone = !!done[i];
        html += '<div class="week' + (isDone ? " done" : "") + '">'
          + '<input type="checkbox" data-wk="' + i + '"' + (isDone ? " checked" : "") + ">"
          + '<div class="wk">Wk ' + (i + 1) + "<br><span class=\"small\">" + fmtDate(w.start) + "</span></div>"
          + "<div class=\"milestone\">" + sectionBadge(w.section) + " " + esc(w.label) + "</div>"
          + "</div>";
      });
      html += "</div>";

      html += '<p class="small muted mt">Per-section rhythm: ~45% content acquisition · 35% mixed MCQ+TBS practice · 20% cumulative review & mocks. '
        + 'Daily/weekly mechanics: <a href="../study-plan/03-weekly-template.md">weekly template</a>. '
        + 'Readiness gates before each sit: <a href="#/readiness">readiness tracker</a>.</p>';
    } else {
      html += '<div class="notice mt">No plan yet — choose your options above and build one. Not sure which Discipline? '
        + 'Rule of thumb: <b>BAR</b> extends FAR (reporting/FP&A people), <b>ISC</b> extends AUD (IT-audit/SOC people), <b>TCP</b> extends REG (tax people). '
        + 'See <a href="../study-plan/01-sequence-and-hours.md">sequence & hours</a>.</div>';
    }

    root.innerHTML = html;

    /* sequence → discipline auto-suggest */
    var seqSel = root.querySelector("#p-seq");
    var discSel = root.querySelector("#p-disc");
    seqSel.addEventListener("change", function () {
      var map = { tax: "TCP", itaudit: "ISC", reporting: "BAR" };
      if (map[seqSel.value]) discSel.value = map[seqSel.value];
    });

    root.querySelector("#p-build").addEventListener("click", function () {
      var newCfg = {
        length: root.querySelector("#p-length").value,
        seq: seqSel.value,
        disc: discSel.value,
        start: root.querySelector("#p-start").value || window.App.todayISO()
      };
      window.Store.set("plan.config", newCfg);
      window.App.render();
    });

    root.querySelectorAll('input[type="checkbox"][data-wk]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        var done = window.Store.get("plan.done", {});
        done[cb.getAttribute("data-wk")] = cb.checked;
        window.Store.set("plan.done", done);
        cb.closest(".week").classList.toggle("done", cb.checked);
      });
    });
  };
})();
