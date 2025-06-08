// src/middleware/authMiddleware.js
// Middleware para verificar JSON Web Tokens (JWT) e proteger rotas.

const jwt = require('jsonwebtoken');

// Variável de ambiente para a chave secreta do JWT.
// EM PRODUÇÃO: Use uma variável de ambiente real (process.env.JWT_SECRET)
const jwtSecret = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

const authenticateToken = (req, res, next) => {
    // Obtém o token do cabeçalho de autorização (Bearer Token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera formato: Bearer TOKEN

    if (token == null) {
        // Se não houver token, retorna 401 Unauthorized
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    // Verifica e decodifica o token
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            // Se o token for inválido ou expirado, retorna 403 Forbidden
            return res.status(403).json({ message: 'Token de autenticação inválido ou expirado.' });
        }
        // Anexa as informações do usuário (decodificadas do token) ao objeto de requisição
        req.user = user;
        next(); // Continua para a próxima função middleware/rota
    });
};

// Middleware para autorização baseada em roles (opcional)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Verifica se o usuário (anexado por authenticateToken) existe e tem uma role
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acesso negado: Informações de role ausentes.' });
        }
        // Verifica se a role do usuário está entre as roles permitidas
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para esta ação.' });
        }
        next(); // Continua se a role for permitida
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
