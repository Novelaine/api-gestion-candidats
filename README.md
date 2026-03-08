# API Gestion Candidats

API REST développée avec Node.js, Express et PostgreSQL permettant la gestion de candidats et de postes dans un contexte de recrutement.


## Stack technique

- Node.js
- Express
- PostgreSQL
- Architecture MVC simplifiée (controllers / services / routes)
- Gestion des erreurs SQL (23505, 23503)

## Fonctionnalités

- Ajouter un candidat
- Upload d’un CV (PDF)
- Afficher la liste des candidats
- Voir le CV d’un candidat
- Supprimer un candidat
- Suppression automatique du fichier CV sur le serveur

## Installation

1. Cloner le repository :

```bash
git clone https://github.com/TON_PSEUDO/api-gestion-candidats.git
cd api-gestion-candidats
```

2. Installer les dépendances :

npm install

3. Créer un fichier .env à la racine :

DATABASE_URL=postgresql://user:password@localhost:5432/nom_db
PORT=3000

4. Lancer le serveur :

npm run dev

- Structure du projet
src/
 ├── config/
 │    └── db.js
 ├── controllers/
 │    ├── candidats.controller.js
 │    └── postes.controller.js
 ├── services/
 │    ├── candidats.service.js
 │    └── postes.service.js
 ├── routes/
 │    ├── candidats.routes.js
 │    └── postes.routes.js
app.js

- Fonctionnalités

✅ CRUD Postes
. GET /postes
. GET /postes/:id
. POST /postes
. PUT /postes/:id
. DELETE /postes/:id

✅ CRUD Candidats
. GET /candidats
. GET /candidats/:id
. POST /candidats
. PUT /candidats/:id
. DELETE /candidats/:id

- Relations Base de Données

. Un candidat peut être lié à un poste (relation 1-N)
. FOREIGN KEY avec ON DELETE SET NULL
. Utilisation de LEFT JOIN pour récupération des données
. Utilisation de COALESCE pour gestion des valeurs NULL

- Gestion des erreurs

23505 → Email déjà utilisé
23503 → Poste inexistant
404 → Ressource non trouvée
400 → Données invalides
500 → Erreur serveur

- Accès aux CV
. Les fichiers sont servis statiquement via :
    /uploads
    Exemple :
    http://localhost:3000/uploads/nom_du_cv.pdf

- Exemple affichage frontend
. Chaque candidat affiche :
    Nom - Email - Voir CV - Supprimer

- Objectif pédagogique

. Projet réalisé dans le cadre d’un apprentissage backend Node.js avec :
. Architecture propre
. Séparation des responsabilités
. Intégrité référentielle en base
. Gestion d’erreurs métier
. Bonnes pratiques Git
