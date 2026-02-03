import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'poc-velvet-secret-change-me';
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
    try {
        const pocsPath = path.join(__dirname, 'config', 'pocs.json');
        const pocsData = JSON.parse(fs.readFileSync(pocsPath, 'utf-8'));
        res.json(pocsData.pocs);
    } catch (error) {
        console.error('Erreur lecture POCs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des POCs' });
    }
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

// Route fallback pour SPA (Express 5 syntax)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 POC Velvet Portal running on port ${PORT}`);
    console.log(`📋 Feedback form: ${FEEDBACK_FORM_URL || 'Not configured'}`);
});
