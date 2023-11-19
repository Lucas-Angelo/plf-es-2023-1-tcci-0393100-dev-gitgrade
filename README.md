<hr>

<h1 align="center">Plataforma de Apoio às Avaliações de Projetos GitHub</h1>

<h3 align="center">
    <img width="300px" src="./Artefatos/Imagens/high-resolution-logo-white-on-transparent-background.png">
    <br><br>
    <p align="center">
      <a href="#-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-alunos-integrantes-da-equipe">Alunos Integrantes da Equipe</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-professores-responsáveis">Professores responsáveis</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-padrão-de-commits">Padrão de commits</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-instruções-de-utilização">Instruções de utilização</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <a href="#-licença">Licença</a>
  </p>
</h3>

<hr>

## 🔖 Sobre

O sistema proposto neste trabalho consiste em uma plataforma web de apoio às avaliações de trabalhos no GitHub que será utilizado pelos professores das disciplinas de “Trabalho Interdisciplinar” entre outras disciplinas que utilizam o GitHub. Nessa plataforma os professores poderão cadastrar métodos avaliativos para cada oferta de disciplina e visualizar as informações resultantes dos repositórios dos trabalhos conforme o método avaliativo selecionado. A necessidade de uma plataforma com essas funções origina-se da carência de uma aplicação que auxilie professores a avaliarem repositórios de código e os artefatos de documentação de trabalhos, por meio de filtros temporais e por integrantes.

#### Necessidades supridas por esta aplicação:
  1. Os professores precisam se autenticar pelo GitHub. Devido à necessidade de verificar
quais usuários terão acesso à plataforma, deverá haver integração com o GitHub OAuth.
Esta integração detectará os owners da organização ICEI-PUC-Minas-PPLES-TI, com isso,
liberando acesso à plataforma deste projeto.
  2. Avaliação de artefatos customizados para cada oferta de disciplina. Os professores 
das disciplinas de “Trabalho Interdisciplinar” entre outras disciplinas que
utilizam o GitHub necessitam de auxílio para avaliarem com mais
praticidade os artefatos de código e documentação dos trabalhos nos repositórios do
GitHub. Contudo, o problema é que esses artefatos diferem para cada disciplina. 
Diante disso, a plataforma possibilitará cadastrar métodos
avaliativos customizados para cada oferta de disciplina, nos quais cada método terá
regras de consistências para os artefatos que deverão ser entregues, possibilitando
efetuar uma avaliação quantitativa das entregas.
  4. Avaliação de entrega de artefatos por sprints em métodos avaliativos. As entregas dos
trabalhos interdisciplinares de uma disciplina são divididas em sprints, nas quais os
alunos devem entregar os artefatos em um período pré-definido. Com isso, os
professores carecem de uma funcionalidade que permita filtrar as entregas dos artefatos
nos repositórios em um período. A partir disso, a plataforma possibilita cadastrar em cada
regra de consistência quais artefatos deverão ser entregues em cada sprint,
possibilitando os professores filtrarem os artefatos entregues em cada sprint de cada
trabalho e avaliarem as tarefas com mais praticidade.
  5. Avaliação das entregas de um integrante de um trabalho. Os professores efetuam uma
tarefa custosa de verificar manualmente todas as contribuições de um integrante em um
repositório para de lançar notas individuais das tarefas da disciplina de “Trabalho
Interdisciplinar” entre outras disciplinas que utilizam o GitHub.
Diante disso, a plataforma possibilitará verificar se todos os integrantes
dos trabalhos estão participando ativamente de entregas, filtrando as entregas de um
integrante por meio das regras de consistência dos métodos avaliativos, análise
quantitativa de contribuições filtrando por sprints, além disso, também contará como
contribuição o fechamento de issues por cada integrante.
  7. Automação da avaliação da qualidade de código. No presente momento, os professores
possuem uma carência de meio para avaliar a qualidade do código entregue nos
trabalhos dos alunos. Com intuito de facilitar a avaliação estática da qualidade de código
desenvolvido nos trabalhos, a plataforma possibilitará os docentes efetuarem uma
análise qualitativa da qualidade do código de cada trabalho ou integrante sem passar por
problemas de configuração local dos trabalhos nem ter de analisar manualmente o
código e seu fluxo.
  8. Avaliação de trabalhos de forma geral. Os professores necessitam avaliar entregas de
