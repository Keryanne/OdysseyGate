# Utiliser une image Node.js comme image de base
FROM node:18 as build-stage

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste des fichiers
COPY . .

# Construire le projet Angular/Ionic
RUN npm run build

# Utiliser une image Nginx pour servir les fichiers construits
FROM nginx:alpine as production-stage

# Copier les fichiers construits de l'étape précédente
COPY --from=build-stage /app/www /usr/share/nginx/html

# Copier le fichier de configuration Nginx personnalisé
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
