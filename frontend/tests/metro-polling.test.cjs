/* global __dirname */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

// Running with --require ../scripts/metro-polling.cjs exercises the bridge even
// on mounts where fs.watch emits no native events.
test("polling reports saved, created and deleted files without changing their contents", async () => {
  const directory = fs.mkdtempSync(path.join(__dirname, ".polling-"));
  const file = path.join(directory, "screen.tsx");
  fs.writeFileSync(file, "before");
  const watcher = fs.watch(directory);
  async function observe(name, mutate) {
    const received = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { watcher.off("change", onChange); reject(new Error(`No event for ${name}`)); }, 6000);
      function onChange(event, filename) {
        if (String(filename) !== name) return;
        clearTimeout(timeout);
        watcher.off("change", onChange);
        resolve(event);
      }
      watcher.on("change", onChange);
    });
    mutate();
    return received;
  }
  try {
    await observe("screen.tsx", () => fs.writeFileSync(file, "after editing"));
    assert.equal(fs.readFileSync(file, "utf8"), "after editing");
    const added = path.join(directory, "new.css");
    assert.equal(await observe("new.css", () => fs.writeFileSync(added, "body {}")), "rename");
    assert.equal(await observe("new.css", () => fs.unlinkSync(added)), "rename");
  } finally {
    watcher.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