artefatos, contribuições de integrantes e qualidade de código, para julgar quais foram os
melhores trabalhos de cada semestre. Contudo, esse é um processo muito trabalhoso e
repetitivo para os docentes, por precisarem abrir cada repositório e efetuar essas
avaliações manualmente. Diante disso, a plataforma apresentará informações
quantitativas de commits, descrição dos commits, tamanho em caracteres da descrição
dos commits, tipos de arquivos entregues, sendo possível filtrar por cada integrante e
sprint, o que irá auxiliar os professores no julgamento. Ademais, os professores também
serão auxiliados pelos resultados da ferramenta de análise estática de código
(SonarQube), podendo considerar na avaliação a qualidade de código produzido em
diferentes branches de cada repositório além da master.
  9. Abertura de issues padronizadas para soluções de problemas detectados pelos métodos
avaliativos. Atualmente os professores possuem a trabalhosa tarefa de validar se algum
artefato ou arquivo não foi entregue nos repositórios de cada trabalho e alertar os alunos.
À vista disso, a plataforma possibilitará cadastrar títulos e descrições para abertura de
issues padronizadas para regras de consistências não seguidas na entrega de uma sprint
de método avaliativo.
  10. Detectar más práticas dos alunos no uso do Git para trabalhos interdisciplinares. 
Pelo fato da execução de force pushes afetar a análise de contribuidores de repositórios
Git, será necessário detectar quando essas operações 
forem efetuadas. Com isso, a plataforma deverá informar quando
alunos efetuarem essa operação em um repositório de código.

---

## 👨‍💻 Alunos integrantes da equipe

