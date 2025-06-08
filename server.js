// server.js
// Arquivo principal da aplicação Node.js com Express para a Biblioteca Online.

// Importa o módulo Express para criar e configurar o servidor.
const express = require('express');
// Importa o módulo CORS para permitir requisições de diferentes origens (importante para o frontend).
const cors = require('cors');
// Importa a conexão com o banco de dados e os modelos do Sequelize.
const { sequelize, User } = require('./src/config/database'); // Importa o modelo User
// Importa as rotas de livros definidas em outro arquivo.
const bookRoutes = require('./src/routes/bookRoutes');
// Importa as rotas de autenticação (registro e login).
const authRoutes = require('./src/routes/authRoutes');

// Importa o módulo 'path' para lidar com caminhos de arquivos
const path = require('path'); // <-- NOVO: Importa o módulo path

// Cria uma instância do aplicativo Express.
const app = express();
// Define a porta em que o servidor irá escutar.
const PORT = process.env.PORT || 3000;

// Middleware: Permite que o Express parseie requisições com corpo JSON.
app.use(express.json());
// Middleware: Habilita o CORS para todas as requisições.
app.use(cors());

// NOVO: Middleware para servir arquivos estáticos do diretório 'public'
// Isso fará com que o 'index.html' e outros arquivos do frontend sejam acessíveis
// diretamente pela raiz do servidor (ex: http://localhost:3000/)
app.use(express.static(path.join(__dirname, 'public'))); // <-- NOVO: Servir arquivos estáticos

// Define as rotas de autenticação
app.use('/api/auth', authRoutes);
// Define as rotas para a API de livros.
// Todas as rotas definidas em bookRoutes serão prefixadas com '/api/books'.
app.use('/api/books', bookRoutes);


// Rota de teste simples para verificar se o servidor está funcionando.
// Esta rota agora é menos crítica se você estiver servindo um index.html
// app.get('/', (req, res) => {
//     res.send('Bem-vindo à API da Biblioteca Online!');
// });

// Sincroniza o Sequelize com o banco de dados e inicia o servidor.
// `alter: true` tenta fazer alterações na tabela para corresponder ao modelo,
// `force: false` evita recriar a tabela a cada inicialização se ela já existir.
sequelize.sync({ alter: true, force: false })
    .then(() => {
        console.log('Conexão com o banco de dados MySQL estabelecida e modelos sincronizados!');
        // Inicia o servidor e o faz escutar na porta definida.
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse o frontend em: http://localhost:${PORT}`); // Novo texto de acesso
            console.log(`Rotas de livros: http://localhost:${PORT}/api/books`);
            console.log(`Rotas de autenticação: http://localhost:${PORT}/api/auth`);
        });
    })
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
    });
