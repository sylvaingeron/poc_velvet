# PRD: Portail POC Velvet

## Introduction

Créer un site web interne permettant aux équipes Velvet d'accéder aux différents POC (Proof of Concept) développés par l'équipe innovation. Le portail centralise l'accès aux POC, présente chacun avec une description et une preview, et permet de collecter des feedbacks via un formulaire simple avec envoi par email.

## Goals

- Centraliser l'accès à tous les POC Velvet en un seul endroit
- Protéger l'accès par authentification (JWT + bcrypt, réutilisation du système agent_velvet)
- Présenter chaque POC avec nom, description, screenshot/preview et statut
- Permettre aux testeurs de donner leur feedback facilement
- Envoyer les feedbacks par email à sylvain.geron@velvet.fr
- Respecter la charte graphique Velvet (couleurs velours, style épuré)

## User Stories

### US-001: Structure du projet et configuration
**Description:** As a developer, I need the project structure set up so I can start development.

**Acceptance Criteria:**
- [ ] Dossier `poc_velvet` créé avec structure Express + TypeScript
- [ ] Package.json avec dépendances (express, cors, bcryptjs, jsonwebtoken, nodemailer)
- [ ] Structure: `/public` (frontend), `/` (backend)
- [ ] Fichier `.env.example` avec variables nécessaires
- [ ] README.md avec instructions de déploiement

---

### US-002: Système d'authentification
**Description:** As a user, I want to log in so that only Velvet team members can access the POC portal.

