/* Error log — one row per miss, with the rule + decisive fact, pattern analysis, and CSV export. */
(function () {
  "use strict";

  var CATEGORIES = ["content hole", "misread the facts", "timing pressure", "careless", "changed right to wrong"];

  function toCSV(rows) {
    var head = ["date", "section", "area", "topic", "why", "category"];
    var lines = [head.join(",")];
    rows.forEach(function (r) {
      lines.push(head.map(function (k) {
        var v = String(r[k] == null ? "" : r[k]).replace(/"/g, '""');
        return '"' + v + '"';
      }).join(","));
    });
    return lines.join("\n");
  }

  window.ErrorLog = { toCSV: toCSV, CATEGORIES: CATEGORIES };

  window.Views.errors = function (root) {
    var esc = window.App.esc;
    var log = window.Store.get("errorlog", []);

    var html = "<h2>Error Log</h2>"
      + '<p class="lead">The highest-ROI study artifact. One row per miss: the rule, the decisive fact, and WHY you missed. Patterns here are your remediation plan.</p>';

    /* add form */
    html += '<div class="card"><div class="row">'
      + '<div><label class="fld">Section</label><select id="el-section">';
    Object.keys(window.CPA_SECTIONS).forEach(function (s) { html += "<option>" + s + "</option>"; });
    html += "</select></div>"
      + '<div><label class="fld">Blueprint area</label><select id="el-area"></select></div>'
      + '<div><label class="fld">Failure category</label><select id="el-category">';
    CATEGORIES.forEach(function (c) { html += "<option>" + esc(c) + "</option>"; });
    html += "</select></div></div>"
      + '<label class="fld">Topic (blueprint label, e.g., "Leases — classification")</label><input type="text" id="el-topic">'
      + '<label class="fld">Why I missed it — the RULE and the DECISIVE FACT</label><textarea id="el-why" placeholder="Rule: finance lease if any one OWNES criterion met. Decisive fact: 7 of 8 years = major part of economic life. I anchored on the failed 90% PV test and ignored the life test."></textarea>'
      + '<div class="mt"><button class="primary" id="el-add">Log the miss</button></div></div>';

    /* pattern analysis */
    if (log.length) {
      var byCat = {}, bySec = {};
      log.forEach(function (e) {
        byCat[e.category] = (byCat[e.category] || 0) + 1;
        var key = e.section + " · Area " + e.area;
        bySec[key] = (bySec[key] || 0) + 1;
      });
      html += "<h3>Patterns (" + log.length + " misses)</h3><div class=\"grid cols2\">";
      html += '<div class="card"><h3>By failure mode</h3><table class="tbl">';
      Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; }).forEach(function (c) {
        html += "<tr><td>" + esc(c) + "</td><td class=\"right\"><b>" + byCat[c] + "</b></td></tr>";
      });
      html += "</table><p class=\"small muted mt\">Fixes per mode are in <a href=\"" + window.App.kb("../study-plan/04-assessment-remediation.md") + "\">assessment & remediation</a> §4.</p></div>";
      html += '<div class="card"><h3>By blueprint area</h3><table class="tbl">';
      Object.keys(bySec).sort(function (a, b) { return bySec[b] - bySec[a]; }).slice(0, 8).forEach(function (k) {
        html += "<tr><td>" + esc(k) + "</td><td class=\"right\"><b>" + bySec[k] + "</b></td></tr>";
      });
      html += "</table><p class=\"small muted mt\">3+ misses in one area = content hole → re-read that area only, then targeted practice.</p></div>";
      html += "</div>";

      /* table */
      html += '<div class="flex mt"><h3 style="margin:0">All entries</h3><span class="spacer"></span><button id="el-csv">Export CSV</button></div>';
      html += '<div class="card" style="overflow-x:auto"><table class="tbl"><tr><th>Date</th><th>Where</th><th>Topic</th><th>Why</th><th>Mode</th><th></th></tr>';
      log.forEach(function (e, i) {
        html += "<tr><td class=\"small\">" + esc(e.date) + "</td><td class=\"small\"><b>" + esc(e.section) + "</b> " + esc(e.area) + "</td><td class=\"small\">"
          + esc(e.topic) + "</td><td class=\"small\">" + esc(e.why) + "</td><td class=\"small\">" + esc(e.category)
          + '</td><td><button class="ghost small" data-del="' + i + '">✕</button></td></tr>';
      });
      html += "</table></div>";
    } else {
      html += '<div class="notice mt">Empty so far. Log every practice miss — categorize it, state the rule, and name the decisive fact you overlooked. Re-drill on a spaced schedule (next day, +3 days, +1 week).</div>';
    }

    root.innerHTML = html;

    /* area select tracks section */
    var secSel = root.querySelector("#el-section");
    var areaSel = root.querySelector("#el-area");
    function fillAreas() {
      var meta = window.CPA_SECTIONS[secSel.value];
      areaSel.innerHTML = Object.keys(meta.areas).map(function (ar) {
        return '<option value="' + ar + '">Area ' + ar + " — " + esc(meta.areas[ar].label) + "</option>";
      }).join("");
    }
    fillAreas();
    secSel.addEventListener("change", fillAreas);

    root.querySelector("#el-add").addEventListener("click", function () {
      var entry = {
        date: window.App.todayISO(),
        section: secSel.value,
        area: areaSel.value,
        topic: root.querySelector("#el-topic").value.trim() || "(unspecified)",
        why: root.querySelector("#el-why").value.trim() || "(no notes)",
        category: root.querySelector("#el-category").value
      };
      var log2 = window.Store.get("errorlog", []);
      log2.unshift(entry);
      window.Store.set("errorlog", log2);
      window.App.render();
    });

    root.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var log2 = window.Store.get("errorlog", []);
        log2.splice(parseInt(btn.getAttribute("data-del"), 10), 1);
        window.Store.set("errorlog", log2);
        window.App.render();
      });
    });

    var csvBtn = root.querySelector("#el-csv");
    if (csvBtn) {
      csvBtn.addEventListener("click", function () {
        var blob = new Blob([toCSV(window.Store.get("errorlog", []))], { type: "text/csv" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "cpa-error-log-" + window.App.todayISO() + ".csv";
        document.body.appendChild(a); a.click(); a.remove();
      });
    }
  };
})();
