# About com LaserFlow

A rota `/about` usa o background `@react-bits/LaserFlow-JS-CSS` do React Bits.
O item e seu código foram consultados pelo MCP shadcn. Os arquivos oficiais foram
incorporados diretamente do registry, sem inicializar outro projeto ou adicionar
Tailwind. Esta versão do componente não declara dependências npm adicionais.

## Arquivos

- `frontend/src/app/about.web.tsx`: composição da página web, texto, link e
  referência ao painel usado como superfície do feixe.
- `frontend/src/app/about.tsx`: implementação nativa original.
- `frontend/src/components/about.css`: layout responsivo e aparência do painel.
- `frontend/src/components/react-bits/LaserFlow.web.jsx`: implementação JS oficial,
  com comentário de origem; a extensão `.web.jsx` identifica sua plataforma.
  Adaptação local: a atualização de `settingsRef` ocorre em um efeito, em vez de
  durante a renderização, para atender às regras de hooks do projeto.
- `frontend/src/components/react-bits/LaserFlow.css`: estilos oficiais do canvas.
- `frontend/src/components/react-bits/LaserFlow.web.d.ts`: tipos das propriedades
  usadas nesta integração, permitindo importar o componente JS em TypeScript.
- `frontend/src/components/react-bits/LICENSE.md`: licença do código incorporado.

O efeito usa WebGL2. O fundo CSS e o conteúdo permanecem visíveis quando o contexto
WebGL2 não está disponível. O código oficial trata preferência por movimento
reduzido, suspende a animação fora de visibilidade e libera recursos ao desmontar.

Para experimentar, em `frontend/`:

```bash
npm run web
```

Abra `http://localhost:8081/about`. O Django não é necessário para esta página.
Para ajustar o efeito, comece por `color`, `intensity` e `beamPosition` no JSX.
`surfaceRef` liga o efeito à posição e às bordas do painel; `dpr` limita a resolução
de renderização. Componentes visuais continuam fora da pasta de rotas.

Fonte: https://reactbits.dev/r/LaserFlow-JS-CSS.json

Validação: `npm run typecheck`, `npm run lint` e
`npx expo export --platform web` passaram. Conferência visual no navegador
pendente: o Chromium do container estava bloqueado por dependência de sistema
ausente na validação anterior do projeto.
