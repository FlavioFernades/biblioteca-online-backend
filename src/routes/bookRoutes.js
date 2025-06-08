// src/routes/bookRoutes.js
// Este arquivo define as rotas específicas para os recursos de livros (CRUD).

const express = require('express');
const router = express.Router();
// Importa o modelo Book do arquivo de configuração do banco de dados.
const { Book } = require('../config/database');
// Importa o middleware de autenticação.
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rota para CRIAR um novo livro.
// Protegida: Apenas usuários autenticados podem criar livros.
// Método: POST
// Endpoint: /api/books/
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, author, genre, publishedYear, available } = req.body;

        // Validação básica dos dados de entrada
        if (!title || !author) {
            return res.status(400).json({ message: 'Título e Autor são campos obrigatórios.' });
        }

        // Cria o livro no banco de dados
        const newBook = await Book.create({
            title,
            author,
            genre,
            publishedYear,
            available
        });

        console.log('Livro criado:', newBook.toJSON());
        res.status(201).json(newBook); // Retorna o livro criado com status 201 Created
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar o livro.' });
    }
});

// Rota para LISTAR todos os livros.
// Não Protegida: Qualquer um pode listar livros.
// Método: GET
// Endpoint: /api/books/
router.get('/', async (req, res) => {
    try {
        // Busca todos os livros no banco de dados
        const books = await Book.findAll();
        console.log('Todos os livros listados.');
        res.json(books); // Retorna a lista de livros em formato JSON
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar os livros.' });
    }
});

// Rota para LISTAR um livro específico pelo seu ID.
// Não Protegida: Qualquer um pode ver um livro específico.
// Método: GET
// Endpoint: /api/books/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Requisição GET para /api/books/${id} recebida.`);

        // Busca um livro pelo ID no banco de dados
        const book = await Book.findByPk(id); // findByPk busca pela chave primária (id)

        if (book) {
            res.json(book); // Retorna o livro encontrado
        } else {
            res.status(404).json({ message: 'Livro não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar o livro.' });
    }
});

// Rota para ATUALIZAR um livro existente.
// Protegida: Apenas usuários autenticados com role 'admin' podem atualizar livros.
// Método: PUT
// Endpoint: /api/books/:id
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, publishedYear, available } = req.body;

        // Validação básica dos dados de entrada
        if (!title || !author) {
            return res.status(400).json({ message: 'Título e Autor são campos obrigatórios para atualização.' });
        }

        // Busca o livro pelo ID
        const book = await Book.findByPk(id);

        if (book) {
            // Atualiza os dados do livro
            book.title = title;
            book.author = author;
            book.genre = genre;
            book.publishedYear = publishedYear;
            book.available = available;

            await book.save(); // Salva as alterações no banco de dados

            console.log('Livro atualizado:', book.toJSON());
            res.json(book); // Retorna o livro atualizado
        } else {
            res.status(404).json({ message: 'Livro não encontrado para atualização.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar o livro.' });
    }
});

// Rota para DELETAR um livro.
// Protegida: Apenas usuários autenticados com role 'admin' podem deletar livros.
// Método: DELETE
// Endpoint: /api/books/:id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        // Busca o livro pelo ID
        const book = await Book.findByPk(id);

        if (book) {
            await book.destroy(); // Remove o livro do banco de dados
            console.log('Livro deletado:', id);
            res.status(204).send(); // Retorna status 204 No Content para deleção bem-sucedida
        } else {
            res.status(404).json({ message: 'Livro não encontrado para deleção.' });
        }
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar o livro.' });
    }
});

module.exports = router;
