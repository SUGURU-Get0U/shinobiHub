# 忍びHUB — ambiente de desenvolvimento

Este pacote prepara o ambiente; ainda não cria o app Django nem o Expo.

## 1. Windows

Instale Docker Desktop com backend WSL2 (containers Linux), VS Code e a extensão
Dev Containers da Microsoft. O Docker Desktop deve estar em execução.

Extraia o conteúdo deste pacote para C:\dev\shinobi-hub. Abra exatamente essa
pasta no VS Code. Não abra C:\, seu perfil de usuário ou a pasta corporativa.
Os arquivos .devcontainer devem ficar diretamente dentro da pasta do projeto.

No PowerShell do Windows, confira:

```powershell
docker version
docker compose version
cd C:\dev\shinobi-hub
docker compose -f .devcontainer/compose.yaml config --quiet
```

## 2. Abrir o container

No VS Code: Ctrl+Shift+P > Dev Containers: Reopen in Container.
Aguarde a construção e abra um NOVO terminal. Os comandos seguintes são Bash Linux.
O canto inferior esquerdo do VS Code deve indicar Dev Container.

```bash
whoami
pwd
python --version
node --version
npm --version
codex --version
python -m pip install -r requirements-dev.txt
python -m django --version
```

Esperado: usuário dev, diretório /workspaces/shinobi-hub e ferramentas instaladas.
Python já usa /opt/venv; não precisa criar outra .venv no Windows.
O Node 22 atende à base de desenvolvimento; a versão exata do Expo será escolhida
na etapa do frontend conforme a compatibilidade do SDK.

## 3. Verificar PostgreSQL

```bash
python - <<'PYCODE'
import os
import psycopg
with psycopg.connect(
    host=os.environ['DB_HOST'], port=os.environ['DB_PORT'],
    dbname=os.environ['DB_NAME'], user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
) as conn:
    print(conn.execute('SELECT current_database(), current_user').fetchone())
PYCODE
```

Esperado: ('shinobi_hub', 'shinobi_dev'). Banco em db:5432 dentro da rede Compose;
nenhuma porta do PostgreSQL é publicada no Windows. Esta conta é a conta de
bootstrap do banco LOCAL (superusuário), não uma conta adequada à produção.
A senha de exemplo é pública e serve só para dados fictícios descartáveis.

## 4. Login no Codex (dentro do container)

```bash
codex login --device-auth
codex
```

Abra no navegador do Windows o link fornecido e informe o código temporário.
Se necessário, habilite o login por código de dispositivo nas configurações de
segurança do ChatGPT; em conta gerenciada, depende das permissões do administrador.
Nunca copie credenciais corporativas para o container. O volume codex-state guarda
sessões e histórico do Codex; deve ser tratado como dado sensível.
Mantenha o sandbox e as aprovações normais do Codex. Se ocorrer erro de sandbox,
registre o erro e ajuste a compatibilidade; não use --yolo, privileged, SYS_ADMIN
ou seccomp=unconfined como solução automática.

## 5. Conferir os mounts (PowerShell do Windows)

```powershell
$containerId = docker compose -f .devcontainer/compose.yaml ps -q dev
docker inspect $containerId --format '{{json .Mounts}}'
```

O bind mount da aplicação deve ter origem em C:\dev\shinobi-hub e destino
/workspaces/shinobi-hub, nunca C:\ nem C:\Users. O VS Code pode acrescentar
volumes próprios e sockets auxiliares; examine o resultado real.
Não deve existir docker.sock, pipe do Docker, montagem do perfil do usuário,
compartilhamento de rede ou pasta com dados da empresa.

O VS Code Dev Containers pode compartilhar configurações/credenciais Git e agente
SSH automaticamente. Esta base usa um arquivo Git global próprio, desliga o
askpass integrado e remove SSH_AUTH_SOCK do ambiente remoto. Isso reduz o uso
acidental de credenciais, mas não é uma auditoria de todas as extensões ou sockets.
Use um perfil limpo do VS Code, sem contas/extensões corporativas. Para uma fronteira
mais simples de conferir, execute o Codex com docker compose exec (abaixo) sem
conectar o VS Code ao container.

## 6. Alternativa sem Dev Containers

No PowerShell, dentro da pasta do projeto:

```powershell
docker compose -f .devcontainer/compose.yaml up -d --build
docker compose -f .devcontainer/compose.yaml exec dev bash
```

Agora use os comandos Bash das etapas anteriores. O Docker continua no Windows;
o container não recebe o socket nem o executável Docker.

## 7. Próxima missão: iniciar Django

Só depois dos checks anteriores:

```bash
mkdir -p backend
cd backend
python -m django startproject config .
```

Na próxima etapa, configurar DATABASES usando as variáveis DB_* antes de executar
migrate (o settings.py inicial ainda aponta para SQLite). Para expor o servidor de
desenvolvimento ao encaminhamento de portas: python manage.py runserver 0.0.0.0:8000.
O navegador no Windows usará http://localhost:8000.

Para Expo, começaremos pela versão web. Acesso pelo iPad exige configuração
adicional de rede/firewall ou túnel; localhost no iPad é o próprio iPad.
Não abra a API ou o Metro para a rede da empresa nesta etapa.

## Persistência e manutenção

O código é salvo na pasta do Windows; PostgreSQL e autenticação Codex ficam em
volumes separados. Pacotes Python e npm do usuário ficam no container e precisarão
ser reinstalados ao reconstruí-lo. Atualizar Dockerfile/Compose requer Rebuild Container.
Para parar sem apagar os volumes: docker compose -f .devcontainer/compose.yaml stop.
Não use down -v para parar: remove banco e sessão/histórico persistentes.
Após validar, fixe versão do Codex (ARG CODEX_VERSION), dependências e digests das
imagens para reprodução exata. As tags deste starter recebem atualizações.

## Limites do isolamento

O container tem saída de rede para instalar pacotes e conversar com a OpenAI.
A rede Compose não bloqueia acesso à LAN da empresa, host.docker.internal ou
serviços do host. Restrição de saída exige política de firewall/proxy fora do
controle do agente. Container não é garantia contra vazamento nem substitui a
política de dados da empresa. Tudo dentro do projeto, variáveis, banco e saída de
comandos pode ser lido pelo Codex e enviado como contexto. Use apenas dados
fictícios nesta fase. .gitignore/.dockerignore não impedem leitura em runtime.