**Acceptance Criteria:**
- [ ] Page de login avec champs email/mot de passe
- [ ] Authentification JWT (réutiliser le code de agent_velvet)
- [ ] Stockage du token en localStorage
- [ ] Redirection vers login si non authentifié
- [ ] Bouton de déconnexion
- [ ] Style Velvet (couleurs velours #6B2D5C, fond clair)
- [ ] Vérifier en navigateur que le login fonctionne

---

### US-003: Page d'accueil - Liste des POC
**Description:** As a user, I want to see a list of all available POC so I can choose which one to explore.

**Acceptance Criteria:**
- [ ] Grille de cartes présentant chaque POC
- [ ] Chaque carte affiche: nom, courte description, image/screenshot, statut (Actif/En développement), date
- [ ] Bouton "Accéder" ouvrant le POC dans un nouvel onglet
- [ ] Bouton "Donner mon feedback" ouvrant le formulaire
- [ ] Design responsive (mobile-friendly)
- [ ] Style cohérent avec la charte Velvet
- [ ] Vérifier en navigateur l'affichage des cartes

---

### US-004: Configuration des POC (données)
**Description:** As a developer, I need a way to configure the list of POC without modifying the code.

**Acceptance Criteria:**
- [ ] Fichier JSON ou config listant les POC avec leurs infos
- [ ] Champs: id, name, description, url, imageUrl, status, createdAt
- [ ] API endpoint GET /api/pocs retournant la liste (protégé par auth)
- [ ] POC initiaux configurés: Agent Velvet (agent_velvet), Email Generator (102)

---

### US-005: Formulaire de feedback
**Description:** As a user, I want to submit feedback about a POC so the team can improve it.

**Acceptance Criteria:**
- [ ] Modal ou page de formulaire de feedback
- [ ] Champs: POC concerné (dropdown pré-rempli si venu d'une carte), Nom du testeur, Commentaire libre (textarea)
- [ ] Upload de fichier (image/screenshot) - max 5MB, formats jpg/png/gif
- [ ] Bouton "Envoyer"
- [ ] Validation des champs requis (POC, Nom, Commentaire)
- [ ] Message de confirmation après envoi
- [ ] Vérifier en navigateur le formulaire complet

---

### US-006: Envoi d'email avec le feedback
**Description:** As an admin, I want to receive feedback by email so I can review it easily.

**Acceptance Criteria:**
- [ ] Endpoint POST /api/feedback recevant les données du formulaire
- [ ] Envoi d'email à sylvain.geron@velvet.fr via nodemailer
- [ ] Email contient: POC concerné, Nom du testeur, Commentaire, Pièce jointe si présente
- [ ] Sujet de l'email: "[POC Feedback] {nom_du_poc} - {nom_testeur}"
- [ ] Gestion d'erreur si l'envoi échoue
- [ ] Configuration SMTP via variables d'environnement

---

### US-007: Déploiement sur Railway
**Description:** As a user, I want the portal deployed so I can access it online.

**Acceptance Criteria:**
- [ ] Projet déployé sur Railway
- [ ] Variables d'environnement configurées (JWT_SECRET, SMTP_*, etc.)
- [ ] URL publique fonctionnelle
- [ ] HTTPS activé
- [ ] Vérifier que login + liste POC + feedback fonctionnent en production

---

## Functional Requirements

- **FR-1:** Le système doit authentifier les utilisateurs via JWT avec expiration de 24h
- **FR-2:** Le système doit afficher la liste des POC sous forme de cartes avec image, description et statut
- **FR-3:** Cliquer sur "Accéder" doit ouvrir l'URL du POC dans un nouvel onglet (`target="_blank"`)
- **FR-4:** Le formulaire de feedback doit permettre l'upload d'un fichier (max 5MB)
- **FR-5:** Le système doit envoyer un email à sylvain.geron@velvet.fr pour chaque feedback soumis
- **FR-6:** Les pièces jointes doivent être incluses dans l'email
- **FR-7:** Le système doit être responsive (mobile, tablet, desktop)
- **FR-8:** La liste des POC doit être configurable via un fichier de configuration

## Non-Goals (Out of Scope)

- Pas de création de compte utilisateur (comptes créés manuellement ou via seed)
- Pas de SSO Velvet (prévu pour plus tard, architecture prête)
- Pas de base de données pour les feedbacks (envoi email uniquement)
- Pas de tableau de bord analytics
- Pas d'édition des POC depuis l'interface (modification du fichier config)
- Pas de système de notation (étoiles, etc.)

## Design Considerations

### Charte graphique Velvet
- **Couleur principale:** #6B2D5C (velours)
- **Couleur secondaire:** #8B4573 (velours clair)
- **Fond:** #FAFAFA ou blanc
- **Texte:** #333333
- **Police:** System fonts (comme agent_velvet)

### Composants à réutiliser de agent_velvet
- Style des boutons
- Style des inputs/formulaires
- Style des cartes
- Header avec logo Velvet

### Maquette simplifiée

```
+------------------------------------------+
|  🚂 POC Velvet           [Déconnexion]   |
+------------------------------------------+
|                                          |
|  Bienvenue ! Explorez nos POC            |
|                                          |
|  +------------+  +------------+          |
|  | [image]    |  | [image]    |          |
|  | Agent      |  | Email      |          |
|  | Velvet     |  | Generator  |          |
|  | v4.0       |  | v1.0       |          |
|  | ● Actif    |  | ● Actif    |          |
|  |            |  |            |          |
|  | [Accéder]  |  | [Accéder]  |          |
|  | [Feedback] |  | [Feedback] |          |
|  +------------+  +------------+          |
|                                          |
+------------------------------------------+
```

## Technical Considerations

### Architecture
- **Backend:** Express.js + TypeScript (comme agent_velvet)
- **Frontend:** HTML/CSS/JS vanilla (single page, comme agent_velvet)
- **Auth:** JWT + bcrypt (copier de agent_velvet)
- **Email:** Nodemailer avec SMTP (Gmail, SendGrid, ou autre)
- **Upload:** Multer pour gérer les fichiers

### Configuration SMTP
Variables d'environnement nécessaires:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx@velvet.fr
SMTP_PASS=xxx
SMTP_FROM=noreply@velvet.fr
FEEDBACK_TO=sylvain.geron@velvet.fr
```

### Structure des fichiers
```
poc_velvet/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── config/
│   └── pocs.json
├── server.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Migration future vers SSO
L'architecture permet une migration facile vers SSO:
1. Le middleware `authenticateToken` est isolé
2. Remplacer par vérification du token SSO
3. Adapter la page de login pour rediriger vers SSO Velvet

## Success Metrics

- Les équipes Velvet peuvent accéder aux POC en moins de 3 clics (login → carte → accéder)
- Le formulaire de feedback prend moins de 2 minutes à remplir
- 100% des feedbacks soumis arrivent par email
- Le site charge en moins de 2 secondes

## Open Questions

1. Quel service SMTP utiliser ? (Gmail, SendGrid, SMTP Velvet interne ?)
2. Y a-t-il d'autres POC à ajouter en plus de agent_velvet et 102 ?
3. Faut-il une taille limite pour les screenshots uploadés ?
4. Les utilisateurs doivent-ils être créés manuellement ou y a-t-il une liste existante ?
