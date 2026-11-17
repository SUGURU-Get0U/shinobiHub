# Akari Codex handoff

Copy `AGENTS.md`, `.codex/`, and `docs/` into the root of your project, preserving the directory structure. Open a new Codex CLI session from that root inside your Docker environment. Project-scoped custom agents are loaded from `.codex/agents/`; existing sessions may need a restart after adding them.

Run the first prompt in `docs/first-task.md`. It asks Codex to inspect the actual repository and reconcile the documentation with code before implementation. This pack contains no claims about your project's current stack or architecture.

The images are not included in this pack. Export the approved Akari images from this conversation to a project asset folder only if you want them in the app. Record the selected filenames in `docs/akari-context.md`. The outfit variants and avatar poses are exploratory; none is designated the production design yet.

The Docker container only sees files and services mounted or exposed to it. Review its bind mounts, secrets, and network access before starting Codex; Codex and its subagents inherit the parent session's permissions. Keep the project mount narrow and avoid mounting company folders that are unrelated to this project.

