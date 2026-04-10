# API Gestion Candidats : Assistant RH Intelligent

API REST développée avec Node.js, Express et PostgreSQL permettant la gestion de candidats et de postes dans un contexte de recrutement.


## Stack technique

- Node.js / Express
- PostgreSQL
- Architecture MVC simplifiée (controllers / services / routes)
- Gestion des erreurs SQL (23505, 23503)
- Multer (upload fichiers)
- pdf-parse (extraction PDF)
- OpenAI 

## Fonctionnalités

- Ajouter un candidat / postes
- Ajouter, modifier, supprimer un candidat
- Ajouter un poste
- Stockage en base PostgreSQL
- Afficher la liste des candidats
- Voir le CV d’un candidat
    - Upload d’un CV (PDF)
    - Extraction automatique du texte
    - Suppression automatique du fichier CV sur le serveur
- Pagination, recherche, filtres
- Gestion des erreurs (upload, DB, etc..)
- IA OpenAI pour analyser automatiquement les CV
  (Implémenté un mock pour éviter les coûts en dev et permettre des tests offline)
- Stocker résumé en bdd
- Score candidat pour le poste

## Installation

1. Installer les dépendances :

npm install

2. Créer un fichier .env à la racine :

DATABASE_URL=postgresql://user:password@localhost:5432/nom_db
PORT=3000

3. Lancer le serveur :

npm run dev

4. Cloner le repository :

```bash
git clone https://github.com/TON_PSEUDO/api-gestion-candidats.git
cd api-gestion-candidats
```

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
