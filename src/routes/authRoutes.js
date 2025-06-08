// src/routes/authRoutes.js
// Este arquivo define as rotas de autenticação (registro e login).

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Biblioteca para hashing de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para JSON Web Tokens
const { User } = require('../config/database'); // Importa o modelo User

// Variável de ambiente para a chave secreta do JWT.
// EM PRODUÇÃO: Use uma variável de ambiente real (process.env.JWT_SECRET)
const jwtSecret = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

// Rota para REGISTRAR um novo usuário.
// Método: POST
// Endpoint: /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validação básica dos dados de entrada
        if (!username || !password) {
            return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
        }

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'Nome de usuário já existe.' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10); // 10 é o custo do salt

        // Cria o novo usuário no banco de dados
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // Define a role, padrão 'user'
        });

        // Não retorne a senha hasheada no corpo da resposta por segurança.
        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser.id, username: newUser.username });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar o usuário.' });
    }
});

// Rota para LOGIN de um usuário.
// Método: POST
// Endpoint: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validação básica
        if (!username || !password) {
            return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
        }

        // Busca o usuário pelo username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Não informar se é o username ou a senha
        }

        // Compara a senha fornecida com a senha hasheada no banco de dados
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Se as credenciais estiverem corretas, gera um JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            jwtSecret,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.status(200).json({ message: 'Login bem-sucedido!', token, userId: user.id, username: user.username, role: user.role });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login.' });
    }
});

module.exports = router;
