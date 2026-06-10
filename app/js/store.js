/* Persistence layer — namespaced localStorage with JSON values, export/import, reset. */
(function () {
  var PREFIX = "cpaprep.";

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }

  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* quota/SSR */ }
  }

  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch (e) {}
  }

  function allKeys() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) keys.push(k.slice(PREFIX.length));
      }
    } catch (e) {}
    return keys;
  }

  function exportAll() {
    var dump = { _app: "cpa-prep", _exported: new Date().toISOString(), data: {} };
    allKeys().forEach(function (k) { dump.data[k] = get(k, null); });
    return JSON.stringify(dump, null, 2);
  }

  function importAll(json) {
    var parsed = JSON.parse(json); // throws on bad JSON — caller handles
    if (!parsed || parsed._app !== "cpa-prep" || typeof parsed.data !== "object") {
      throw new Error("Not a CPA-Prep export file.");
    }
    Object.keys(parsed.data).forEach(function (k) { set(k, parsed.data[k]); });
    return Object.keys(parsed.data).length;
  }

  function resetAll() {
    allKeys().forEach(remove);
  }

  window.Store = {
    get: get, set: set, remove: remove,
    exportAll: exportAll, importAll: importAll, resetAll: resetAll
  };
})();
