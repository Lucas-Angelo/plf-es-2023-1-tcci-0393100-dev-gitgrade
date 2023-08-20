# Código do projeto

Este diretório mantém todo o código produzido no projeto.

---

## Diretórios:

- [`/jobscheduler-service`](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos/tree/master/Codigo/jobscheduler-service): Contém todo o código do serviço de sincronização de dados da plataforma com o GitHub.
- [`/supportplatform-service`](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos/tree/master/Codigo/supportplatform-service): Contém todo o código do serviço consumido pelo frontend da plataforma.
- [`/supportplatform-web`](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2023-1-tcci-0393100-dev-plataformaapoioavaliacoesprojetos/tree/master/Codigo/supportplatform-web): Contém todo o código do frontend da plataforma.

---

# Rodar a aplicação com docker:

## Docker-compose development run:

```bash
$ bash run-docker.sh -dev
```

## Docker-compose test run:

```bash
$ bash run-docker.sh -test
```

## Docker-compose production run:

```bash
$ bash run-docker.sh -prod -d
```
