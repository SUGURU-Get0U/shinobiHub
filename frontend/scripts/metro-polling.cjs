// Bind mounts can omit filesystem events. Add polling only to Metro's existing
// watchers inside this frontend, leaving dependencies and generated files alone.
/* global __dirname */
const { Buffer } = require("node:buffer");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const excluded = new Set(["node_modules", ".git", ".expo", "dist", "test-results", "playwright-report"]);
const originalWatch = fs.watch;

function included(directory) {
  const relative = path.relative(root, directory);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative) && !relative.split(path.sep).some((part) => excluded.has(part));
}

function snapshot(directory) {
  const entries = new Map();
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    try {
      const stat = fs.lstatSync(path.join(directory, entry.name));
      // Directory mtimes are not content changes. New/deleted directories are
      // still included so Metro can add/remove their own recursive watchers.
      entries.set(entry.name, stat.isDirectory() ? "directory" : `${stat.mtimeMs}:${stat.size}:${stat.ino}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return entries;
}

fs.watch = function watch(filename, options, listener) {
  const watcher = originalWatch.apply(this, arguments);
  if (typeof filename !== "string" && !Buffer.isBuffer(filename)) return watcher;
  const directory = path.resolve(String(filename));
  if (!included(directory)) return watcher;

  let previous;
  try {
    if (!fs.statSync(directory).isDirectory()) return watcher;
    previous = snapshot(directory);
  } catch {
    return watcher;
  }

  const interval = setInterval(() => {
    try {
      const current = snapshot(directory);
      for (const name of new Set([...previous.keys(), ...current.keys()])) {
        if (previous.get(name) === current.get(name)) continue;
        const event = previous.has(name) && current.has(name) ? "change" : "rename";
        const encodedName = options?.encoding === "buffer" ? Buffer.from(name) : name;
        watcher.emit("change", event, encodedName);
      }
      previous = current;
    } catch (error) {
      // A deleted watched directory will be handled by its parent's watcher.
      if (error.code === "ENOENT") return;
      clearInterval(interval);
      watcher.emit("error", error);
    }
  }, 1000);
  interval.unref();
  watcher.once("close", () => clearInterval(interval));
  return watcher;
};
