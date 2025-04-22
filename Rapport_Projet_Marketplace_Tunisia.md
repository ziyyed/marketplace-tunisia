# Rapport de Projet: Marketplace Tunisia
## Méthodologie Agile Appliquée au Développement

### Table des matières
1. Introduction
2. Présentation du projet
3. Méthodologie Agile adoptée
4. Sprints et fonctionnalités développées
5. Défis rencontrés et solutions
6. Résultats et améliorations
7. Conclusion

---

## 1. Introduction

Ce rapport présente la méthodologie agile utilisée pour le développement de "Marketplace Tunisia", une plateforme d'e-commerce dédiée au marché tunisien. Le projet a été développé en utilisant les principes de la méthodologie Scrum, permettant une approche itérative et incrémentale pour répondre efficacement aux besoins des utilisateurs.

## 2. Présentation du projet

**Marketplace Tunisia** est une plateforme en ligne qui permet aux utilisateurs de publier, rechercher et acheter des produits et services en Tunisie. Le projet vise à créer un écosystème commercial local, facilitant les échanges entre vendeurs et acheteurs tunisiens.

### Objectifs principaux:
- Créer une interface utilisateur intuitive et responsive
- Développer un système de gestion des annonces efficace
- Implémenter un système d'authentification sécurisé
- Intégrer un système de notation et d'évaluation des produits
- Optimiser l'expérience utilisateur sur mobile et desktop

### Technologies utilisées:
- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express
- **Base de données**: MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Gestion de version**: Git et GitHub

## 3. Méthodologie Agile adoptée

Pour ce projet, nous avons adopté la méthodologie **Scrum**, une approche agile qui favorise la collaboration, la flexibilité et la livraison continue de valeur.

### Principes Scrum appliqués:

#### Rôles:
- **Product Owner**: Responsable de la définition des fonctionnalités et de la priorisation du backlog
- **Scrum Master**: Facilitateur qui assure le bon déroulement du processus Scrum
- **Équipe de développement**: Développeurs responsables de la réalisation des fonctionnalités

#### Événements:
- **Sprint Planning**: Réunions de planification au début de chaque sprint
- **Daily Scrum**: Brèves réunions quotidiennes pour synchroniser l'équipe
- **Sprint Review**: Démonstration des fonctionnalités développées à la fin de chaque sprint
- **Sprint Retrospective**: Analyse du sprint terminé pour identifier les améliorations

#### Artefacts:
- **Product Backlog**: Liste priorisée des fonctionnalités à développer
- **Sprint Backlog**: Ensemble des tâches sélectionnées pour un sprint
- **Increment**: Version fonctionnelle du produit à la fin de chaque sprint

### Outils de gestion:
- **Jira**: Pour la gestion du backlog et le suivi des sprints
- **Slack**: Pour la communication d'équipe
- **GitHub**: Pour la gestion du code source et l'intégration continue

## 4. Sprints et fonctionnalités développées

Le projet a été divisé en plusieurs sprints de deux semaines chacun, permettant de livrer régulièrement des fonctionnalités utilisables.

### Sprint 1: Mise en place de l'infrastructure
- Configuration de l'environnement de développement
- Création de la structure du projet (frontend et backend)
- Mise en place de la base de données MongoDB
- Implémentation du système d'authentification de base

### Sprint 2: Développement des fonctionnalités de base
- Création du système d'inscription et de connexion
- Développement de la page d'accueil avec les catégories de produits
- Implémentation de la fonctionnalité de recherche simple
- Création des pages de profil utilisateur

### Sprint 3: Gestion des annonces
- Développement du formulaire de création d'annonce
- Implémentation du système de téléchargement d'images
- Création de la page de détail des produits
- Développement de la fonctionnalité de modification d'annonce

### Sprint 4: Amélioration de l'expérience utilisateur
- Réduction de la taille des icônes de catégorie et affichage en ligne unique
- Remplacement des "Featured Listings" par les produits les mieux notés
- Correction du système de notation par étoiles
- Transformation des champs de localisation en menus déroulants
- Correction de la fonctionnalité de sauvegarde de profil

### Sprint 5: Optimisation et finalisation
- Optimisation des performances
- Tests utilisateurs et corrections de bugs
- Amélioration de la sécurité
- Préparation pour le déploiement

## 5. Défis rencontrés et solutions

### Défi 1: Problèmes de sauvegarde dans la base de données
**Problème**: Les nouveaux comptes et annonces n'étaient pas correctement sauvegardés dans la base de données.
**Solution**: Amélioration de la connexion MongoDB, ajout de meilleurs mécanismes de gestion d'erreurs et de journalisation détaillée pour identifier et résoudre les problèmes de persistance.

### Défi 2: Téléchargement de photos de profil
**Problème**: Les utilisateurs ne pouvaient pas télécharger leurs photos de profil.
**Solution**: Refonte du système de téléchargement de fichiers, amélioration de la gestion des erreurs et mise en place d'une structure de répertoires appropriée pour le stockage des images.

### Défi 3: Système de notation des produits
**Problème**: Le système de notation n'était pas fonctionnel et les propriétaires pouvaient noter leurs propres produits.
**Solution**: Implémentation d'un système de vérification pour empêcher les propriétaires de noter leurs propres produits et amélioration de l'affichage des notations pour tous les utilisateurs.

### Défi 4: Incohérence des données de localisation
**Problème**: Les champs de localisation étaient des entrées de texte libre, créant des incohérences dans les données.
**Solution**: Création d'un fichier de données standardisées pour les localisations tunisiennes et transformation des champs en menus déroulants pour assurer la cohérence.

## 6. Résultats et améliorations

### Résultats obtenus:
- Une plateforme fonctionnelle permettant aux utilisateurs de s'inscrire, de publier des annonces et de rechercher des produits
- Un système de notation fiable qui empêche les propriétaires de noter leurs propres produits
- Une interface utilisateur améliorée avec des icônes de catégorie plus petites et mieux organisées
- Une expérience utilisateur cohérente grâce aux menus déroulants pour les localisations
- Une meilleure gestion des erreurs et une journalisation détaillée pour faciliter la maintenance

### Améliorations futures:
- Implémentation d'un système de messagerie entre utilisateurs
- Ajout d'un système de paiement en ligne
- Développement d'une application mobile native
- Intégration de fonctionnalités de géolocalisation avancées
- Mise en place d'un système de recommandation basé sur l'intelligence artificielle

## 7. Conclusion

L'adoption de la méthodologie Scrum pour le développement de Marketplace Tunisia a permis de livrer un produit de qualité qui répond aux besoins des utilisateurs. Les principes agiles ont facilité l'adaptation aux changements et la résolution efficace des problèmes rencontrés.

Le projet continue d'évoluer, avec un backlog de fonctionnalités à développer dans les prochains sprints. L'approche itérative permettra d'améliorer continuellement la plateforme en fonction des retours utilisateurs et des nouvelles exigences du marché.

La collaboration étroite entre les membres de l'équipe et la communication transparente avec les parties prenantes ont été des facteurs clés de succès pour ce projet, démontrant l'efficacité de la méthodologie agile dans le développement de plateformes e-commerce complexes.

---

*Rapport préparé le 21 avril 2025*
