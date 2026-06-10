/* Flashcards — spaced repetition (SM-2-lite) over the deep-dive card deck. */
(function () {
  "use strict";

  var session = null; /* { queue: [card], idx, flipped, reviewed, again } */

  function getSrs() { return window.Store.get("srs", {}); }
  function setSrs(srs) { window.Store.set("srs", srs); }

  /* Rate a card: grade ∈ again|hard|good|easy. Returns updated record. */
  function rate(cardId, grade) {
    var srs = getSrs();
    var rec = srs[cardId] || { interval: 0, ease: 2.5 };
    var today = window.App.todayISO();
    if (grade === "again") {
      rec.ease = Math.max(1.3, rec.ease - 0.2);
      rec.interval = 0;
      rec.due = today; /* stays due; session re-queues it */
    } else if (grade === "hard") {
      rec.ease = Math.max(1.3, rec.ease - 0.15);
      rec.interval = rec.interval === 0 ? 1 : Math.ceil(rec.interval * 1.2);
      rec.due = window.App.addDays(today, rec.interval);
    } else if (grade === "good") {
      rec.interval = rec.interval === 0 ? 1 : (rec.interval === 1 ? 3 : Math.ceil(rec.interval * rec.ease));
      rec.due = window.App.addDays(today, rec.interval);
    } else { /* easy */
      rec.ease = rec.ease + 0.1;
      rec.interval = rec.interval === 0 ? 3 : Math.ceil(rec.interval * rec.ease * 1.3);
      rec.due = window.App.addDays(today, rec.interval);
    }
    srs[cardId] = rec;
    setSrs(srs);
    return rec;
  }

  function buildQueue(sectionFilter, limit) {
    var srs = getSrs();
    var today = window.App.todayISO();
    var due = [], fresh = [];
    (window.CPA_CARDS || []).forEach(function (c) {
      if (sectionFilter !== "ALL" && c.section !== sectionFilter) return;
      var rec = srs[c.id];
      if (!rec) fresh.push(c);
      else if (rec.due <= today) due.push(c);
    });
    /* due first (oldest scheduling assumed fine), then new cards */
    var queue = due.concat(fresh).slice(0, limit);
    return queue;
  }

  window.Flashcards = { rate: rate, buildQueue: buildQueue };

  function renderSetup(root) {
    var esc = window.App.esc;
    var srs = getSrs();
    var today = window.App.todayISO();
    var counts = {};
    Object.keys(window.CPA_SECTIONS).forEach(function (s) { counts[s] = { due: 0, fresh: 0, total: 0 }; });
    (window.CPA_CARDS || []).forEach(function (c) {
      counts[c.section].total++;
      var rec = srs[c.id];
      if (!rec) counts[c.section].fresh++;
      else if (rec.due <= today) counts[c.section].due++;
    });

    var html = "<h2>Flashcards</h2>"
      + '<p class="lead">Spaced repetition over the deep-dive reference sheets. Rate honestly — "Again" re-queues now, "Good"/"Easy" pushes the card days or weeks out.</p>';

    html += '<div class="card"><table class="tbl"><tr><th>Section</th><th>Due</th><th>New</th><th>Total</th></tr>';
    Object.keys(counts).forEach(function (s) {
      html += "<tr><td><b>" + s + "</b> <span class=\"small muted\">" + esc(window.CPA_SECTIONS[s].name) + "</span></td><td>"
        + counts[s].due + "</td><td>" + counts[s].fresh + "</td><td>" + counts[s].total + "</td></tr>";
    });
    html += "</table></div>";

    html += '<div class="card mt"><div class="row">'
      + '<div><label class="fld">Deck</label><select id="fc-section"><option value="ALL">All sections</option>';
    Object.keys(window.CPA_SECTIONS).forEach(function (s) { html += '<option value="' + s + '">' + s + "</option>"; });
    html += "</select></div>"
      + '<div><label class="fld">Cards this session</label><select id="fc-limit"><option>10</option><option selected>20</option><option>40</option><option>9999</option></select></div>'
      + '<div><button class="primary" id="fc-start">Start session</button></div>'
      + "</div></div>";

    root.innerHTML = html;
    root.querySelector("#fc-start").addEventListener("click", function () {
      var queue = buildQueue(root.querySelector("#fc-section").value, parseInt(root.querySelector("#fc-limit").value, 10));
      if (!queue.length) { alert("Nothing due in that deck — come back tomorrow or pick another."); return; }
      session = { queue: queue, idx: 0, flipped: false, reviewed: 0 };
      window.App.render();
    });
  }

  function renderSession(root) {
    var esc = window.App.esc;
    if (session.idx >= session.queue.length) {
      root.innerHTML = "<h2>Flashcards</h2><div class=\"card center\"><h3>Session complete 🎉</h3><p>"
        + session.reviewed + " reviews done.</p><button class=\"primary\" id=\"fc-again\">New session</button></div>";
      root.querySelector("#fc-again").addEventListener("click", function () { session = null; window.App.render(); });
      return;
    }
    var card = session.queue[session.idx];
    var meta = window.CPA_SECTIONS[card.section];
    var html = "<h2>Flashcards</h2>"
      + '<p class="small muted">Card ' + (session.idx + 1) + " of " + session.queue.length + " · click the card to flip</p>"
      + '<div class="flashcard' + (session.flipped ? " back" : "") + '" id="fc-card">'
      + '<div class="meta">' + esc(card.section) + " · Area " + esc(card.area) + " · " + esc(card.tag) + (meta ? " — " + esc(meta.areas[card.area] ? meta.areas[card.area].label : "") : "") + "</div>"
      + '<div class="content">' + esc(session.flipped ? card.back : card.front) + "</div>"
      + (session.flipped ? "" : '<div class="small muted">(front — click to reveal)</div>')
      + "</div>";

    if (session.flipped) {
      html += '<div class="srs-buttons">'
        + '<button class="bad" data-grade="again">Again<br><span class="small">now</span></button>'
        + '<button class="warn" data-grade="hard">Hard<br><span class="small">~1d+</span></button>'
        + '<button class="good" data-grade="good">Good<br><span class="small">1–3d → ×ease</span></button>'
        + '<button class="primary" data-grade="easy">Easy<br><span class="small">3d+ → weeks</span></button>'
        + "</div>";
    }
    html += '<p class="small mt"><a href="#" id="fc-quit">End session</a></p>';
    root.innerHTML = html;

    root.querySelector("#fc-card").addEventListener("click", function () {
      session.flipped = !session.flipped;
      window.App.render();
    });
    root.querySelectorAll("[data-grade]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var grade = btn.getAttribute("data-grade");
        rate(card.id, grade);
        session.reviewed++;
        if (grade === "again") session.queue.push(card); /* re-queue at the end */
        session.idx++;
        session.flipped = false;
        window.App.render();
      });
    });
    root.querySelector("#fc-quit").addEventListener("click", function (ev) {
      ev.preventDefault(); session = null; window.App.render();
    });
  }

  window.Views.cards = function (root) {
    if (session) renderSession(root);
    else renderSetup(root);
  };
})();
