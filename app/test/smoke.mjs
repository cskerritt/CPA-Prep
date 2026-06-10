/* Smoke test for the CPA Prep app.
   Run from the repo root:  npm install && npm test
   Spins up a tiny static server (no dependencies), loads the app in jsdom,
   and exercises data integrity, routing, planner, flashcards/SRS, quiz, error log,
   readiness, and export/import. Exits non-zero on any failure. */
import { JSDOM, VirtualConsole } from "jsdom";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = normalize(join(fileURLToPath(import.meta.url), "..", "..", ".."));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".md": "text/markdown" };

const server = http.createServer(async (req, res) => {
  try {
    const path = normalize(join(ROOT, decodeURIComponent(req.url.split("?")[0])));
    if (!path.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    const body = await readFile(path);
    const ext = path.slice(path.lastIndexOf("."));
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("not found");
  }
});
await new Promise((res) => server.listen(0, "127.0.0.1", res));
const BASE = "http://127.0.0.1:" + server.address().port;

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log("PASS " + name);
  else { failures++; console.log("FAIL " + name + (extra ? " — " + extra : "")); }
}

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console, { omitJSDOMErrors: true }); /* drop noisy not-implemented scrollTo */
const dom = await JSDOM.fromURL(BASE + "/app/index.html", {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  virtualConsole
});
const w = dom.window;
w.alert = () => {};
w.confirm = () => true;

await new Promise((res) => {
  if (w.document.readyState === "complete") res();
  else w.addEventListener("load", res);
});
await new Promise((r) => setTimeout(r, 300));

/* ---------- data integrity ---------- */
check("sections loaded", w.CPA_SECTIONS && Object.keys(w.CPA_SECTIONS).length === 6);
check("cards loaded (>=150)", Array.isArray(w.CPA_CARDS) && w.CPA_CARDS.length >= 150, "got " + (w.CPA_CARDS || []).length);
check("questions loaded (>=200)", Array.isArray(w.CPA_QUESTIONS) && w.CPA_QUESTIONS.length >= 200, "got " + (w.CPA_QUESTIONS || []).length);
check("TBS scenarios loaded (>=8)", Array.isArray(w.CPA_TBS) && w.CPA_TBS.length >= 8, "got " + (w.CPA_TBS || []).length);

const qids = new Set(), cids = new Set();
const qProblems = [];
for (const q of w.CPA_QUESTIONS) {
  if (qids.has(q.id)) qProblems.push("dup id " + q.id);
  qids.add(q.id);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) qProblems.push(q.id + " choices!=4");
  if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3)) qProblems.push(q.id + " bad answer idx");
  if (!w.CPA_SECTIONS[q.section]) qProblems.push(q.id + " bad section");
  else if (!w.CPA_SECTIONS[q.section].areas[q.area]) qProblems.push(q.id + " bad area " + q.area);
  if (!q.explanation || q.explanation.length < 20) qProblems.push(q.id + " thin explanation");
}
check("question integrity", qProblems.length === 0, qProblems.slice(0, 5).join("; "));

const cProblems = [];
for (const c of w.CPA_CARDS) {
  if (cids.has(c.id)) cProblems.push("dup id " + c.id);
  cids.add(c.id);
  if (!w.CPA_SECTIONS[c.section]) cProblems.push(c.id + " bad section");
  else if (!w.CPA_SECTIONS[c.section].areas[c.area]) cProblems.push(c.id + " bad area " + c.area);
  if (!c.front || !c.back) cProblems.push(c.id + " missing side");
}
check("card integrity", cProblems.length === 0, cProblems.slice(0, 5).join("; "));

const qBySec = {}, cBySec = {};
w.CPA_QUESTIONS.forEach((q) => (qBySec[q.section] = (qBySec[q.section] || 0) + 1));
w.CPA_CARDS.forEach((c) => (cBySec[c.section] = (cBySec[c.section] || 0) + 1));
console.log("  questions/section:", JSON.stringify(qBySec), "cards/section:", JSON.stringify(cBySec));
check("every section has >=30 questions", Object.keys(w.CPA_SECTIONS).every((s) => (qBySec[s] || 0) >= 30));
check("every section has >=20 cards", Object.keys(w.CPA_SECTIONS).every((s) => (cBySec[s] || 0) >= 20));

