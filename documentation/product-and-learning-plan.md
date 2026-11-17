# Product direction and learning plan

## Agreed direction

Shinobi HUB helps users turn ticket-related work into a visual task board and
understand team progress. Development uses fictional data. External integrations
are not connected yet.

The three core workflows are:

- **Create:** create task cards based on tickets.
- **Customize:** link a card to its GLPI ticket or Jira task; adjust its color,
  background and size; organize work for today, tomorrow and this week; define
  and organize priority levels.
- **Consult:** review the brain dump in a readable board and use dashboards to
  understand progress and team status.

Linking to a ticket and synchronizing with an external service are separate
features. The initial prototype can use fictional references without API access.

## Visual direction

Inspiration: Bleach's Gotei 13 captains, especially Aizen Sousuke and Hado 90.
Desired effects include tilting cards, glowing particles and interactive 3D
scenes showing Aizen. The palette should explore purple and yellow or gold.

Start by exploring the palette, depth and motion on one task card. Character
assets, their source, and the rendering approach remain undecided. Keep text
readable, provide reduced-motion behavior, and preserve basic task interactions
when visual effects are disabled.

## Learning approach

The learner knows Python basics, has some Flask experience, understands the idea
of React components, and is new to TypeScript.

For each small increment:

1. Ask a focused question about the behavior or concept being introduced.
2. Explain the choice and its tradeoffs in plain language.
3. Implement a small, reviewable change with explanations of unfamiliar syntax.
4. Run it and explain what the result verifies.
5. Record the change, commands and reasoning in this folder.

Questions should guide understanding without requiring the learner to guess
unexplained framework details. Introduce TypeScript through concrete examples
such as the fields on a task card.

## Milestone 01: interactive personal board

Implementation and verification are tracked in [Milestone 01](milestone-01.md).

- Create an Expo frontend and run it in the browser.
- Introduce components, props, state and TypeScript through one fictional card.
- Display a title, source reference, status, priority and planned time bucket.
- Add a purple/gold visual treatment and a small tilt or glow interaction.
- Show API connection state using Django's existing `/api/health/` endpoint.
- Document how to run and test the screen.

The prototype now supports creation/editing in React memory. A persistent Django
task API, richer board organization and dashboards remain future work. Add complex
3D scenes incrementally after evaluating usability and performance. See
[Milestone 02](milestone-02.md) for baseline validation and documentation reconciliation.

## Personal board and feelings

The first board is personal. It should reflect the user's experience of work,
including avoidance and dependence on other people, rather than just generic
progress points.

Requested labels:

- Standard progress statuses. The prototype provisionally uses To do, In progress,
  Blocked, Waiting on someone and Done; final semantics still need confirmation.
- **I'm procrastinating:** a manual label the user can choose when a task has
  remained In progress too long without an update.
- **I don't want to do it:** for boring or otherwise unappealing work, including
  tasks involving conversations, email or research.
- **Task redirected to:** track work that now depends on someone else, so the
  user knows whom to follow up with.

Confirmed model: separate progress from a feeling/attention label. This allows
a card to be both In progress and I don't want to do it.
For redirected work, the prototype implements Waiting on someone, an editable
person/team and dependency reason. These are provisional product choices. A separate
follow-up date remains a proposal and is not implemented.

Each card must have a user-selected review deadline (date and time), rather
than a single global inactivity threshold. Tasks vary: a fictional server check
may take ten minutes, while a fictional major network incident may take days.
After the deadline passes, ask the user to confirm or update progress and
feelings. Do not automatically mark the task Done or I'm procrastinating.

Review deadlines are mandatory, including during initial card creation. This is
an intentional personal accountability feature requested by the user. The create
form must require a deadline, and the eventual backend API must reject new cards
without one. The prototype implements In 10 minutes, In 1 hour, In 24 hours and
a custom date/time input; each resolves to an explicit date and time.

## Editing and customization

Confirmed requirement: all user-controlled card fields must remain editable at
any time, including after the review deadline passes. This includes title,
description, ticket/task reference, progress, feeling, priority, planned time
bucket, review deadline, appearance and any dependency/follow-up fields offered
by the card. The prototype implements these controls in its detail panel, except
for the separately proposed follow-up date. Saving currently updates memory only.

Overdue reminders must not lock a card or require a separate review workflow
before editing. The user can extend a deadline directly without first changing
progress or feelings. A saved card must still contain a valid review date and
time; it can be replaced but not removed. A form may temporarily contain an
empty value while editing, but cannot save it that way.

System-managed values such as the internal identifier and creation timestamp
are metadata, not editable card controls. Their display, if any, remains
undecided.

Confirmed editing interface: selecting a card opens a detail panel containing
its editable fields. Keep the board card focused on a readable summary; inline
field editing is not part of the initial design. All user-controlled fields
remain available through the panel, including when the card is overdue.
The prototype panel fills the available width on small screens and stacks paired
fields below 600px. This is an implemented provisional layout, not a final design approval.

Confirmed save behavior: the detail panel uses explicit **Save** and **Cancel**
buttons. Changes remain in a local draft until Save succeeds. Cancel discards
the draft and leaves the saved card unchanged. Validate required fields,
including the review deadline, before saving. On validation or API failure,
keep the panel open with the draft intact and show a useful error; do not show
the changes as successfully saved. Closing the panel with unsaved edits needs
an explicit discard decision. The prototype asks for confirmation on Escape or
the close button when the draft is dirty; Cancel explicitly discards without a
second prompt. API save failures remain future scope because no task API exists.

Use the working term **review deadline**. An SLA is a service agreement, and an
SLO is a service-level objective; this personal reminder does not implement
either. An estimated duration (for example, ten minutes of work) is distinct
from an absolute deadline (for example, today at 14:30). Duration estimates
are not yet confirmed as a separate feature.

Implemented prototype behavior: overdue unfinished cards show an in-app reminder,
updated every 15 seconds. Users can edit progress, feelings and deadlines directly;
Done cards do not request further reviews. Date input/display uses the browser's
local timezone and values are stored as ISO timestamps in memory. Refreshing resets
all cards, so reminders for saved work after reopening are not yet supported.
Persistent reminders, background notifications, repetition/dismissal rules and a
broader timezone policy remain proposals or unresolved decisions.

## Questions to resolve next

- Confirm the standard statuses and how Waiting on someone differs from Blocked.
- Confirm whether the first reminders should appear only inside the app.
- Confirm whether to retain the prototype's free-text priorities with Low/Medium/High
  suggestions. There is no user-defined ordering or priority-management UI yet.

Dashboard metrics remain undecided. Define what progress and team performance
mean before implementing charts.

## Existing technical baseline

Django lives in `backend/`, uses PostgreSQL through `DB_*` variables, and exposes
`/api/health/`. The Expo web prototype lives in `frontend/`. See [the run guide](README.md)
for local commands. Keep Docker security settings unchanged. Do not connect to
Canvas, GLPI or Jira during the prototype milestone.
