# OdysseyGate - Application de planification de voyages

![Logo OdysseyGate](src/assets/icon/logo_application_mobile.jpg)

## 📱 Présentation

OdysseyGate est une Progressive Web App (PWA) développée avec Angular 18 et Ionic 8, conçue pour simplifier la planification et l'organisation de voyages. Cette application tout-en-un permet aux utilisateurs de gérer leurs itinéraires, transports, hébergements et activités en un seul endroit, avec une interface intuitive accessible sur tous types d'appareils.

## ✨ Fonctionnalités principales

### Gestion des voyages
- Création de nouveaux voyages avec dates de début et fin
- Vue d'ensemble de tous vos voyages planifiés
- Détails complets sur chaque voyage

### Transports
- Ajout de différents moyens de transport (avion, train, bus, etc.)
- Gestion des horaires de départ et d'arrivée
- Organisation des étapes de transport

### Hébergements
- Enregistrement des détails de logement pour chaque étape

### Activités
- Planification des activités pour chaque jour de voyage
- Ajout de détails comme le lieux

### Fonctionnalités PWA
- Installation sur l'écran d'accueil comme une application native
- Synchronisation automatique des données

## 🛠️ Technologies utilisées

- **Frontend**: Angular 18, Ionic 8, RxJS
- **PWA**: Service Workers Angular
- **Animations**: Angular Animations
- **Tests**: Jest
- **Mobile**: Capacitor 7
- **CI/CD**: GitHub Actions

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18.x ou supérieure)
- npm (version 8.x ou supérieure)
- Ionic CLI (`npm install -g @ionic/cli`)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Keryanne/OdysseyGate.git
   cd OdysseyGate
   ```

2. **Installer les dépendances :** 
   ```bash
   npm install
   ```

3. **Configurer les environnements :**
-> src/environments/environment.ts
   ```bash
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5093/api'
   };
   ```

4. **Démarrer l'application en développement**
```bash
ionic serve
```
L'application sera accessible à l'adresse : `http://localhost:8100`

---

## 🚀 Build et déploiement

### Build de production (PWA)
```bash
ionic build --prod
```
Les fichiers du build seront générés dans le dossier `www` (défini comme `dist/odyssey-gate` dans angular.json).

### Tester la PWA en local
1. **Construire l'application**
```bash
ionic build --prod
```
2. **Servir les fichiers statiques**
```bash
npx http-server www
```
3. **Accéder à l'application**
   - **Mobile :** Ajouter à l'écran d'accueil depuis le navigateur
   - **Desktop :** Cliquer sur l'icône "+" dans la barre d'adresse Chrome

---

## 📱 Déploiement mobile

### Android
```bash
ionic build --prod
npx cap add android
npx cap copy android
npx cap open android
```
Puis compiler/déployer avec Android Studio.

### iOS
```bash
ionic build --prod
npx cap add ios
npx cap copy ios
npx cap open ios
```
Puis compiler/déployer avec Xcode.

---

## 🧪 Tests

- Lancer les tests unitaires :
```bash
npm test
```
- Exécuter en mode CI (sans surveillance) :
```bash
npm test -- --no-watch
```
- Voir la couverture des tests :
```bash
npm test -- --coverage
```

---

## ⚙️ CI/CD

Le projet utilise GitHub Actions pour :
- Lancer automatiquement les tests sur chaque pull request
- Analyser la qualité du code
- Déployer automatiquement en production lors des merges vers `main`

**Workflows :**
- `ci.yml` → Intégration continue et tests
- `deploy.yml` → Déploiement automatique

---

## 📂 Structure du projet

```
src/
├── animations/     # Animations réutilisables
├── components/     # Composants partagés
│   └── forms/      # Formulaires réutilisables
├── guard/          # Guards Angular (authentification)
├── interceptors/   # Intercepteurs HTTP
├── interfaces/     # Interfaces et types
├── pages/          # Pages de l'application
├── services/       # Services API et utilitaires
├── tabs/           # Navigation par onglets
├── assets/         # Images et ressources
├── environments/   # Configurations d'environnement
└── theme/          # Variables et thèmes CSS
```

---

## 🔐 Sécurité et performances

**Authentification**
- Guards Angular pour protéger les routes
- Stockage sécurisé des tokens JWT
- Rafraîchissement automatique des tokens expirés

**Performances**
- Lazy loading des modules Angular
- Optimisation des images et ressources
- Mise en cache via Service Worker

---

## 🌐 Compatibilité
- **Navigateurs :** Chrome, Firefox, Safari, Edge
- **Mobile :** iOS 13+, Android 7+
- **Desktop :** Windows, macOS, Linux (via PWA)

---

## 🛠 Fonctionnalités à venir
- Partage de voyages
- Suggestions d’itinéraires
- Cartes interactives
- Synchronisation avec calendriers externes
- Mode sombre

---

## 🤝 Contribution
1. Fork du projet
2. Créer une branche :
```bash
git checkout -b feature/amazing-feature
```
3. Commit :
```bash
git commit -m 'feat: add some feature'
```
4. Push :
```bash
git push origin feature/amazing-feature
```
5. Ouvrir une Pull Request

---

## 📜 Licence
Projet sous licence MIT.

---

Développé avec ❤️ par **Keryanne ISIDORE**

