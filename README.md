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

- Design:
  - [Figma](https://www.figma.com/)
  - [Astah](https://astah.net/)
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

- Passo 1: Clonar o repositório:
  ```bash
  $ git clone https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos
  ```

<br>

- Passo 2: ...

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
