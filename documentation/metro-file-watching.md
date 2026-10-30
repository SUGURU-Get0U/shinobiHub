# Alterações que não aparecem no Expo web

## Diagnóstico neste container

A pasta do projeto é um bind mount. No teste realizado, `fs.watch` não recebeu
eventos nem após atualizar o timestamp de um arquivo no próprio container.
O Metro continuou entregando uma versão antiga do módulo de About com os mesmos
parâmetros de transformação usados pelo navegador, apesar de o arquivo salvo já
não conter o painel. Limpar o cache do navegador não resolve esse cache do servidor.

## Comando para este ambiente

Uma única vez, pare o processo atual com `Ctrl+C`. Depois, em `frontend/`, use:

```bash
npm run web:poll
```

Não é necessário acrescentar `--clear`. Nas próximas edições de componentes,
salve o arquivo e aguarde a detecção, normalmente em cerca de um segundo. O Metro
processa a alteração e o navegador usa o Fast Refresh; se necessário, atualize
a página. Mudanças em dependências ou configuração ainda podem exigir reinício.

O comando tradicional `npm run web` continua disponível para filesystems que
entregam eventos normalmente.

## Implementação

`frontend/scripts/metro-polling.cjs` é carregado antes do Expo somente pelo script
`web:poll`. Ele complementa os watchers `fs.watch` usados pelo Metro com comparação
periódica de nomes, tamanhos e timestamps nos diretórios do frontend já observados.
Não reescreve arquivos nem muda seus timestamps. Ignora `node_modules`, `.git`,
`.expo`, `dist` e relatórios de testes. Não observa todo o repositório.

Esse é um adaptador local para a ausência de eventos no mount, não uma opção
oficial de polling do Metro. Não altera o conteúdo de `node_modules`. O intervalo
é de um segundo e pode custar mais I/O que eventos nativos. É preferível manter
o projeto em um filesystem Linux com eventos funcionais quando isso for possível.

Teste do adaptador, em `frontend/`:

```bash
node --require ./scripts/metro-polling.cjs --test tests/metro-polling.test.cjs
```

O teste verifica edição, criação e remoção sem alterar o conteúdo por conta do
polling. A limpeza dos temporários acontece no próprio teste.

Também foi validado com um Expo temporário na porta 8082: um módulo foi compilado,
editado e solicitado novamente com exatamente a mesma URL e parâmetros. O Metro
retornou o novo conteúdo sem reinício nem limpeza de cache. O primeiro teste de
um arquivo recém-criado precisou aguardar a descoberta pelo polling antes de
solicitar o bundle. A instância temporária foi encerrada após a verificação.
