# Contexto para retomar — Shinobi HUB

Atualizado em 2026-10-30.

## Objetivo e aprendizado

Projeto com backend Django/PostgreSQL e frontend Expo. O usuário está aprendendo
Node, npm, Git e Expo Router. Prefere explicações didáticas e perguntas socráticas
curtas, acompanhadas de progresso prático. Não prolongar perguntas sobre cenários
hipotéticos antes de executar ou orientar o próximo passo concreto.

Pilar acordado: manter rastreabilidade com commits pequenos, cada um com um
propósito, registrando componentes afetados, motivos e validações. Trabalhar em
branches de feature. Ver `documentation/product-and-learning-plan.md`.

## Estado do Git

- Repositório: `/workspaces/shinobi-hub`.
- Remoto: `https://github.com/SUGURU-Get0U/shinobiHub.git`.
- Branch verificada: `feat/expo-route`.
- Commits criados, em ordem:
  - `498316e`: princípio de rastreabilidade.
  - `38ed85e`: dependências do Expo Router para SDK 58.
  - `6362865`: configuração do Router, quadro inicial e fallback.
  - `2f0c811`: rota About criada pelo usuário.
  - `e463ddc`: notas sobre npm e configuração do Router.
- O assistente não executou push. O usuário recebeu orientação para
  `git push -u origin feat/expo-route`; verificar o remoto antes de afirmar sincronização.
- Na última consulta, `frontend/components.json` existia e ainda não estava
  versionado. Este arquivo de contexto foi criado depois dessa consulta.

## Expo Router

- Expo SDK 58; `package.json` usa `expo-router/entry` como `main`.
- Houve uma instalação incompatível do Expo SDK 51, corrigida para SDK 58.
- `frontend/src/app/_layout.tsx`: Stack sem cabeçalho.
- `frontend/src/app/index.tsx`: reutiliza `../../App`; Metro resolve
  `App.web.tsx` na web e `App.tsx` no nativo.
- `frontend/src/app/+not-found.tsx`: página de caminho desconhecido e link `/`.
- `frontend/src/app/about.tsx`: tela simples acessível em `/about`, ainda sem
  link a partir do quadro.
- `app.json`: scheme `shinobi-hub`, bundler Metro e plugins configurados.
- Componentes comuns devem ficar fora de `src/app/`.
- Ler `frontend/AGENTS.md` antes de modificar o frontend.

## Execução e validação

Frontend, em um terminal:

```bash
cd /workspaces/shinobi-hub/frontend
npm run web -- --clear
```

Backend, em outro:

```bash
cd /workspaces/shinobi-hub
/opt/venv/bin/python backend/manage.py runserver 0.0.0.0:8000
```

- Web: `http://localhost:8081`.
- API health: `http://localhost:8000/api/health/`.
- `npm run web` inicia somente o frontend. Ativar o venv não inicia o Django.
- Django usa PostgreSQL e exige variáveis `DB_*` fornecidas pelo container.
- Os cartões atuais ficam em memória; a API serve para o indicador de conexão.
- Não assumir que servidores de sessões anteriores continuam ativos: verificar.
- Tipos, lint e exportação web passaram na configuração do Router. Tipos e lint
  também passaram após a inclusão da rota About.
- Playwright não conseguiu iniciar Chromium por falta de `libglib-2.0.so.0`.
  `npx playwright install-deps chromium` falhou por exigir autenticação de root.
  As interações no navegador continuam sem validação automatizada nesta sessão.
- A documentação de aprendizado está em `documentation/node_learning.md`;
  comandos gerais em `documentation/README.md`.

## Próxima etapa: React Bits via MCP shadcn

O usuário quer backgrounds do React Bits. Ainda não foi escolhido ou instalado
um efeito. Manter essa mudança separada da migração do Router; considerar uma
branch `feat/react-bits-background` a partir da base apropriada, sem perder os
commits de Router ainda necessários.

Foi adicionado e validado em `/home/dev/.codex/config.toml`:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
cwd = "/workspaces/shinobi-hub/frontend"
```

`codex mcp get shadcn` confirmou a configuração habilitada. Isso não confirma
handshake ou disponibilidade das ferramentas. O usuário foi orientado a reiniciar
Codex e verificar a conexão; a conexão ainda não foi confirmada nesta conversa.

O registry a usar em `frontend/components.json` é:

```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

O arquivo já existe na última consulta, mas seu conteúdo ainda deve ser conferido.
Registry e servidor MCP são configurações distintas. O próximo passo é verificar
se o MCP carregou e consultar o catálogo de backgrounds sem instalar componentes
antes da escolha. Se o CLI precisar de configuração adicional para instalação,
verificar compatibilidade com Expo e CSS existente antes de inicializar shadcn.

Preferir variantes TypeScript + CSS. Efeitos dependentes de DOM/WebGL devem ficar
na implementação web, com separação `.web.tsx` quando necessário para preservar
compatibilidade nativa. Não recriar o projeto com `create-expo-app`.

Referências:
- https://ui.shadcn.com/docs/mcp
- https://github.com/DavidHDev/react-bits
- https://docs.expo.dev/router/installation/

## Particularidades das ferramentas

O sandbox de shell falhou com erro de namespaces bwrap nesta sessão. Comandos
necessários foram executados com escalonamento aprovado, sem desativar sandbox
ou alterar a segurança do container. Git exigiu a opção por comando
`git -c safe.directory=/workspaces/shinobi-hub ...` por conta da propriedade da pasta.

Existe também a skill pessoal `start-shinobi-env` em
`/home/dev/.codex/skills/start-shinobi-env/SKILL.md`, criada para iniciar e verificar
o ambiente. Sincronizar GitHub por essa skill somente quando solicitado.
