/* Readiness — foundations self-assessment (R/Y/G) + per-section go/no-go gates. */
(function () {
  "use strict";

  window.Views.readiness = function (root) {
    var esc = window.App.esc;
    var found = window.Store.get("foundations", {});   /* {id: "red"|"yellow"|"green"} */
    var ready = window.Store.get("readiness", {});     /* {SEC: {mix, tbs, mock1, mock2}} */

    var html = "<h2>Readiness</h2>"
      + '<p class="lead">Two gates: (1) the foundations platform before heavy section study, (2) the per-section go/no-go before booking a sit.</p>';

    /* ---------- foundations ---------- */
    html += "<h3>1 · Foundations self-assessment</h3>"
      + '<p class="small muted">Rate honestly. Any RED gets repaired before heavy review of the sections it affects — see <a href="' + window.App.kb("../foundations/00-prerequisites.md") + '">foundations</a> for the diagnostics and repair plan.</p>';
    html += '<div class="card" style="padding:0"><table class="tbl">';
    window.CPA_FOUNDATIONS.forEach(function (f) {
      var v = found[f.id] || "";
      html += "<tr><td style=\"min-width:180px\"><b>" + esc(f.name) + "</b><br><span class=\"small muted\">affects " + esc(f.affects) + "</span></td>"
        + "<td class=\"small\">" + esc(f.standard) + (v === "red" ? "<br><span class=\"small\" style=\"color:var(--red)\">Repair: " + esc(f.repair) + "</span>" : "") + "</td>"
        + '<td style="white-space:nowrap">'
        + '<button class="' + (v === "red" ? "bad" : "ghost") + '" data-f="' + f.id + '" data-v="red">Red</button> '
        + '<button class="' + (v === "yellow" ? "warn" : "ghost") + '" data-f="' + f.id + '" data-v="yellow">Yellow</button> '
        + '<button class="' + (v === "green" ? "good" : "ghost") + '" data-f="' + f.id + '" data-v="green">Green</button>'
        + "</td></tr>";
    });
    html += "</table></div>";

    var reds = window.CPA_FOUNDATIONS.filter(function (f) { return found[f.id] === "red"; }).length;
    if (reds >= 2) {
      html += '<div class="notice">⚠️ ' + reds + " foundations are Red. Budget 20–60 extra hours of repair up front — cheaper than failing a section and rebuilding under time pressure.</div>";
    }

    /* ---------- per-section go/no-go ---------- */
    html += "<h3 class=\"mt\">2 · Pre-sit go/no-go (per section)</h3>"
      + '<p class="small muted">Targets (recommended, not official): timed-mix ≥75% two weeks out · TBSs finished on time · two mocks ≥75 (or one ≥80 + one ≥75). '
      + 'If most gates fail two weeks out, delaying is usually cheaper than burning a fail.</p>';

    Object.keys(window.CPA_SECTIONS).forEach(function (sec) {
      var r = ready[sec] || {};
      var meta = window.CPA_SECTIONS[sec];
      var mix = r.mix === undefined || r.mix === "" ? null : Number(r.mix);
      var m1 = r.mock1 === undefined || r.mock1 === "" ? null : Number(r.mock1);
      var m2 = r.mock2 === undefined || r.mock2 === "" ? null : Number(r.mock2);
      var tbs = !!r.tbs;

      var gates = [
        { label: "Timed mixed sets ≥ 75%", pass: mix !== null && mix >= 75, has: mix !== null },
        { label: "TBSs completed on time", pass: tbs, has: true },
        { label: "Two mocks ≥ 75 (or 80 + 75)", pass: (m1 !== null && m2 !== null) && ((m1 >= 75 && m2 >= 75) || (Math.max(m1, m2) >= 80 && Math.min(m1, m2) >= 75)), has: m1 !== null && m2 !== null }
      ];
      var passed = gates.filter(function (g) { return g.pass; }).length;
      var verdict, dot;
      if (passed === 3) { verdict = "GO — book it."; dot = "green"; }
      else if (passed === 2) { verdict = "Close — fix the failed gate, then book."; dot = "yellow"; }
      else if (mix === null && m1 === null && m2 === null) { verdict = "No data yet."; dot = "gray"; }
      else { verdict = "NO-GO — remediate before booking."; dot = "red"; }

      html += '<div class="card mb"><div class="flex"><b>' + sec + "</b> <span class=\"small muted\">" + esc(meta.name) + "</span><span class=\"spacer\"></span>"
        + '<span><span class="statusdot ' + dot + '"></span><b>' + verdict + "</b></span></div>"
        + '<div class="row mt">'
        + '<div><label class="fld">Latest timed-mix %</label><input type="number" min="0" max="100" data-sec="' + sec + '" data-k="mix" value="' + (mix === null ? "" : mix) + '"></div>'
        + '<div><label class="fld">Mock #1 score</label><input type="number" min="0" max="99" data-sec="' + sec + '" data-k="mock1" value="' + (m1 === null ? "" : m1) + '"></div>'
        + '<div><label class="fld">Mock #2 score</label><input type="number" min="0" max="99" data-sec="' + sec + '" data-k="mock2" value="' + (m2 === null ? "" : m2) + '"></div>'
        + '<div><label class="fld">TBS on time?</label><button class="' + (tbs ? "good" : "ghost") + '" data-sec="' + sec + '" data-k="tbs">' + (tbs ? "Yes ✓" : "Not yet") + "</button></div>"
        + "</div>"
        + '<p class="small muted mt">Gates: ' + gates.map(function (g) { return (g.pass ? "✅" : "❌") + " " + g.label; }).join(" · ") + "</p>"
        + "</div>";
    });

    html += '<p class="small muted">Section-specific "you\'re ready" flags and the full checklist: <a href="' + window.App.kb("../study-plan/04-assessment-remediation.md") + '">assessment & remediation</a>.</p>';

    root.innerHTML = html;

    /* foundations buttons */
    root.querySelectorAll("[data-f]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = window.Store.get("foundations", {});
        f[btn.getAttribute("data-f")] = btn.getAttribute("data-v");
        window.Store.set("foundations", f);
        window.App.render();
      });
    });

    /* readiness inputs */
    root.querySelectorAll("input[data-sec]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var all = window.Store.get("readiness", {});
        var sec = inp.getAttribute("data-sec");
        all[sec] = all[sec] || {};
        all[sec][inp.getAttribute("data-k")] = inp.value;
        window.Store.set("readiness", all);
        window.App.render();
      });
    });
    root.querySelectorAll("button[data-sec][data-k='tbs']").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var all = window.Store.get("readiness", {});
        var sec = btn.getAttribute("data-sec");
        all[sec] = all[sec] || {};
        all[sec].tbs = !all[sec].tbs;
        window.Store.set("readiness", all);
        window.App.render();
      });
    });
  };
})();
