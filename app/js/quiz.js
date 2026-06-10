/* Practice quiz — blueprint-tagged MCQs with immediate feedback and per-area stat tracking. */
(function () {
  "use strict";

  var quiz = null; /* { items, idx, answered (null|choiceIdx), correct, missed: [item] } */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function recordResult(q, isCorrect) {
    var stats = window.Store.get("quiz.stats", {});
    var s = stats[q.section] || { total: 0, correct: 0, areas: {} };
    s.total++; if (isCorrect) s.correct++;
    var a = s.areas[q.area] || { total: 0, correct: 0 };
    a.total++; if (isCorrect) a.correct++;
    s.areas[q.area] = a;
    stats[q.section] = s;
    window.Store.set("quiz.stats", stats);
  }

  function pickQuestions(section, area, count) {
    var pool = (window.CPA_QUESTIONS || []).filter(function (q) {
      if (section !== "ALL" && q.section !== section) return false;
      if (area !== "ALL" && q.area !== area) return false;
      return true;
    });
    return shuffle(pool).slice(0, count);
  }

  window.Quiz = { pickQuestions: pickQuestions, recordResult: recordResult };

  function renderSetup(root) {
    var esc = window.App.esc;
    var stats = window.Store.get("quiz.stats", {});
    var html = "<h2>Practice Questions</h2>"
      + '<p class="lead">Original blueprint-tagged MCQs built from the deep-dive sheets — with explanations. These supplement (never replace) your review course’s bank.</p>';

    /* per-area stats table */
    html += '<div class="card"><table class="tbl"><tr><th>Section / area</th><th>Accuracy</th><th>Attempts</th></tr>';
    Object.keys(window.CPA_SECTIONS).forEach(function (sec) {
      var s = stats[sec];
      var pctS = s && s.total ? window.App.pct(s.correct, s.total) + "%" : "—";
      html += "<tr><td><b>" + sec + "</b></td><td>" + pctS + "</td><td>" + (s ? s.total : 0) + "</td></tr>";
      var meta = window.CPA_SECTIONS[sec];
      Object.keys(meta.areas).forEach(function (ar) {
        var a = s && s.areas && s.areas[ar];
        if (!a) return;
        html += '<tr><td class="small muted" style="padding-left:26px">Area ' + ar + " — " + esc(meta.areas[ar].label) + " <span class=\"badge gray\">" + esc(meta.areas[ar].weight) + "</span></td><td class=\"small\">"
          + window.App.pct(a.correct, a.total) + "%</td><td class=\"small\">" + a.total + "</td></tr>";
      });
    });
    html += "</table><p class=\"small muted mt\">Readiness rule of thumb: 65–70% after first study of a topic → 70–75% per area on timed mixed sets → 75–80% two weeks before the sit.</p></div>";

    html += '<div class="card mt"><div class="row">'
      + '<div><label class="fld">Section</label><select id="qz-section"><option value="ALL">Mixed — all sections</option>';
    Object.keys(window.CPA_SECTIONS).forEach(function (s) { html += '<option value="' + s + '">' + s + "</option>"; });
    html += "</select></div>"
      + '<div><label class="fld">Area</label><select id="qz-area"><option value="ALL">All areas</option></select></div>'
      + '<div><label class="fld">Questions</label><select id="qz-count"><option>5</option><option selected>10</option><option>20</option><option>9999</option></select></div>'
      + '<div><button class="primary" id="qz-start">Start quiz</button></div>'
      + "</div></div>";

    root.innerHTML = html;

    var secSel = root.querySelector("#qz-section");
    var areaSel = root.querySelector("#qz-area");
    secSel.addEventListener("change", function () {
      var html2 = '<option value="ALL">All areas</option>';
      if (secSel.value !== "ALL") {
        var meta = window.CPA_SECTIONS[secSel.value];
        Object.keys(meta.areas).forEach(function (ar) {
          html2 += '<option value="' + ar + '">Area ' + ar + " — " + esc(meta.areas[ar].label) + "</option>";
        });
      }
      areaSel.innerHTML = html2;
    });

    root.querySelector("#qz-start").addEventListener("click", function () {
      var items = pickQuestions(secSel.value, areaSel.value, parseInt(root.querySelector("#qz-count").value, 10));
      if (!items.length) { alert("No questions match that filter yet."); return; }
      quiz = { items: items, idx: 0, answered: null, correct: 0, missed: [] };
      window.App.render();
    });
  }

  function renderQuestion(root) {
    var esc = window.App.esc;
    if (quiz.idx >= quiz.items.length) { renderSummary(root); return; }
    var q = quiz.items[quiz.idx];
    var answered = quiz.answered !== null;

    var html = "<h2>Practice Questions</h2>"
      + '<p class="small muted">Question ' + (quiz.idx + 1) + " of " + quiz.items.length
      + " · " + esc(q.section) + " Area " + esc(q.area) + " · " + esc(q.topic)
      + " · score so far: " + quiz.correct + "/" + quiz.idx + "</p>"
      + '<div class="card"><p style="font-size:16px"><b>' + esc(q.stem) + "</b></p>";

    q.choices.forEach(function (choice, i) {
      var cls = "choice";
      if (answered) {
        if (i === q.answer) cls += " correct";
        else if (i === quiz.answered) cls += " wrong";
        else cls += " dim";
      }
      html += '<button class="' + cls + '" data-choice="' + i + '"' + (answered ? " disabled" : "") + ">"
        + String.fromCharCode(65 + i) + ". " + esc(choice) + "</button>";
    });

    if (answered) {
      html += '<div class="explanation"><b>' + (quiz.answered === q.answer ? "Correct." : "Not quite — the answer is " + String.fromCharCode(65 + q.answer) + ".") + "</b> "
        + esc(q.explanation) + "</div>"
        + '<div class="flex mt"><button class="primary" id="qz-next">' + (quiz.idx + 1 >= quiz.items.length ? "See results" : "Next question") + "</button>"
        + (quiz.answered !== q.answer ? '<button class="ghost" id="qz-log">Add to error log</button>' : "")
        + "</div>";
    }
    html += "</div>"
      + '<p class="small mt"><a href="#" id="qz-quit">Quit quiz</a></p>';
    root.innerHTML = html;

    if (!answered) {
      root.querySelectorAll(".choice").forEach(function (btn) {
        btn.addEventListener("click", function () {
          quiz.answered = parseInt(btn.getAttribute("data-choice"), 10);
          var isCorrect = quiz.answered === q.answer;
          if (isCorrect) quiz.correct++;
          else quiz.missed.push(q);
          recordResult(q, isCorrect);
          window.App.render();
        });
      });
    } else {
      root.querySelector("#qz-next").addEventListener("click", function () {
        quiz.idx++; quiz.answered = null; window.App.render();
      });
      var logBtn = root.querySelector("#qz-log");
      if (logBtn) {
        logBtn.addEventListener("click", function () {
          var log = window.Store.get("errorlog", []);
          log.unshift({
            date: window.App.todayISO(), section: q.section, area: q.area,
            topic: q.topic, why: "Missed practice question " + q.id + ": " + q.explanation.slice(0, 140),
            category: "content hole"
          });
          window.Store.set("errorlog", log);
          logBtn.textContent = "Logged ✓"; logBtn.disabled = true;
        });
      }
    }
    root.querySelector("#qz-quit").addEventListener("click", function (ev) {
      ev.preventDefault(); quiz = null; window.App.render();
    });
  }

  function renderSummary(root) {
    var esc = window.App.esc;
    var p = window.App.pct(quiz.correct, quiz.items.length);
    var verdict;
    if (p >= 75) verdict = "At or above the pre-sit target band (75–80%). Keep mixing and add the clock.";
    else if (p >= 65) verdict = "In the learning band (65–75%). Re-teach every miss, then re-drill this area.";
    else verdict = "Below the topic floor (65%). Re-read the blueprint area and deep-dive sheet before more questions.";

    var html = "<h2>Quiz Results</h2>"
      + '<div class="card center"><div class="big">' + quiz.correct + " / " + quiz.items.length + " (" + p + "%)</div>"
      + '<div class="progressbar mt ' + window.App.barClass(p, 75) + '"><div style="width:' + p + '%"></div></div>'
      + '<p class="mt">' + esc(verdict) + "</p>"
      + '<button class="primary" id="qz-new">New quiz</button></div>';

    if (quiz.missed.length) {
      html += "<h3>Review your misses</h3>";
      quiz.missed.forEach(function (q) {
        html += '<div class="card mb"><p class="small muted">' + esc(q.section) + " Area " + esc(q.area) + " · " + esc(q.topic) + "</p>"
          + "<p><b>" + esc(q.stem) + "</b></p>"
          + '<p class="small">Answer: <b>' + String.fromCharCode(65 + q.answer) + ". " + esc(q.choices[q.answer]) + "</b></p>"
          + '<div class="explanation">' + esc(q.explanation) + "</div></div>";
      });
    }
    root.innerHTML = html;
    root.querySelector("#qz-new").addEventListener("click", function () { quiz = null; window.App.render(); });
  }

  window.Views.quiz = function (root) {
    if (quiz) renderQuestion(root);
    else renderSetup(root);
  };
})();