* [Guilherme Gabriel Silva Pereira](https://github.com/guizombas)
* [Lucas Ângelo Oliveira Martins Rocha](https://lucasangelo.com)

---

## 👩‍🏫 Professores responsáveis

* Cleiton Silva Tavares
* José Laerte Pires Xavier Junior

---

## 🚀 Tecnologias 
(Deve-se atualizar ao fim do projeto)

- Documentação:
  - [Google Docs](https://docs.google.com/document)
  - [Google Slides](https://docs.google.com/slides)
- Design:
  - [Figma](https://www.figma.com/)
  - [Astah](https://astah.net/)
  - [MySQL Workbench Modeling Tool](https://dev.mysql.com/doc/workbench/en/wb-data-modeling.html)
- Frontend:
  - [Typescript](https://www.typescriptlang.org/)
  - [React](https://react.dev/)
  - [React Router](https://reactrouter.com/en/main)
  - [Tanstack Query](https://tanstack.com/query/latest/docs/react/overview)
  - [Primer](https://primer.style/react/getting-started)
  - [Recharts](https://recharts.org/en-US/)
- Backend:
  - [NodeJs](https://nodejs.org/)
  - [Typescript](https://www.typescriptlang.org/)
  - [Express](https://expressjs.com/)
  - [Octokit](https://octokit.github.io/rest.js/v20/)
  - [Swagger](https://swagger.io/)
  - [Tsoa](https://tsoa-community.github.io/docs/)
  - [Jest](https://jestjs.io/pt-BR/)
  - [Supertest](https://www.npmjs.com/package/supertest)
- Database:
  - [MySQL Server](https://www.mysql.com/)
  - [Postgresql](https://www.postgresql.org/) para o SonarQube
- Ferramentas integradas:
  - [Sonarqube](https://www.sonarsource.com/products/sonarqube/)
  - [SonarScanner](https://docs.sonarsource.com/sonarqube/9.9/analyzing-source-code/scanners/sonarscanner/)
  - [Eslint](https://github.com/eslint/eslint)
  - [Prettier](https://prettier.io/)
  - [Husky](https://github.com/typicode/husky)
- Devops:
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)
  - [GitHub Actions (CI/CD)](https://github.com/features/actions)
  - [Action-Eslint](https://github.com/reviewdog/action-eslint)
  - [SCP-Action](https://github.com/appleboy/scp-action)
  - [SSH-action](https://github.com/appleboy/ssh-action)

---

## 💬 Padrão de commits

Esse projeto utiliza o padrão de commits do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Ele padroniza os commits a partir da seguinte estrutura: 

```

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

```

O `type` é obrigatório e deve ser um dos seguintes:

 - build: Mudanças que afetam o build do sistema ou dependências externas.
 - ci: Mudanças nos arquivos e scripts de configuração do CI.
 - docs: Mudanças apenas na documentação.
 - feat: Adição de uma nova feature.
 - fix: Correção de um bug. 
 - perf: Melhoria de performance.
 - refactor: Mudança de código que não corrige um bug e nem adiciona uma feature.
 - style: Mudanças que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula faltando, etc).
  - test: Adição de testes ou correção de testes existentes.
  
Essas opções são baseadas no [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines). 

O `scope` é opcional e deve ser usado para indicar o escopo da mudança. Ele deve vir entre parenteses, por exemplo: `feat(parser): add ability to parse arrays`.

O `description` é obrigatório e deve ser uma descrição curta da mudança.

O `body` é opcional e deve ser usado para explicar a mudança de forma mais detalhada. Ele deve vir após uma linha em branco do `description`.

O `footer` é opcional e deve ser usado para adicionar informações adicionais como links para issues ou pull requests. Ele deve vir após uma linha em branco do `body`.

## ⤵ Instruções de utilização 
(Deve-se atualizar ao fim do projeto)

Essas instruções vão te levar a uma cópia do projeto rodando em sua máquina local para propósitos de testes e desenvolvimento.

### Passo a passo de: como instalar e iniciar a aplicação utilizando Docker-Compose:

Pré-requisitos:
- [Docker na versão >=20.10](https://docs.docker.com/engine/install/ubuntu/)
- [Docker-compose](https://docs.docker.com/compose/install/)

<br>

1. passo: Clonar o repositório:
  ```bash
  $ git clone https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos
  ```

<br>

2. passo: Entrar na pasta do código:
  ```bash
  $ cd plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos/Codigo
  ```

<br>

3. passo: Criar o arquivo .env com as variáveis de ambiente necessárias para o Docker-compose iniciar os serviços:
  ```bash
  $ mv .env.sample .env
  ```

    ```.env
    # DOCKER ENVs
    
    # Common docker services envs
    HOST=127.0.0.1 # (DON'T CHANGE)
    NODE_ENV=production # development | test | production
    APP_DEBUG=false # (DON'T CHANGE)
    APP_TIMEZONE=America/Sao_Paulo # Same of DB_TIMEZONE
    DB_DIALECT=mysql # It cannot be another DBMS
    DB_CHARSET=utf8mb4 # (DON'T CHANGE)
    DB_COLLATE=utf8mb4_bin # (DON'T CHANGE)
    DB_TIMEZONE=-03:00 # Same of APP_TIMEZONE
    GITHUB_ORGANIZATION_NAME= # Name of the GitHub organization that will be used to sync data and verify users for login. Example: ICEI-PUC-Minas-PPLES-TI
    GITHUB_PERSONAL_ACCESS_TOKEN= # The token must be from an organization admin user of GITHUB_ORGANIZATION_NAME. Generate a Classic Token with repository and user permissions here: https://github.com/settings/tokens 
    
    # MySQL docker service envs
    # The current data will be used to start a MySQL instance within Docker if it does not point to an external server
    DB_HOST=127.0.0.1 # Local to use MySQL Docker
    DB_USER=root # Change MySQL Docker user or put your external user
    DB_PASSWORD=root # Change MySQL Docker password  or put your external password
    DB_NAME=gitgrade # (DON'T CHANGE)
    DB_PORT=3000 # Don't change or change putting your external port
    DB_DOCKER_PORT=3306 # Don't change or change putting your external port
    
    # Jobscheduler docker service envs 
    JOBSCHEDULER_SERVICE_NODE_PORT=3001 # (DON'T CHANGE)
    SYNC_TIME=01:00 # Time to JobScheduler execute the job and sync repositories with GitHub
    SUPPORT_PLATFORM_URL=http://localhost:3002 # (DON'T CHANGE)
    TELEGRAM_BOT_TOKEN= # Telegram Bot to alert synchronization errors. How Generate token: https://core.telegram.org/bots/tutorial
    TELEGRAM_CHAT_ID= # Telegram Chat for bot send errors: https://api.telegram.org/botTELEGRAM_BOT_TOKEN/getUpdates to get chat id
    
    # Supportplataform service docker service envs
    SUPPORTPLATFORM_SERVICE_NODE_PORT=3002 # (DON'T CHANGE)
    GITHUB_APP_CLIENT_ID= # Create an OAuth App on GitHub that will be used to validate login to the organization here: https://github.com/settings/developers SET the Authorization callback URL to http://{Host of the machine that will host the platform}:{Port that the platform will be on the machine}/oauth/github
    GITHUB_APP_CLIENT_SECRET= # When create OAuth App on GitHub, get the client secret: https://github.com/settings/developers
    JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAyv8+4z8pXsW9w4ByT4U9Hn/4Wf0mOGJ5VR+mpbOlKXD086hk
    ruqKz7Os8xuvLHNgebHMXQcxVScNV6d2KvTaZSNNLLtyJqIw3Tthy0rzQ8QUnkLn
    1QOJRr+ti5Y37ZBYQGop1xrH6VpLm2DNKV2PE6KfuRyQP9Bjhwzqkwa5phrkI0dV
    NtI2KYLufil08vpldQv7BSqRpfxb+NGTapC8oUtsA6skgxVJQjpSO4m28MhHesD9
    2w7nIUU1K8EGu5u8x+BupZX8bQxLo53aSpvxhAbDTitd+1YKJ9LxgQ5TzoGQS13h
    VK8fL40DUmntdwMzGl4jCE9dpyslTo9zopWGcwIDAQABAoIBAAKXlPEjosNRC6pt
    /uMcfd8E+ZjhJTrwO4qvlRDlwFuWQWFXs7O285GtHfbSdtHjWGssQTAW6yM0pwat
    g1Iz9aTTQknhXk3Js9aayqgJndR3aM0iQ91NVEH+u3O5tef5QVBhQYXN7yuSOZoT
    Lqbp/8jbi5ze8Mm/0XfSAh3zppqoptbHDEuPr+rJgFtlzQeJ1MfntoorXIdciVXj
    pR8/hTyMtJbfZDnnEYylKGenQEGq4wdIdquvQ2iucbfSdJESXd8zwR8YEfJ74cRm
    mDllTles+O8rf4ToXRV157H0CCnZcK9Au1EHW+DafnwPckqZ75zazT5WQYaXJv0s
    Ty3FsYECgYEA9SSGQFcjl/xcTpjQa8JueYJBZkYV3q86zHSe1p2EdIpFQQV9fpbi
    npxvwefZczo8O+5BpMQVRSvG52Aqv+n3XQUSXhenMWRkDh1aDSBiO3PspMLkj4Qj
    GaK1QoI1RTSXByOldBUblePcdPpisOlOfjTcchlcgPuTMfrImMBge6ECgYEA0/zd
    rvOdeMxQDXwnsrBqFj6BSiQlyoQbzu1kbAfZANYDzyzbVD44xw2rpuQBwCeOt2qQ
    7hCHEF1Ix3bt0l6ZEqEuodGngRjg+Ybad0B7V7fcZt6GkuiB9BHhSPQX815BKZZ2
    WgF9O8rrlHeZ9srRTxf8STBNtup9gk318cIJ6ZMCgYA1+7UUthvAfHJXXI+JK2fo
    miaMvyJRx4TLQWM5H7brcweNKghYuCFvjEOQD95y4YAiMnWCMyv774f9q8++M2el
    tFg3ID5RQipGcXBDM75uGTkjj0eF0zNnkc0YuFPCybH4gIEO7xcECwmhOQJCsx31
    7O4esjcMsFnZx8Ak4zhcAQKBgA6TQkK3KUqW8aIbuTcF/iVNYuJQHfEQqEDP/amX
    2InALT7fXK0sIgc9n2G4J46oqZ1ezFwx8rdjUo+0U6G1M10ei/BAU/4CUeWWKgss
    +c4MLDE+d44+QkEfwZecgNEQ1/YeDEEf/RZRW2U32/Ql+cIwaf42PgGnmb2N0q0u
    pDPVAoGBAKNJ3jgjxhbXUJWtjOGqnGNyVHMt+QuEgaCTPgjc9ZdhevWoITlhBaB6
    XSfURjJ6AX5cG3FP45WC046N2ALUTK+aOeoP6tJJaDgei18xUJJBoB1eDWVO28xt
    dtLCzNKwsr5ONFKjbRUlkQznqJbsXHH3iL0eKZtI1L+7Ul64WM3F
    -----END RSA PRIVATE KEY-----" # EXAMPLE, CHANGE THAT here: https://8gwifi.org/jwsgen.jsp RS256
    JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyv8+4z8pXsW9w4ByT4U9
    Hn/4Wf0mOGJ5VR+mpbOlKXD086hkruqKz7Os8xuvLHNgebHMXQcxVScNV6d2KvTa
    ZSNNLLtyJqIw3Tthy0rzQ8QUnkLn1QOJRr+ti5Y37ZBYQGop1xrH6VpLm2DNKV2P
    E6KfuRyQP9Bjhwzqkwa5phrkI0dVNtI2KYLufil08vpldQv7BSqRpfxb+NGTapC8
    oUtsA6skgxVJQjpSO4m28MhHesD92w7nIUU1K8EGu5u8x+BupZX8bQxLo53aSpvx
    hAbDTitd+1YKJ9LxgQ5TzoGQS13hVK8fL40DUmntdwMzGl4jCE9dpyslTo9zopWG
    cwIDAQAB
    -----END PUBLIC KEY-----" # EXAMPLE, change THAT here:  https://8gwifi.org/jwsgen.jsp RS256
    JOB_SCHEDULER_API_URL=http://localhost:3002
    SESSION_SECRET=U+4h4UfJygPWKraC7N3a7ii0Y5HMe4UDf5VBZTfBlYZrNwo8EDcjzW5wCVGjSAsYwYq7Ip5kftXU # EXAMPLE, CHANGE THAT here: https://8gwifi.org/jwsgen.jsp HS512
    OAUTH_SUCCESS_REDIRECT_URL=http://locahost:3003/login # (DON'T CHANGE)
    OAUTH_FAILURE_SEARCH_PARAM=message # (DON'T CHANGE)
    
    # Supportplataform web docker service envs
    SUPPORTPLATAFORM_WEB_NODE_PORT=3003 # (DON'T CHANGE)
    SUPPORTPLATFORM_WEB_HOST=0.0.0.0 # (DON'T CHANGE)
    VITE_API_URL=http://127.0.0.1:3002 # (DON'T CHANGE)
    VITE_OAUTH_FAILURE_SEARCH_PARAM=message # (DON'T CHANGE)
    
    # Sonarqube docker service envs
    SONARQUBE_HOST=http://localhost # (DON'T CHANGE)
    SONARQUBE_PORT=8000 # (DON'T CHANGE)
    SONARQUBE_DOCKER_PORT=9000 # (DON'T CHANGE)
    SONARQUBE_ADMIN_USERNAME=admin # User for sonarqube
    SONARQUBE_ADMIN_PASSWORD=admin # Password for sonarqube
    SONARQUBE_POSTGRES_USERNAME=sonar # (DON'T CHANGE)
    SONARQUBE_POSTGRES_PASSWORD=sonar # (DON'T CHANGE)
    ```

<br>

4. passo: Iniciar o Docker-Compose:
  ```bash
  $ docker-compose up
  ```

<br>

- Host/IP da aplicação será definido de acordo com o host da máquina que o docker-compose estiver rodando.
- Aplicação web no ar na porta 3003.
- Serviço da API no ar na porta 3002.
- Serviço de sincronização de dados no ar na porta 3001.
- Banco de dados MySQL no ar na porta 3000 (se não usar banco de dados externo).
- Sonarqube no ar na porta 9000.

<br>

---

## 🔗 Links do projeto

- [Artefatos](Artefatos)
- [Codigo](Codigo)
- [Divulgacao](Divulgacao)
- [Documentacao](Documentacao)

---

## 📝 Licença

Esse projeto está sob a licença Creative Commons Attribution 4.0 International. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
