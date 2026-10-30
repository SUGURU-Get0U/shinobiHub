# Aprendendo Node e npm

## Expo Router no projeto existente

O Router é instalado no frontend existente, sem executar `create-expo-app`.
O campo `main` de `frontend/package.json` usa `expo-router/entry`.

| Arquivo em `frontend/src/app/` | Responsabilidade |
|---|---|
| `_layout.tsx` | Configura o navegador Stack compartilhado pelas rotas |
| `index.tsx` | Rota `/`, que reutiliza `App.web.tsx` na web e `App.tsx` no nativo |
| `about.tsx` | Rota `/about`, com uma tela simples para o exercício de navegação |
| `+not-found.tsx` | Exibe uma mensagem e um link de retorno para caminhos desconhecidos |

Componentes e utilitários ficam fora de `src/app/`, pois essa pasta define rotas.
O quadro atual continua em `App.web.tsx`; ainda não foi dividido em novas telas.
O arquivo antigo `frontend/index.ts` não é mais o ponto de entrada.

Para iniciar após alterar a configuração, execute em `frontend/`:

```bash
npm run web -- --clear
```

Confira `/` e um caminho inexistente, como `/pagina-inexistente`. Para validar:

```bash
npm run typecheck
npm run lint
npx expo export --platform web
```

A configuração mantém Expo e Router na família SDK 58. Não misture o Expo SDK 51
com as bibliotecas SDK 58. Referência: [instalação manual do Expo Router](https://docs.expo.dev/router/installation/).

Validação da configuração em 2026-10-30: `npm run typecheck`, `npm run lint`
e `npx expo export --platform web` passaram. O build inclui o quadro, o layout
e a página de rota desconhecida. Os quatro testes existentes do Playwright
ficaram bloqueados na inicialização do Chromium por falta de
`libglib-2.0.so.0`; não chegaram a executar as interações. A tentativa de
`npx playwright install-deps chromium` exigiu autenticação de administrador
indisponível no container. A validação no navegador continua pendente.

Na revisão para os commits segmentados, tipos e lint também passaram com a
rota `/about`. Essa tela pode ser aberta diretamente pela URL; ainda não há
um link para ela no quadro. Dependências, configuração do Router, tela About
e documentação foram organizadas em commits separados na branch `feat/expo-route`.

## Dependências: comparação com Python

Estar listado no `package.json` não garante que um pacote esteja instalado.

| No projeto JavaScript | Papel | Comparação com Python |
|---|---|---|
| `package.json` | Declara dependências e versões aceitas; também define comandos como `npm run web` | Mais próximo de `pyproject.toml` |
| `package-lock.json` | Registra as versões exatas resolvidas, incluindo dependências indiretas | Parecido com `poetry.lock` |
| `node_modules/` | Contém os pacotes instalados para o projeto | Parecido com os pacotes em `site-packages` de um ambiente virtual |

Essas comparações são aproximações: `node_modules/` é uma pasta de dependências,
não um ambiente virtual Python e não precisa ser ativada.

## Depois de clonar o repositório

Com Node e npm já disponíveis no container e um `package-lock.json` versionado,
instale as dependências existentes a partir da raiz do repositório:

```bash
cd frontend
npm ci
```

`npm ci` instala as versões registradas no lockfile. Ele exige que o
`package.json` e o `package-lock.json` estejam consistentes, não atualiza esses
arquivos e substitui a pasta `node_modules/` caso ela já exista.

Depois, inicie o frontend:

```bash
npm run web
```

Esse comando executa o script `web` definido no `package.json`. Neste projeto,
ele inicia apenas o frontend Expo; o backend Django é iniciado separadamente.

## Criar projeto versus instalar dependências

`npm create <inicializador>` executa um inicializador, normalmente para criar a
estrutura de um novo projeto. Não é necessário recriar este projeto depois de
cloná-lo: seus arquivos de configuração já existem.

Para adicionar bibliotecas ao frontend Expo, use `npx expo install <pacote>`,
conforme as instruções do projeto, para selecionar versões compatíveis com o SDK.

## Consultar o que está instalado

```bash
npm ls expo expo-router --depth=0
```

- `npm ls` lista os pacotes instalados e suas versões, sem instalar nada.
- `expo expo-router` filtra a consulta para esses pacotes.
- `--depth=0` mostra apenas o primeiro nível, sem expandir dependências indiretas.

Pergunta para revisar: se uma biblioteca aparece no `package.json`, mas não está
instalada localmente, qual é a diferença entre declarar a dependência e ter seus
arquivos disponíveis para executar o aplicativo?
