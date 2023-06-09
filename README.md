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

O sistema proposto neste trabalho consiste em uma plataforma web de apoio às avaliações de trabalhos no GitHub que será utilizado pelos professores das disciplinas de “Trabalho Interdisciplinar”. Nessa plataforma os professores poderão cadastrar métodos avaliativos para cada oferta de disciplina e visualizar as informações resultantes dos repositórios dos trabalhos conforme o método avaliativo selecionado. A necessidade de uma plataforma com essas funções origina-se da carência de uma aplicação que auxilie professores a avaliarem repositórios de código e os artefatos de documentação de trabalhos, por meio de filtros temporais e por integrantes.

#### Necessidades supridas por esta aplicação:
  1. Os professores precisam se autenticar pelo GitHub. Devido à necessidade de verificar
quais usuários terão acesso à plataforma, deverá haver integração com o GitHub OAuth.
Esta integração detectará os owners da organização ICEI-PUC-Minas-PPLES-TI, com isso,
liberando acesso à plataforma deste projeto.
  2. Avaliação de artefatos customizados para cada oferta de disciplina. Os professores das
disciplinas de “Trabalho Interdisciplinar” necessitam de auxílio para avaliarem com mais
praticidade os artefatos de código e documentação dos trabalhos nos repositórios do
GitHub. Contudo, o problema é que esses artefatos diferem para cada disciplina de
“Trabalho Interdisciplinar”. Diante disso, a plataforma possibilitará cadastrar métodos
avaliativos customizados para cada oferta de disciplina, nos quais cada método terá
regras de consistências para os artefatos que deverão ser entregues, possibilitando
efetuar uma avaliação quantitativa das entregas.
  3. Avaliação de entrega de artefatos por sprints em métodos avaliativos. As entregas dos
trabalhos interdisciplinares de uma disciplina são divididas em sprints, nas quais os
alunos devem entregar os artefatos em um período pré-definido. Com isso, os
professores carecem de uma funcionalidade que permita filtrar as entregas dos artefatos
nos repositórios em um período. A partir disso, a plataforma possibilita cadastrar em cada
regra de consistência quais artefatos deverão ser entregues em cada sprint,
possibilitando os professores filtrarem os artefatos entregues em cada sprint de cada
trabalho e avaliarem as tarefas com mais praticidade.
  4. Avaliação das entregas de um integrante de um trabalho. Os professores efetuam uma
tarefa custosa de verificar manualmente todas as contribuições de um integrante em um
repositório para de lançar notas individuais das tarefas da disciplina de “Trabalho
Interdisciplinar”. Diante disso, a plataforma possibilitará verificar se todos os integrantes
dos trabalhos estão participando ativamente de entregas, filtrando as entregas de um
integrante por meio das regras de consistência dos métodos avaliativos, análise
quantitativa de contribuições filtrando por sprints, além disso, também contará como
contribuição o fechamento de issues por cada integrante.
  5. Automação da avaliação da qualidade de código. No presente momento, os professores
possuem uma carência de meio para avaliar a qualidade do código entregue nos
trabalhos dos alunos. Com intuito de facilitar a avaliação estática da qualidade de código
desenvolvido nos trabalhos, a plataforma possibilitará os docentes efetuarem uma
análise qualitativa da qualidade do código de cada trabalho ou integrante sem passar por
problemas de configuração local dos trabalhos nem ter de analisar manualmente o
código e seu fluxo.
  6. Avaliação de trabalhos de forma geral. Os professores necessitam avaliar entregas de
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
  7. Abertura de issues padronizadas para soluções de problemas detectados pelos métodos
avaliativos. Atualmente os professores possuem a trabalhosa tarefa de validar se algum
artefato ou arquivo não foi entregue nos repositórios de cada trabalho e alertar os alunos.
À vista disso, a plataforma possibilitará cadastrar títulos e descrições para abertura de
issues padronizadas para regras de consistências não seguidas na entrega de uma sprint
de método avaliativo.
  8. Detectar más práticas dos alunos no uso do Git para trabalhos interdisciplinares. Pelo fato
da execução de squashes e rebases afetar a análise de contribuidores de repositórios
Git, será necessário detectar quando essas operações forem efetuadas, além disso, a
falta de união de branches ao fim de entregas também é considerada má prática pela
dificuldade de busca de contribuições. Com isso, a plataforma deverá informar quando
alunos efetuarem qualquer uma dessas operações em um repositório do trabalho
interdisciplinar.

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

- Frontend:
  - [JavaScript](https://www.javascript.com/)
- Backend:
  - [NodeJs](https://nodejs.org/)
- Database:
  - [MySQL Server](https://www.mysql.com/)
- Devops:
  - [GitHub Actions (CI/CD)](https://github.com/features/actions)
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

---

## ⤵ Instruções de utilização 
(Deve-se atualizar ao fim do projeto)

Essas instruções vão te levar a uma cópia do projeto rodando em sua máquina local para propósitos de testes e desenvolvimento.

### Passo a passo de: como instalar e iniciar a aplicação utilizando Docker-Compose:

Pré-requisitos:
- Ter instalado [Docker na versão >=20.10](https://docs.docker.com/engine/install/ubuntu/)

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
