import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix pour __dirname avec ESM/tsx
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'velvet-poc-secret-2024-change-in-production';
const FEEDBACK_FORM_URL = process.env.FEEDBACK_FORM_URL || 'https://forms.office.com/e/hYQuQaNr4d';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// UTILISATEURS (en dur pour le POC)
// ============================================
const users: { [email: string]: { password: string; name: string } } = {
    'poc@velvet.fr': {
        password: bcrypt.hashSync('Velvet#POC2026!', 10),
        name: 'Utilisateur POC'
    },
    'sylvain.geron@velvet.fr': {
        password: bcrypt.hashSync('Velvet#POC2026!', 10),
        name: 'Sylvain Geron'
    }
};

// ============================================
// CONFIGURATION DES POC (en dur pour simplifier)
// ============================================
const pocs = [
    {
        id: 'agent_velvet',
        name: 'Agent Velvet',
        description: 'Agent de vente conversationnel pour réserver des billets de train. Disponible en mode manuel, chat et vocal.',
        url: 'https://agentvelvet-production-f8e8.up.railway.app',
        imageUrl: '/images/agent_velvet.png',
        status: 'active',
        version: '4.0',
        createdAt: '2026-01-15'
    },
    {
        id: 'email_velvet',
        name: 'Email Velvet',
        description: "Générateur d'emails personnalisés pour les communications clients Velvet.",
        url: 'https://email-velvet-production.up.railway.app',
        imageUrl: '/images/email_velvet.png',
        status: 'development',
        version: '1.0',
        createdAt: '2026-02-01'
    }
];

// ============================================
// MIDDLEWARE D'AUTHENTIFICATION
// ============================================
interface AuthRequest extends express.Request {
    user?: { email: string; name: string };
}

function authenticateToken(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
}

// ============================================
// ENDPOINTS AUTH
// ============================================

/**
 * POST /api/login - Connexion
 */
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = users[email.toLowerCase()];
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
        { email: email.toLowerCase(), name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            email: email.toLowerCase(),
            name: user.name
        }
    });
});

/**
 * GET /api/me - Vérifier le token et récupérer l'utilisateur
 */
app.get('/api/me', authenticateToken, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

// ============================================
// ENDPOINTS POC
// ============================================

/**
 * GET /api/pocs - Liste des POC
 */
app.get('/api/pocs', authenticateToken, (req: AuthRequest, res) => {
    res.json(pocs);
});

/**
 * GET /api/config - Configuration publique
 */
app.get('/api/config', (req, res) => {
    res.json({
        feedbackFormUrl: FEEDBACK_FORM_URL
    });
});

// ============================================
// SERVEUR
// ============================================

// Route fallback pour SPA - seulement pour les routes non-API
app.use((req, res, next) => {
    // Si c'est une route API, laisser passer (404 sera géré normalement)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Route not found' });
    }
    // Sinon, servir index.html pour le SPA
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 POC Velvet Portal running on port ${PORT}`);
    console.log(`📋 Feedback form: ${FEEDBACK_FORM_URL}`);
    console.log(`📦 POCs configured: ${pocs.length}`);
});