/* TBS data integrity */
const tProblems = [];
const tids = new Set();
for (const t of w.CPA_TBS) {
  if (tids.has(t.id)) tProblems.push("dup id " + t.id);
  tids.add(t.id);
  if (!w.CPA_SECTIONS[t.section]) tProblems.push(t.id + " bad section");
  else if (!w.CPA_SECTIONS[t.section].areas[t.area]) tProblems.push(t.id + " bad area");
  if (!t.scenario || t.scenario.length < 40) tProblems.push(t.id + " thin scenario");
  for (const [i, p] of t.parts.entries()) {
    if (p.type === "number" && typeof p.answer !== "number") tProblems.push(t.id + "#" + i + " non-numeric answer");
    if (p.type === "select" && !(Array.isArray(p.choices) && Number.isInteger(p.answer) && p.answer >= 0 && p.answer < p.choices.length)) tProblems.push(t.id + "#" + i + " bad select");
    if (!p.solution || p.solution.length < 10) tProblems.push(t.id + "#" + i + " thin solution");
  }
}
check("TBS integrity", tProblems.length === 0, tProblems.slice(0, 5).join("; "));
check("every section has a TBS scenario", Object.keys(w.CPA_SECTIONS).every((s) => w.CPA_TBS.some((t) => t.section === s)));

/* TBS grading helpers */
check("TBS numeric grading with tolerance", w.TBS.gradePart({ type: "number", answer: 19550 }, "19,550") === true
  && w.TBS.gradePart({ type: "number", answer: 19550 }, "19000") === false
  && w.TBS.gradePart({ type: "number", answer: -2650 }, "(2,650)") === true);
check("TBS select grading", w.TBS.gradePart({ type: "select", answer: 2, choices: ["a", "b", "c"] }, "2") === true
  && w.TBS.gradePart({ type: "select", answer: 2, choices: ["a", "b", "c"] }, "1") === false);

/* ---------- dashboard ---------- */
const view = w.document.getElementById("view");
check("dashboard rendered", /Dashboard/.test(view.innerHTML) && /Flashcards/.test(view.innerHTML));

/* ---------- planner ---------- */
const lengths = { 12: 12, 16: 16, 24: 24 };
let planOK = true, planMsg = "";
for (const len of Object.keys(lengths)) {
  for (const seq of Object.keys(w.CPA_SEQUENCES)) {
    for (const disc of w.CPA_DISCIPLINES) {
      const sched = w.Planner.generate({ length: len, seq, disc, start: "2026-06-08" });
      if (sched.length !== lengths[len]) { planOK = false; planMsg = len + "wk/" + seq + "/" + disc + " gave " + sched.length; }
      if (sched.some((x) => /\{D\}/.test(x.label))) { planOK = false; planMsg = "unsubstituted {D}"; }
      if (sched.some((x) => x.section === "DISC")) { planOK = false; planMsg = "unsubstituted DISC section"; }
    }
  }
}
check("planner generates correct week counts for all 36 combos", planOK, planMsg);

