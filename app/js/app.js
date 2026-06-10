/* App shell — hash router, shared helpers, Dashboard and Data views. */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function todayISO() { return new Date().toISOString().slice(0, 10); }
  function addDays(iso, n) {
    var d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  function pct(n, d) { return d ? Math.round((100 * n) / d) : 0; }
  function barClass(p, target) {
    if (p >= target) return "green";
    if (p >= target - 10) return "yellow";
    return "red";
  }
  function sectionBadge(sec) {
    var meta = window.CPA_SECTIONS[sec];
    if (!meta) return "";
    return '<span class="sectag" style="background:' + meta.color + '">' + esc(sec) + "</span>";
  }

  /* Aggregated quiz stats: { SEC: { total, correct, areas: { I: {total, correct} } } } */
  function quizStats() {
    return window.Store.get("quiz.stats", {});
  }

  function dueCardCount() {
    var srs = window.Store.get("srs", {});
    var now = todayISO();
    var due = 0, fresh = 0;
    (window.CPA_CARDS || []).forEach(function (c) {
      var rec = srs[c.id];
      if (!rec) fresh++;
      else if (rec.due <= now) due++;
    });
    return { due: due, fresh: fresh };
  }

  window.App = {
    esc: esc, todayISO: todayISO, addDays: addDays, fmtDate: fmtDate,
    pct: pct, barClass: barClass, sectionBadge: sectionBadge, quizStats: quizStats
  };
  window.Views = window.Views || {};

  /* ---------- Dashboard ---------- */
  window.Views.dashboard = function (root) {
    var cfg = window.Store.get("plan.config", null);
    var done = window.Store.get("plan.done", {});
    var stats = quizStats();
    var cards = dueCardCount();
    var errors = window.Store.get("errorlog", []);
    var html = "";

    html += "<h2>Dashboard</h2>";
    html += '<p class="lead">Your CPA exam command center. Built on the AICPA 2026 Blueprints — 3 Cores (FAR, AUD, REG) + 1 Discipline (BAR, ISC, or TCP). Passing score: 75.</p>';

    /* top cards */
    html += '<div class="grid cols3">';

    if (cfg) {
      var schedule = window.Planner.generate(cfg);
      var total = schedule.length;
      var completed = schedule.filter(function (w, i) { return done[i]; }).length;
      var nextWeek = null;
      for (var i = 0; i < schedule.length; i++) { if (!done[i]) { nextWeek = schedule[i]; break; } }
      html += '<div class="card"><h3>Study plan</h3>'
        + '<div class="big">' + completed + " / " + total + "</div>"
        + '<div class="sub">weeks completed · ' + esc(cfg.length) + "-week plan</div>"
        + '<div class="progressbar mt"><div style="width:' + pct(completed, total) + '%"></div></div>'
        + (nextWeek ? '<p class="small mt">Next: <b>' + sectionBadge(nextWeek.section) + " " + esc(nextWeek.label) + "</b><br><span class=\"muted\">week of " + fmtDate(nextWeek.start) + "</span></p>" : '<p class="small mt muted">All weeks checked off — go sit that exam.</p>')
        + '<a class="btn" href="#/plan">Open plan</a></div>';
    } else {
      html += '<div class="card"><h3>Study plan</h3><p class="sub">No plan yet. Pick a 12/16/24-week calendar, your sequence, and your Discipline.</p><a class="btn" href="#/plan">Create plan</a></div>';
    }

    html += '<div class="card"><h3>Flashcards</h3>'
      + '<div class="big">' + cards.due + '</div><div class="sub">due for review · ' + cards.fresh + " new</div>"
      + '<p class="small mt muted">' + (window.CPA_CARDS || []).length + " cards across all six sections, with spaced repetition.</p>"
      + '<a class="btn" href="#/cards">Review cards</a></div>';

    var qTotal = 0, qCorrect = 0;
    Object.keys(stats).forEach(function (s) { qTotal += stats[s].total || 0; qCorrect += stats[s].correct || 0; });
    html += '<div class="card"><h3>Practice questions</h3>'
      + '<div class="big">' + (qTotal ? pct(qCorrect, qTotal) + "%" : "—") + "</div>"
      + '<div class="sub">' + qCorrect + " / " + qTotal + " lifetime accuracy</div>"
      + '<p class="small mt muted">' + (window.CPA_QUESTIONS || []).length + " blueprint-tagged MCQs with explanations.</p>"
      + '<a class="btn" href="#/quiz">Practice</a></div>';

    html += "</div>"; /* /grid */

    /* per-section accuracy vs readiness targets */
    html += "<h3>Section accuracy vs. readiness targets</h3>";
    html += '<p class="small muted">Targets from the study plan: ~65–70% end of topic → 70–75% per area → 75–80% two weeks out. Lifetime MCQ accuracy shown; use timed mixed sets as you get close.</p>';
    html += '<div class="card">';
    Object.keys(window.CPA_SECTIONS).forEach(function (sec) {
      var s = stats[sec] || { total: 0, correct: 0 };
      var p = pct(s.correct, s.total);
      html += '<div class="flex mt"><div style="min-width:54px"><b>' + esc(sec) + "</b></div>"
        + '<div class="spacer"><div class="progressbar ' + (s.total ? barClass(p, 75) : "") + '"><div style="width:' + (s.total ? p : 0) + '%"></div></div></div>'
        + '<div style="min-width:110px" class="small right">' + (s.total ? p + "% (" + s.correct + "/" + s.total + ")" : '<span class="muted">no data yet</span>') + "</div></div>";
    });
    html += "</div>";

    /* error log snapshot */
    html += "<h3>Error log</h3>";
    if (errors.length) {
      var byCat = {};
      errors.forEach(function (e) { byCat[e.category] = (byCat[e.category] || 0) + 1; });
      var cats = Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; });
      html += '<div class="card"><p class="small">' + errors.length + ' logged misses. Top failure modes: ';
      html += cats.slice(0, 3).map(function (c) { return "<b>" + esc(c) + "</b> (" + byCat[c] + ")"; }).join(" · ");
      html += '</p><a class="btn" href="#/errors">Open error log</a></div>';
    } else {
      html += '<div class="card"><p class="small muted">Empty. The error log is your highest-ROI artifact — log every miss with the rule and the decisive fact.</p><a class="btn" href="#/errors">Start logging</a></div>';
    }

    /* knowledge base links */
    html += "<h3>Knowledge base</h3>";
    html += '<div class="grid cols3">';
    html += '<div class="card"><h3>Roadmap</h3><p class="small muted">The knowledge web — how all six sections connect.</p>'
      + '<a href="../roadmap/01-master-roadmap.md">Master roadmap</a><br>'
      + '<a href="../roadmap/02-exam-architecture.md">Exam architecture</a><br>'
      + '<a href="../foundations/00-prerequisites.md">Foundations</a></div>';
    html += '<div class="card"><h3>Section dossiers</h3><p class="small muted">Blueprint maps + deep-dive reference sheets.</p>';
    Object.keys(window.CPA_SECTIONS).forEach(function (sec) {
      var m = window.CPA_SECTIONS[sec];
      html += '<a href="' + m.dossier + '">' + sec + " dossier</a> · <a href=\"" + m.deepDive + '">deep-dive</a><br>';
    });
    html += "</div>";
    html += '<div class="card"><h3>Study system</h3><p class="small muted">Plans, templates, remediation.</p>'
      + '<a href="../study-plan/01-sequence-and-hours.md">Sequence & hours</a><br>'
      + '<a href="../study-plan/02-phased-plans.md">Phased plans</a><br>'
      + '<a href="../study-plan/04-assessment-remediation.md">Assessment & remediation</a><br>'
      + '<a href="../logistics/exam-day.md">Exam-day logistics</a></div>';
    html += "</div>";

    html += '<div class="notice mt"><b>Verify before relying:</b> pass rates shift quarterly, the 18- vs 30-month credit window is jurisdiction-specific, and OBBBA tax changes become testable on REG/TCP starting <b>July 1, 2026</b>. Check your state board and the live AICPA pages.</div>';

    root.innerHTML = html;
  };

  /* ---------- Data (export / import / reset) ---------- */
  window.Views.data = function (root) {
    var html = "<h2>Data</h2>"
      + '<p class="lead">All progress (plan, flashcard scheduling, quiz stats, error log, readiness) lives in this browser’s localStorage. Export regularly if you care about it.</p>'
      + '<div class="grid cols3">'
      + '<div class="card"><h3>Export</h3><p class="small muted">Download a JSON backup of everything.</p><button class="primary" id="btn-export">Download backup</button></div>'
      + '<div class="card"><h3>Import</h3><p class="small muted">Restore from a backup file (overwrites matching keys).</p><input type="file" id="file-import" accept="application/json"><p class="small" id="import-msg"></p></div>'
      + '<div class="card"><h3>Reset</h3><p class="small muted">Wipe all app data in this browser. The knowledge base files are untouched.</p><button class="bad" id="btn-reset">Reset everything</button></div>'
      + "</div>";
    root.innerHTML = html;

    root.querySelector("#btn-export").addEventListener("click", function () {
      var blob = new Blob([window.Store.exportAll()], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "cpa-prep-backup-" + todayISO() + ".json";
      document.body.appendChild(a); a.click(); a.remove();
    });

    root.querySelector("#file-import").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var msg = root.querySelector("#import-msg");
        try {
          var n = window.Store.importAll(String(reader.result));
          msg.textContent = "Imported " + n + " keys. Reload any open views.";
        } catch (e) {
          msg.textContent = "Import failed: " + e.message;
        }
      };
      reader.readAsText(f);
    });

    root.querySelector("#btn-reset").addEventListener("click", function () {
      if (confirm("Really wipe ALL CPA-Prep progress in this browser?")) {
        window.Store.resetAll();
        location.hash = "#/dashboard";
      }
    });
  };

  /* ---------- Router ---------- */
  var routes = {
    "dashboard": "dashboard",
    "plan": "plan",
    "cards": "cards",
    "quiz": "quiz",
    "errors": "errors",
    "readiness": "readiness",
    "data": "data"
  };

  function currentRoute() {
    var h = (location.hash || "#/dashboard").replace(/^#\//, "");
    return routes[h] ? h : "dashboard";
  }

  function render() {
    var route = currentRoute();
    var root = document.getElementById("view");
    if (!root) return;
    document.querySelectorAll("nav.tabs a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#/" + route);
    });
    var view = window.Views[route];
    if (view) view(root);
    else root.innerHTML = "<h2>Not found</h2>";
    window.scrollTo(0, 0);
  }

  window.App.render = render;
  window.addEventListener("hashchange", render);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
