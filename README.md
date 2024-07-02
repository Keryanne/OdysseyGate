# Projet Frontend Angular/Ionic SkyOdyssey

Ce projet est une application frontend construite avec Angular et Ionic. Il se connecte à une API REST backend pour fournir des fonctionnalités complètes.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (version 14 ou supérieure) : [Télécharger Node.js](https://nodejs.org/)
- npm (version 6 ou supérieure) : Inclus avec Node.js
- Ionic CLI (version 6 ou supérieure) : [Guide d'installation Ionic CLI](https://ionicframework.com/docs/cli)

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_DOSSIER_PROJET>

2. **Installer les dépendances :** 
   ```bash
   npm install

3. **Configurer les environnements :**
-> src/environments/environment.ts
   ```bash
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5093/api'
   };
   
5. **Démarrer le serveur en local**
     ```bash
     ionic serve
