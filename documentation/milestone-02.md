# Milestone 02 — Validate the existing board

Date: 2026-11-12.

Status: completed for the existing web board and the verification scope below.

## Scope

Reconcile the documentation with the repository, restore the development tools,
and verify the existing personal board. This milestone does not add persistence,
Akari modules, integrations, dashboards or native screens. Implemented prototype
choices are not automatically final product decisions.

The primary agent coordinates documentation and integration. `frontend_manager`
owns frontend validation and browser acceptance fixes. `backend_manager` owns
backend/runtime validation and container browser prerequisites.

## Architecture and entry points

- `frontend/package.json` selects `index.ts`, which registers `App`. Web resolves
  `App.web.tsx`; native resolves the placeholder `App.tsx`.
- `App.web.tsx` owns task/draft state, the review clock and the health request.
  `src/tasks.ts` defines the task type and validation/date helpers; `board.css`
  supplies the responsive layout and motion. Tasks reset on refresh.
- `backend/manage.py` is Django's CLI entry. `config/urls.py` exposes health and
  built-in admin. `config/views.py::health` returns application liveness, not DB
  readiness. `LocalHealthCorsMiddleware` allows only two local Expo origins.
- PostgreSQL is configured through five required `DB_*` variables. No task models,
  task API, application login flow, background jobs or external integrations exist.
- Compose configures Python 3.13, Node 22 and PostgreSQL 17. Configuration alone
  does not establish actual runtime mounts, isolation or migration state.

## Reconciliation decisions

| Previous statement | Repository evidence | Correction or remaining decision |
| --- | --- | --- |
| Expo version will be selected later | `frontend/package.json` declares SDK 58 | Root README now records the declared SDK. |
| Migrations have not been applied | Migration state belongs to a specific database | Root README now describes `showmigrations` rather than asserting state. |
| Creation/editing is future work | `App.web.tsx::open`, `save`, `close` | Product plan now records local draft editing; API-backed saving remains future work. |
| Waiting/dependency fields are unimplemented | `Task.waitingOn`, `Task.dependency`, progress list | Record provisional implementation; separate follow-up date remains proposed. |
| Deadline shortcuts and reminders are only proposed | Detail panel shortcuts, `needsReview`, 15-second clock | Record local implementation and browser timezone behavior; persistence/background delivery remain absent. |
| Small-screen/dirty-close behavior is undesigned | Responsive CSS and `requestClose` | Document current provisional drawer and Escape/X confirmation; Cancel explicitly discards. |
| Priority choice is entirely unresolved | Free-text input with datalist suggestions | Record current behavior while retaining final semantics/ordering as open decisions. |
| No stack has been finalized | Existing Expo/Django baseline | Akari context now limits undecided architecture to Akari-specific additions. |
| Expo Router is required | Existing single-screen `index.ts`/`App` entry has no Router | Open working-agreement deviation. No routing migration or silent policy exception in this milestone. |
| Historical checks passed | Prior milestone's recorded results | Preserve historical evidence separately from the fresh validation below. |

The web-only/native-placeholder distinction already agrees with the milestone
and run guide. Mobile support remains a direction rather than completed behavior.
Akari's focus task, idea capture, Japanese practice and notebook remain candidates;
no avatar has been selected or integrated.

## Validation

Historical Milestone 01 results are not evidence of the current environment's state.
Fresh validation uses the existing lockfile; no automatic dependency downgrade
or product architecture change is part of this milestone.

Frontend reproducibility changes:

- Playwright starts `node tests/serve-web.mjs` on `127.0.0.1:8081`. The server
  serves only `dist`, rejects paths outside that directory and disables caching.
  Host Python is no longer required for frontend E2E checks.
- Tests do not reuse a running server, avoiding accidental checks against a stale
  build or a separate Expo process.
- Browser acceptance coverage now checks required title/deadline, Save/Cancel,
  progress/feeling independence, editable card fields, overdue/Done behavior,
  dirty-draft confirmation, keyboard focus, reduced motion and a small-screen panel.
- Executing the previously unverified suite exposed exact-label selector failures
  for comboboxes and a race in the API-failure setup. Tests now select controls by
  accessible role/name and wait for the initial connection before simulating a
  failure. Keyboard coverage verifies the dialog's actual first-control focus,
  focus containment and restoration rather than assuming initial title focus.
- The development Dockerfile installs Chromium OS libraries at build time using
  Playwright 1.64.1, aligned with the current lockfile. Browser binaries are still
  installed as the regular user. Container security settings are unchanged.

Frontend environment: Windows host, Node 26.13.1, dependencies restored with
`npm ci`. Backend environment: rebuilt Compose development image, Python 3.13.18,
Node 22.23.5, npm 10.9.9, Django 5.2.19 and PostgreSQL 17.12.

| Check | Fresh outcome |
| --- | --- |
| `docker compose -f .devcontainer/compose.yaml config --quiet` | Passed. |
| Development image build including pinned Chromium OS dependencies | Passed. |
| `python backend/manage.py check` | Passed with no issues. |
| `python backend/manage.py test config --noinput` | All 3 backend tests passed. |
| Explicit PostgreSQL connection check | Passed. |
| `python backend/manage.py showmigrations` | All 18 built-in migrations unapplied in this local database; none applied during validation. |
| Live health request and local CORS checks | HTTP 200 with expected JSON; local origin allowed and unrelated origin rejected. |
| `npm ci` | Dependencies restored from the existing lockfile. |
| `npm run lint` and `npm run typecheck` | Passed; repeated after final browser-test edits. |
| `npm run test:model` | All 3 model tests passed. |
| Web export through `npm run test:e2e` | Passed. |
| Five board acceptance tests | All passed across the corrected run and targeted reruns after fixing test selectors/focus assumptions. |
| `SHINOBI_LIVE_API=1 npx playwright test` | Real Django browser integration passed; no response mocking in the live test. |

Runtime inspection found the project bind mount and the named Codex state volume
on `dev`, and only the named PostgreSQL data volume on `db`. The development
service ran as `dev` with `no-new-privileges` and all capabilities dropped. No
PostgreSQL port was published. A temporary loopback-only `127.0.0.1:8000` mapping
enabled the host-browser integration check. These observations describe this run,
not a general network-isolation guarantee.

Cleanup stopped the temporary Django server, deleted the validation Compose
override, and recreated `dev` using the default configuration with no published
ports. Python dependencies were restored afterwards; Django checks and all three
backend tests passed again. The development and healthy database containers remain
running, with their persistent volumes preserved.

Browser verification used Playwright Chromium on Windows. The full corrected
run passed the live test and three board tests; the remaining two board tests
passed targeted reruns after further test corrections. This is not a claim that
one final invocation passed all six at once. Native screens and other browser
engines were not verified. The rebuilt Linux image's Chromium OS-library setup
passed, but the browser suite itself ran on the Windows host.

No application behavior or backend API changed. Fresh browser checks replace the
previously unverified acceptance status for the covered flows; persistence,
background notifications, task APIs and Akari features remain outside this milestone.

The fresh `npm audit --json` reports 16 findings: 1 low, 13 moderate and 2 high
(0 critical). The high entries are `zod` and its dependent `@expo/cli`. This
differs from the historical Milestone 01 audit. No force fix, Expo downgrade or
lockfile change was applied; dependency remediation remains separate work.
