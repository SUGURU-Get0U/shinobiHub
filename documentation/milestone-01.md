# Milestone 01 — Personal board prototype

Status: prototype implemented; browser acceptance checks pending container browser dependencies.

## Goal and scope

Build the first Expo web screen: a personal board with fictional cards, a detail
panel, independent progress and feelings, mandatory review deadlines, and explicit
Save/Cancel. Explore purple/gold energy and depth inspired by Hado 90. Character
models and full 3D scenes come later.

Cards are held in React memory for this milestone. Refreshing resets the examples.
There is no task database API or external integration yet. Django supplies only
the existing health endpoint.

## Steps and learning checkpoints

1. Scaffold Expo with the blank TypeScript template. TypeScript describes the
   shape of a task so incorrect field names and values can be caught before runtime.
2. Define the task model and fictional examples. Progress and feelings are separate
   fields: changing one must not silently overwrite the other.
3. Render reusable cards. A component receives data (props) and displays it.
4. Open a detail panel with a draft copy. React state remembers the current cards
   and the draft. Save validates and replaces a card; Cancel discards the draft.
5. Compare deadlines with the current time. Overdue unfinished cards ask for a
   review without changing status or blocking edits. The browser's timezone is
   used for input/display; deadlines are stored as ISO timestamps in memory.
6. Add a health request with loading, connected and unavailable states. Allow only
   the local Expo web origins to read this health response across origins.
7. Add CSS depth/glow with reduced-motion support, then verify the build and behavior.

Questions to explore while testing:

- Why should Cancel leave the original title unchanged?
- Why must a missing deadline prevent Save even when the input looks optional?
- Why is an overdue card different from a procrastinating feeling?
- What disappears on refresh, and what would a database change about that?

## Acceptance checks

- Open a fictional card, change its title, Cancel: the board stays unchanged.
- Edit and Save: the board reflects the changes.
- Create a card: title and review deadline are required.
- Set an overdue deadline: a review reminder appears unless progress is Done.
- Change progress without changing feelings, and vice versa.
- Edit reference, priority, time bucket, dependency, color and size in the panel.
- Stop Django and retry the health check: show an unavailable state.
- Navigate using a keyboard; Escape closes a clean draft and asks before discarding
  unsaved changes. Enable reduced motion to suppress decorative movement.

Validation results are recorded below.

## Read the code with these concepts in mind

- `frontend/src/tasks.ts`: `Task` is a TypeScript type, similar in purpose to a
  Python typed record. `progress: typeof progresses[number]` allows only a value
  from the progress list. A `string` field accepts text. Types help during
  development; `validateTask` still checks actual input when Save is pressed.
- `frontend/App.web.tsx`: `useState` keeps information between renders. `tasks`
  contains saved cards; `draft` is either an editable card or `null` (no panel).
  `{ ...task }` copies a card. All its fields are primitives, so a shallow copy
  is sufficient here. Nested objects would need more careful copying.
- `update` creates a new draft object instead of mutating the old one. React
  observes that new state and renders the changed input. The generic `K` ties
  the field name to its correct value type; a card size cannot accidentally
  become a number.
- `save` validates the draft, then uses `map` to replace an existing card or
  adds a new one. `close` discards the panel state. Cancel calls `close` without
  updating `tasks`, so the board keeps the original values.
- `useEffect` handles things outside rendering: an API request, a clock timer,
  and opening the browser's modal dialog. Cleanup stops timers and requests.
- `TaskCard` receives `task`, `overdue`, and `onOpen` as props. The parent owns
  the data; the card asks the parent to open the panel when selected.
- `frontend/board.css` defines browser-only visuals: perspective tilts, glow,
  responsive layouts and reduced motion. `App.web.tsx` is selected by Expo for
  web; `App.tsx` currently shows a placeholder on native platforms. This keeps
  the web experiment explicit without claiming native UI support.
- `backend/config/middleware.py` adds the allowed origin header only to health
  responses for the two local Expo origins. It does not grant access to other
  routes, authenticate users or connect external services.

## Run and inspect

Follow [the run guide](README.md) to start Django and Expo. Then:

```bash
cd /workspaces/shinobi-hub/frontend
npm run typecheck
npm run lint
npm run test:model
npx expo export --platform web
npx playwright install chromium
npm run test:e2e
```

Browser tests serve the exported web build locally and simulate the health response to make card behavior reproducible,
including when Django is stopped. Real API connectivity must also be checked
with Django running and the browser indicator showing API connected.

Backend checks, from the repository root:

```bash
source /opt/venv/bin/activate
python backend/manage.py check
python backend/manage.py test config --noinput
```

## Verification results and limitations

- Django system checks: passed.
- Three backend tests: passed (allowed origin, rejected origin, other-route scope).
- Task-model tests: passed for validation, overdue/done behavior and local date
  conversion, including a run in the America/Sao_Paulo timezone.
- Full frontend lint: passed after correcting clock initialization and removing
  synchronous state updates from the API effect.
- TypeScript check: passed with Node and React types explicitly enabled.
- Web export: final corrected bundle passed.
- Actual running Django health JSON and the local Expo CORS response: passed.
- Expo development server on localhost:8081: HTTP 200.
- Expo dependency compatibility: passed after aligning React Native to 0.88.0.
- Browser interaction tests: **not verified**. The initial Metro server startup
  exceeded the test timeout; tests now use the exported build instead. Chromium
  then failed to launch because the container lacks `libglib-2.0.so.0` and other
  browser libraries. `npx playwright install-deps chromium` could not install them
  because switching to root requires a password. No Docker security settings
  were changed.

To enable browser tests, an administrator can install the browser system packages
inside the dev container. From the host project directory:

```bash
docker compose -f .devcontainer/compose.yaml exec --user root dev bash -lc 'cd /workspaces/shinobi-hub/frontend && npx playwright install-deps chromium'
```

Then, as the regular development user, run `npm run test:e2e`. These libraries
are installed in the running container and will need reinstalling after a rebuild.
Use the acceptance checklist above to test manually in your host browser meanwhile.

The Expo scaffolder also created nested Git metadata. It was moved out of the
project into a temporary backup so the frontend belongs to the existing root
repository. No commits or pushes were made to the root repository.

## Dependency audit

The initial npm audit reported 8 findings (5 low, 3 high) in the Expo toolchain,
including transitive `zod` and `deepmerge`. The proposed automatic fix downgrades
Expo from SDK 58 to SDK 51, so it was not applied. These remain known dependency
limitations to reassess before deployment; the prototype is for local development.

References: [Expo templates](https://docs.expo.dev/more/create-expo/) and
[Expo web setup](https://docs.expo.dev/workflow/web/).
