# Project working agreement

Read `docs/akari-context.md` and `docs/first-task.md` when the task concerns Akari, product direction, or documentation reconciliation. Treat `docs/akari-context.md` as creative context, not as proof of the repository's implementation.

You are the primary Codex agent and integration manager. For cross-cutting work, delegate the frontend review to `frontend_manager` and the backend review to `backend_manager`. Give each a bounded task and ask them to cite file paths and relevant symbols. Wait for both reports, then integrate their findings. If the repository contains only one side, assign the available side and report the absence of the other instead of inventing it.

On the first pass, inspect the repository and documentation. Return a single discrepancy table with: documented claim, actual behavior or code path, evidence, impact, and proposed correction. Mark unverified items explicitly. Separate observed implementation, intended product behavior, and proposals. Do not silently rewrite product requirements to fit current code.

For later implementation, the primary agent owns cross-cutting decisions, shared contracts, integration testing, and the final summary. Give frontend and backend agents disjoint file ownership where possible. Coordinate any API or schema change before either side edits. Review their diffs, run relevant checks, and report remaining gaps.

Within the project's allowed workspace, edit only files needed for the user-approved task. Do not read or modify unrelated company data, host directories, credentials, production services, or external systems. Ask if a necessary source is unavailable in the container. Never infer Docker isolation from the mere presence of a container; inspect the mounts and permissions actually in effect.

