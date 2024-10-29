# Projet Eco Bliss Bath - README

## Introduction
Ce fichier README fournit des instructions complètes pour installer, exécuter et tester le projet Eco Bliss Bath.


## Étapes d'installation

1. **Télécharger le projet**  
- Téléchargez ou clonez le dépôt.

2. **Prérequis et configuration Docker**
- Prérequis : Docker doit être installé.
- Si Docker n'est pas installé, suivez la procédure d'installation officielle : [Documentation Docker](https://docs.docker.com/desktop/install/windows-install/).
- Démarrer les conteneurs Docker :
Dans le terminal, déplacez-vous dans le dossier du projet et lancez les conteneurs pour démarrer l’application :
`cd /dossier-du-projet`
`sudo docker-compose up --build`


## Démarrer l'application
- Une fois les conteneurs lancés, l'application sera disponible à l'adresse suivante : http://localhost:8080.


## Lancer les tests Cypress

1. **Prérequis et configuration Cypress**  
- Prérequis : Cypress doit être installé.
- Si Cypress n'est pas installé, suivez la procédure d'installation officielle : [Documentation Cypress](https://docs.cypress.io/app/get-started/install-cypress).

2. **Lancer Cypress en mode interactif**
- Pour exécuter les tests en mode interactif, ouvrez le Launchpad de Cypress avec : `npx cypress open`

3. **Exécuter tous les tests en mode headless**
- Pour lancer tous les tests en mode headless et obtenir un rapport : `npx cypress run`
- Le résultat des tests sera affiché directement dans le terminal.