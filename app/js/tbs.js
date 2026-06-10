/* TBS Sims — multi-part task-based-simulation-style practice with worked solutions. */
(function () {
  "use strict";

  var openId = null;    /* scenario being worked */
  var checked = false;  /* current scenario submitted? */

  function parseNum(raw) {
    if (raw == null) return NaN;
    var s = String(raw).replace(/[$,\s]/g, "");
    if (s === "") return NaN;
    /* allow (1,234) accounting-style negatives */
    var m = s.match(/^\((.+)\)$/);
    if (m) s = "-" + m[1];
    return parseFloat(s);
  }

  function gradePart(part, rawValue) {
    if (part.type === "select") {
      return parseInt(rawValue, 10) === part.answer;
    }
    var v = parseNum(rawValue);
    if (isNaN(v)) return false;
    var tol = part.tolerance === undefined ? 0.5 : part.tolerance;
    return Math.abs(v - part.answer) <= tol;
  }

  window.TBS = { gradePart: gradePart, parseNum: parseNum };

  function renderList(root) {
    var esc = window.App.esc;
    var scores = window.Store.get("tbs.scores", {});
    var html = "<h2>TBS Sims</h2>"
      + '<p class="lead">Task-based-simulation-style worked problems — schedules, reconciliations, and report selection. The real exam is ~50% TBS scoring (ISC 40%); document fluency is where memorizers break down.</p>';

    html += '<div class="card" style="padding:0"><table class="tbl"><tr><th>Scenario</th><th>Section</th><th>Parts</th><th>Best score</th><th></th></tr>';
    (window.CPA_TBS || []).forEach(function (t) {
      var best = scores[t.id];
      html += "<tr><td><b>" + esc(t.title) + "</b></td><td>" + window.App.sectionBadge(t.section) + " <span class=\"small muted\">Area " + esc(t.area) + "</span></td>"
        + "<td>" + t.parts.length + "</td>"
        + "<td>" + (best ? best.score + "/" + best.total + (best.score === best.total ? " ✅" : "") : '<span class="muted small">not attempted</span>') + "</td>"
        + '<td><button class="primary" data-open="' + esc(t.id) + '">Work it</button></td></tr>';
    });
    html += "</table></div>"
      + '<p class="small muted mt">Supplement with real documents: the AICPA\'s retired FAR TBS, SEC EDGAR filings, and IRS forms — see the <a href="' + window.App.kb("../resources/01-resource-stack.md") + '">resource stack</a>.</p>';

    root.innerHTML = html;
    root.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openId = btn.getAttribute("data-open");
        checked = false;
        window.App.render();
      });
    });
  }

  function renderScenario(root) {
    var esc = window.App.esc;
    var t = (window.CPA_TBS || []).find(function (x) { return x.id === openId; });
    if (!t) { openId = null; renderList(root); return; }

    var saved = window.Store.get("tbs.last." + t.id, {});
    var html = "<h2>TBS Sims</h2>"
      + '<p class="small muted">' + window.App.sectionBadge(t.section) + " Area " + esc(t.area) + " · " + t.parts.length + " parts</p>"
      + '<div class="card"><h3>' + esc(t.title) + "</h3><p>" + esc(t.scenario) + "</p></div>";

    t.parts.forEach(function (part, i) {
      var ok = checked ? gradePart(part, saved[i]) : null;
      html += '<div class="card mt"' + (checked ? ' style="border-color:' + (ok ? "var(--green)" : "var(--red)") + '"' : "") + ">"
        + "<p><b>" + (i + 1) + ". " + esc(part.label) + "</b>" + (checked ? (ok ? " ✅" : " ❌") : "") + "</p>";
      if (part.type === "select") {
        html += '<select data-part="' + i + '"' + (checked ? " disabled" : "") + '><option value="">— choose —</option>';
        part.choices.forEach(function (c, j) {
          html += '<option value="' + j + '"' + (String(saved[i]) === String(j) ? " selected" : "") + ">" + esc(c) + "</option>";
        });
        html += "</select>";
      } else {
        html += '<input type="text" inputmode="decimal" placeholder="Enter amount" data-part="' + i + '" value="' + esc(saved[i] || "") + '"' + (checked ? " disabled" : "") + ">";
      }
      if (checked) {
        html += '<div class="explanation"><b>' + (ok ? "Correct." : (part.type === "select" ? "Answer: " + esc(part.choices[part.answer]) + "." : "Answer: " + part.answer.toLocaleString() + ".")) + "</b> " + esc(part.solution) + "</div>";
      }
      html += "</div>";
    });

    if (!checked) {
      html += '<div class="flex mt"><button class="primary" id="tbs-check">Check my answers</button><a href="#" id="tbs-back" class="btn ghost">Back to list</a></div>';
    } else {
      var score = t.parts.filter(function (p, i) { return gradePart(p, saved[i]); }).length;
      html += '<div class="card mt center"><div class="big">' + score + " / " + t.parts.length + "</div>"
        + '<div class="flex mt" style="justify-content:center"><button class="primary" id="tbs-retry">Try again</button><a href="#" id="tbs-back" class="btn ghost">Back to list</a></div></div>';
    }
    root.innerHTML = html;

    root.querySelectorAll("[data-part]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var s = window.Store.get("tbs.last." + t.id, {});
        s[inp.getAttribute("data-part")] = inp.value;
        window.Store.set("tbs.last." + t.id, s);
      });
    });

    var checkBtn = root.querySelector("#tbs-check");
    if (checkBtn) {
      checkBtn.addEventListener("click", function () {
        checked = true;
        var s = window.Store.get("tbs.last." + t.id, {});
        var score = t.parts.filter(function (p, i) { return gradePart(p, s[i]); }).length;
        var scores = window.Store.get("tbs.scores", {});
        var prev = scores[t.id];
        if (!prev || score > prev.score) {
          scores[t.id] = { score: score, total: t.parts.length, date: window.App.todayISO() };
          window.Store.set("tbs.scores", scores);
        }
        window.App.render();
      });
    }
    var retry = root.querySelector("#tbs-retry");
    if (retry) {
      retry.addEventListener("click", function () {
        window.Store.set("tbs.last." + t.id, {});
        checked = false;
        window.App.render();
      });
    }
    root.querySelector("#tbs-back").addEventListener("click", function (ev) {
      ev.preventDefault(); openId = null; checked = false; window.App.render();
    });
  }

  window.Views.tbs = function (root) {
    if (openId) renderScenario(root);
    else renderList(root);
  };
})();
