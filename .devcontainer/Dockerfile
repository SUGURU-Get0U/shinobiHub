# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS node
FROM python:3.13-slim-bookworm

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates curl build-essential libpq-dev postgresql-client procps \
    && rm -rf /var/lib/apt/lists/*

ARG CODEX_VERSION=latest
RUN npm install -g @openai/codex@${CODEX_VERSION} && npm cache clean --force

RUN groupadd --gid 1000 dev \
    && useradd --uid 1000 --gid dev --create-home --shell /bin/bash dev \
    && python -m venv /opt/venv \
    && mkdir -p /workspaces/shinobi-hub /home/dev/.codex /home/dev/.local \
    && chown -R dev:dev /opt/venv /workspaces /home/dev

ENV PATH="/opt/venv/bin:/home/dev/.local/bin:${PATH}" \
    VIRTUAL_ENV=/opt/venv \
    NPM_CONFIG_PREFIX=/home/dev/.local \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    GIT_CONFIG_GLOBAL=/home/dev/.gitconfig-isolated \
    GIT_CONFIG_NOSYSTEM=1
USER dev
WORKDIR /workspaces/shinobi-hub
CMD ["sleep", "infinity"]
