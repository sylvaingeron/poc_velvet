# POC Velvet Portal

Portail d'accès centralisé aux Proofs of Concept (POC) développés par l'équipe Innovation Velvet.

## Fonctionnalités

- 🔐 Authentification JWT sécurisée
- 📋 Liste des POC avec description, statut et version
- 🔗 Accès direct aux POC déployés
- 💬 Bouton feedback vers MS Forms

## POC disponibles

| POC | Description | URL |
|-----|-------------|-----|
| Agent Velvet | Agent de vente conversationnel (manuel, chat, vocal) | [Accéder](https://agent-velvet-production.up.railway.app) |
| Email Velvet | Générateur d'emails personnalisés | [Accéder](https://email-velvet-production.up.railway.app) |

## Installation locale

```bash
# Cloner le repo
git clone https://github.com/sylvaingeron/poc_velvet.git
cd poc_velvet

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer le serveur
npm start
```

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `JWT_SECRET` | Clé secrète pour les tokens JWT | Oui |
| `PORT` | Port du serveur (défaut: 3000) | Non |
| `FEEDBACK_FORM_URL` | URL du formulaire MS Forms | Non |

## Déploiement Railway

1. Créer un nouveau projet sur Railway
2. Connecter le repo GitHub
3. Configurer les variables d'environnement
4. Déployer

## Utilisateurs

Les utilisateurs sont définis dans `server.ts`. Pour ajouter un utilisateur :

```typescript
'email@velvet.fr': {
    password: bcrypt.hashSync('password', 10),
    name: 'Nom Complet'
}
```

## Structure

```
poc_velvet/
├── public/
│   ├── index.html      # Frontend SPA
│   ├── logo.png        # Logo Velvet
│   └── images/         # Screenshots des POC
├── config/
│   └── pocs.json       # Configuration des POC
├── tasks/
│   └── prd-*.md        # Documents PRD
├── server.ts           # Backend Express
├── package.json
└── README.md
```

## Migration SSO (future)

L'architecture est prête pour une migration vers SSO Velvet :
1. Modifier le middleware `authenticateToken` pour vérifier les tokens SSO
2. Adapter la page de login pour rediriger vers le SSO

---

© 2026 Velvet - Équipe Innovation
