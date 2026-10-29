import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  exampleTasks,
  feelings,
  localDateInput,
  needsReview,
  newTask,
  progresses,
  validateTask,
} from "./src/tasks";
import type { Task } from "./src/tasks";
import "./board.css";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const [draft, setDraft] = useState<Task | null>(null);
  const [original, setOriginal] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [health, setHealth] = useState("Checking API…");
  const [retry, setRetry] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch(`${apiUrl}/api/health/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok || (await response.json()).status !== "ok")
          throw new Error();
        if (active) setHealth("API connected");
      })
      .catch(() => { if (active) setHealth("API unavailable"); })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [retry]);

  useEffect(() => {
    if (draft && !dialog.current?.open) dialog.current?.showModal();
  }, [draft]);

  function open(task: Task) {
    opener.current = document.activeElement as HTMLElement;
    // Copy the card: changing the draft must not mutate the saved version.
    setDraft({ ...task });
    setOriginal(JSON.stringify(task));
    setError("");
  }
  function close() {
    dialog.current?.close();
    setDraft(null);
    opener.current?.focus();
  }
  function requestClose() {
    if (
      JSON.stringify(draft) === original ||
      window.confirm("Discard your unsaved changes?")
    )
      close();
  }
  function update<K extends keyof Task>(key: K, value: Task[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : null));
  }
  function save() {
    if (!draft) return;
    const problem = validateTask(draft);
    if (problem) {
      setError(problem);
      return;
    }
    setTasks((current) =>
      current.some((task) => task.id === draft.id)
        ? current.map((task) =>
            task.id === draft.id
              ? { ...draft, title: draft.title.trim() }
              : task,
          )
        : [...current, { ...draft, title: draft.title.trim() }],
    );
    close();
  }

  const overdue = tasks.filter((task) => needsReview(task, now)).length;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#board">
          <span className="brand-symbol">忍</span>
          <span>
            SHINOBI<small>PERSONAL WORKSPACE</small>
          </span>
        </a>
        <div className="nav-label">YOUR SPACE</div>
        <a className="nav-item active" href="#board">
          ◈ &nbsp; Personal board <span>01</span>
        </a>
        <div className="sidebar-art" aria-hidden="true">
          <div className="energy-box" />
          <span>HADŌ / 90</span>
        </div>
        <div className="sidebar-footer">
          A little structure.
          <br />
          Space for your mind.
        </div>
      </aside>
      <main id="board">
        <header className="topbar">
          <span>
            WORKSPACE <span className="muted">/ Personal board</span>
          </span>
          <button
            className="api-status"
            onClick={() => { setHealth("Checking API…"); setRetry((value) => value + 1); }}
            title="Retry API connection"
          >
            ● {health}
          </button>
        </header>
        <section className="hero">
          <div className="eyebrow">YOUR MIND. YOUR PACE.</div>
          <h1>
            Bring order to
            <br />
            <span>your inner chaos.</span>
          </h1>
          <p>A place for your tasks, your feelings, and the next small step.</p>
          <div className="hero-bottom">
            <span className="demo-badge">
              FICTIONAL DATA · RESETS ON REFRESH
            </span>
            <button className="primary" onClick={() => open(newTask())}>
              ＋ Create card
            </button>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
        </section>
        <section className="board-heading">
          <div>
            <div className="eyebrow">MAKE ROOM FOR WHAT MATTERS</div>
            <h2>
              My task board <span>{tasks.length}</span>
            </h2>
          </div>
          <span className="review-count">{overdue} awaiting review</span>
        </section>
        <div className="board-columns">
          {progresses.map((progress) => (
            <section className="column" key={progress} aria-label={progress}>
              <h3>
                <span
                  className={`status-dot ${progress === "Done" ? "done" : ""}`}
                />{" "}
                {progress}
                <span>
                  {tasks.filter((task) => task.progress === progress).length}
                </span>
              </h3>
              {tasks
                .filter((task) => task.progress === progress)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    overdue={needsReview(task, now)}
                    onOpen={() => open(task)}
                  />
                ))}
              {!tasks.some((task) => task.progress === progress) && (
                <div className="empty-column">Room for your next step</div>
              )}
            </section>
          ))}
        </div>
        <footer className="board-footer">
          Progress is a state. A feeling is information. Neither defines you.
        </footer>
      </main>
      <dialog
        ref={dialog}
        className="detail-panel"
        aria-labelledby="panel-title"
        onCancel={(event) => {
          event.preventDefault();
          requestClose();
        }}
      >
        {draft && (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <div className="panel-header">
              <div>
                <div className="eyebrow">MAKE IT YOURS</div>
                <h2 id="panel-title">Card details</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close details"
                onClick={requestClose}
              >
                ✕
              </button>
            </div>
            <p className="muted">
              Changes stay in this draft until you press Save.
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <label>
              Title *
              <input
                autoFocus
                required
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
              />
            </label>
            <label>
              Ticket / task reference
              <input
                placeholder="e.g. DEMO-013 or a fictional URL"
                value={draft.reference}
                onChange={(event) => update("reference", event.target.value)}
              />
            </label>
            <div className="field-pair">
              <label>
                Progress
                <select
                  value={draft.progress}
                  onChange={(event) =>
                    update("progress", event.target.value as Task["progress"])
                  }
                >
                  {progresses.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Feeling
                <select
                  value={draft.feeling}
                  onChange={(event) =>
                    update("feeling", event.target.value as Task["feeling"])
                  }
                >
                  {feelings.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="field-pair">
              <label>
                Priority
                <input
                  list="priorities"
                  value={draft.priority}
                  onChange={(event) => update("priority", event.target.value)}
                />
                <datalist id="priorities">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </datalist>
              </label>
              <label>
                Planned for
                <select
                  value={draft.bucket}
                  onChange={(event) => update("bucket", event.target.value)}
                >
                  {["Today", "Tomorrow", "This week", "Later"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Review deadline * <small>Your browser’s local time</small>
              <input
                type="datetime-local"
                required
                value={localDateInput(draft.deadline)}
                onChange={(event) => {
                  const date = new Date(event.target.value);
                  update(
                    "deadline",
                    Number.isFinite(date.getTime()) ? date.toISOString() : "",
                  );
                }}
              />
            </label>
            <div className="quick-times">
              {[10, 60, 1440].map((minutes) => (
                <button
                  type="button"
                  key={minutes}
                  onClick={() =>
                    update(
                      "deadline",
                      new Date(Date.now() + minutes * 60000).toISOString(),
                    )
                  }
                >
                  {minutes === 10
                    ? "In 10 minutes"
                    : minutes === 60
                      ? "In 1 hour"
                      : "In 24 hours"}
                </button>
              ))}
            </div>
            <label>
              Waiting on
              <input
                value={draft.waitingOn}
                placeholder="Fictional person or team"
                onChange={(event) => update("waitingOn", event.target.value)}
              />
            </label>
            <label>
              What do you need from them?
              <textarea
                rows={2}
                value={draft.dependency}
                onChange={(event) => update("dependency", event.target.value)}
              />
            </label>
            <div className="field-pair">
              <label>
                Card accent / background
                <input
                  type="color"
                  value={draft.color}
                  onChange={(event) => update("color", event.target.value)}
                />
              </label>
              <label>
                Card size
                <select
                  value={draft.size}
                  onChange={(event) =>
                    update("size", event.target.value as Task["size"])
                  }
                >
                  <option>Compact</option>
                  <option>Comfortable</option>
                </select>
              </label>
            </div>
            <div className="panel-actions">
              <button type="button" className="secondary" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="primary">
                Save card
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}

function TaskCard({
  task,
  overdue,
  onOpen,
}: {
  task: Task;
  overdue: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      className={`task-card ${task.size === "Compact" ? "compact" : ""}`}
      style={{ "--accent": task.color } as CSSProperties}
      onClick={onOpen}
    >
      <div className="card-top">
        <span>{task.reference || "PERSONAL TASK"}</span>
        <span>↗</span>
      </div>
      <h4>{task.title}</h4>
      {task.size !== "Compact" && (
        <p>{task.description || "Your next small step starts here."}</p>
      )}
      <div className="tags">
        <span>{task.priority || "No priority"}</span>
        <span>{task.bucket}</span>
      </div>
      {task.feeling !== "No label" && (
        <div className="feeling">☾ {task.feeling}</div>
      )}
      {task.waitingOn && (
        <div className="waiting">Waiting on: {task.waitingOn}</div>
      )}
      <div className={`card-deadline ${overdue ? "overdue" : ""}`}>
        {overdue ? "◷ Review needed · " : "◷ Review · "}
        {new Date(task.deadline).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      {overdue && (
        <div className="review-prompt">
          How is this task going? Open to update.
        </div>
      )}
    </button>
  );
}
