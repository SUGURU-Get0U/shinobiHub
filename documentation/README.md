# Running Shinobi HUB locally

The Django backend and first Expo web board prototype are available.
Use fictional data only.

## 1. Open the development container

Start Docker Desktop, open the project in VS Code, and select
**Dev Containers: Reopen in Container**. Wait for startup, then open a terminal.
The container supplies PostgreSQL and the required `DB_HOST`, `DB_PORT`,
`DB_NAME`, `DB_USER`, and `DB_PASSWORD` environment variables.

Alternatively, from the project directory on the host:

```bash
docker compose -f .devcontainer/compose.yaml up -d --build
docker compose -f .devcontainer/compose.yaml exec dev bash
```

## 2. Prepare the backend

Run these commands inside the container:

```bash
cd /workspaces/shinobi-hub
source /opt/venv/bin/activate
python -m pip install -r requirements-dev.txt
python backend/manage.py check
```

Verify the database connection:

```bash
python backend/manage.py shell -c 'from django.db import connection; connection.ensure_connection(); print("PostgreSQL: OK")'
```

For Django's admin and authentication tables, apply migrations once:

```bash
python backend/manage.py migrate
```

Migrations are not required for the health endpoint.

## 3. Start and test the application

```bash
python backend/manage.py runserver 0.0.0.0:8000
```

Keep this terminal open. In VS Code, forward port **8000** if it is not already
forwarded. Open <http://localhost:8000/api/health/> in your host browser, or run
this in another container terminal:

```bash
curl -i http://localhost:8000/api/health/
```

Expected: **HTTP 200** with `{"status": "ok"}`. The health endpoint checks that
the application responds; it does not test the database. The root URL `/` has
no application page yet.

## 4. Stop the application

Press **Ctrl+C** in the server terminal. To stop the containers, run from the host:

```bash
docker compose -f .devcontainer/compose.yaml stop
```

This preserves database volumes. Do not use `down -v` unless you intend to delete
the stored development data.

## 5. Run the Expo web prototype

Keep Django running on port 8000. Open a second container terminal:

```bash
cd /workspaces/shinobi-hub/frontend
npm ci
npm run web
```

Forward port **8081** locally in VS Code and open <http://localhost:8081>.
The API indicator should show **API connected**. Its button retries the connection.
The default API address is `http://localhost:8000`; you can supply a different
public API address using `EXPO_PUBLIC_API_URL` before starting Expo. This value
is included in the browser bundle and must never contain credentials. The current
Django CORS allowance is limited to `localhost:8081` and `127.0.0.1:8081`.

Select a card to open its detail panel. Save applies changes; Cancel discards them.
Every card requires a title and review deadline. Cards use fictional data and
are stored only in memory: refreshing the browser resets the board. Stop Expo
with Ctrl+C. The board is web-only in this milestone; native screens come later.

See [Milestone 01](milestone-01.md) for the learning walkthrough and tests.

## Development notes

- Missing `DB_*` variables: run inside the configured development container.
- Dependencies must be reinstalled after rebuilding the container.
- Django runs with development settings. For a stable signing key across restarts,
  supply `DJANGO_SECRET_KEY` through your local environment; do not commit it.
- Keep port forwarding local. Canvas and GLPI are not connected.