w.Store.set("plan.config", { length: "16", seq: "default", disc: "BAR", start: "2026-06-08" });
w.location.hash = "#/plan";
w.App.render();
check("plan view rendered with 16 weeks", (view.innerHTML.match(/class="week/g) || []).length === 16);
check("plan discipline-window check rendered", /Discipline testing month|administered only/.test(view.innerHTML));

const cb = view.querySelector('input[type="checkbox"][data-wk="0"]');
cb.click();
check("week check-off persisted", w.Store.get("plan.done", {})["0"] === true);

/* ---------- flashcards / SRS ---------- */
const q1 = w.Flashcards.buildQueue("ALL", 5);
check("flashcard queue builds", q1.length === 5);
const rec = w.Flashcards.rate(q1[0].id, "good");
check("SRS good → 1-day interval", rec.interval === 1 && rec.due > new Date().toISOString().slice(0, 10));
const rec2 = w.Flashcards.rate(q1[0].id, "good");
check("SRS second good → 3-day interval", rec2.interval === 3);
const rec3 = w.Flashcards.rate(q1[0].id, "again");
check("SRS again → due today, ease dropped", rec3.interval === 0 && rec3.ease < 2.5);

w.location.hash = "#/cards";
w.App.render();
check("cards view rendered", /Flashcards/.test(view.innerHTML) && /Start session/.test(view.innerHTML));
view.querySelector("#fc-start").click();
check("card session shows a card", view.querySelector(".flashcard") !== null);
view.querySelector("#fc-card").click();
check("card flips to back with rating buttons", view.querySelector(".srs-buttons") !== null);
view.querySelector('[data-grade="good"]').click();
check("rating advances the session", /Card 2 of/.test(view.innerHTML) || /Session complete/.test(view.innerHTML));
const quitLink = view.querySelector("#fc-quit");
if (quitLink) quitLink.click();

/* ---------- quiz ---------- */
w.location.hash = "#/quiz";
w.App.render();
check("quiz setup rendered", /Practice Questions/.test(view.innerHTML));
view.querySelector("#qz-start").click();
check("quiz question rendered", view.querySelectorAll(".choice").length === 4);
const stemText = view.querySelector(".card p b").textContent;
const current = w.CPA_QUESTIONS.find((q) => q.stem === stemText);
check("current question identified", !!current);
view.querySelectorAll(".choice")[current.answer].click();
check("correct answer marked", view.querySelector(".choice.correct") !== null && /Correct\./.test(view.innerHTML));
const stats = w.Store.get("quiz.stats", {});
check("quiz stats recorded", stats[current.section] && stats[current.section].total >= 1 && stats[current.section].correct >= 1);
view.querySelector("#qz-next").click();
const stem2 = view.querySelector(".card p b").textContent;
const cur2 = w.CPA_QUESTIONS.find((q) => q.stem === stem2);
view.querySelectorAll(".choice")[(cur2.answer + 1) % 4].click();
check("wrong answer shows explanation", /Not quite/.test(view.innerHTML));
view.querySelector("#qz-log").click();
check("miss logged to error log from quiz", w.Store.get("errorlog", []).length === 1);
view.querySelector("#qz-quit").click();

/* ---------- TBS view ---------- */
w.location.hash = "#/tbs";
w.App.render();
check("TBS list rendered with all scenarios", (view.innerHTML.match(/data-open=/g) || []).length === w.CPA_TBS.length);
view.querySelector('[data-open="TBS-REG-1"]').click();
check("TBS scenario opened", /Partner basis/.test(view.innerHTML) && view.querySelectorAll("[data-part]").length === 4);
const tbsScn = w.CPA_TBS.find((t) => t.id === "TBS-REG-1");
view.querySelectorAll("[data-part]").forEach((inp, i) => {
  inp.value = String(tbsScn.parts[i].answer);
  inp.dispatchEvent(new w.Event("change", { bubbles: true }));
});
view.querySelector("#tbs-check").click();
check("TBS all-correct score shown", new RegExp("4 / 4").test(view.innerHTML));
const tbsScores = w.Store.get("tbs.scores", {});
check("TBS best score persisted", tbsScores["TBS-REG-1"] && tbsScores["TBS-REG-1"].score === 4);
view.querySelector("#tbs-back").click();
check("TBS back to list shows best score", /4\/4 ✅/.test(view.innerHTML));

/* ---------- error log ---------- */
w.location.hash = "#/errors";
w.App.render();
check("error log lists the quiz miss", /Missed practice question/.test(view.innerHTML));
view.querySelector("#el-topic").value = "Leases — classification";
view.querySelector("#el-why").value = "Anchored on PV test, ignored economic-life test.";
view.querySelector("#el-add").click();
check("manual error entry added", w.Store.get("errorlog", []).length === 2);
const csv = w.ErrorLog.toCSV(w.Store.get("errorlog", []));
check("CSV export has header + 2 rows", csv.split("\n").length === 3);

/* ---------- readiness ---------- */
w.location.hash = "#/readiness";
w.App.render();
check("readiness rendered with 9 foundations", (view.innerHTML.match(/data-v="red"/g) || []).length === 9);
view.querySelector('[data-f="bookkeeping"][data-v="green"]').click();
check("foundation rating persisted", w.Store.get("foundations", {}).bookkeeping === "green");
w.Store.set("readiness", { FAR: { mix: "78", mock1: "80", mock2: "76", tbs: true } });
w.App.render();
check("FAR shows GO verdict", /GO — book it/.test(view.innerHTML));

/* ---------- export / import ---------- */
const dump = w.Store.exportAll();
w.Store.resetAll();
check("reset clears stats", w.Store.get("quiz.stats", null) === null);
const n = w.Store.importAll(dump);
check("import restores keys", n > 0 && w.Store.get("errorlog", []).length === 2);

/* ---------- routing ---------- */
w.location.hash = "#/nonsense";
w.App.render();
check("unknown route falls back to dashboard", /Dashboard/.test(view.innerHTML));

server.close();
console.log(failures === 0 ? "\nALL SMOKE TESTS PASSED" : "\n" + failures + " FAILURES");
process.exit(failures ? 1 : 0);
