// src/config/database.js
// Configura a conexão com o banco de dados MySQL usando Sequelize e define os modelos.

const { Sequelize, DataTypes } = require('sequelize');
const BookModel = require('../models/Book'); // Importa o modelo Book
const UserModel = require('../models/User'); // Importa o modelo User

// Configurações do banco de dados (ajuste conforme seu ambiente)
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,    // Agora lê o nome do banco de dados da variável de ambiente
    process.env.DATABASE_USER,    // Agora lê o usuário da variável de ambiente
    process.env.DATABASE_PASSWORD, // Agora lê a senha da variável de ambiente
    {
        host: process.env.DATABASE_HOST, // Agora lê o host da variável de ambiente
        dialect: 'mysql',
        logging: false // Desabilita o log de queries SQL no console
    }
);

// Inicializa os modelos
const Book = BookModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

// Aqui você pode definir associações entre os modelos, se houver.
// Ex: Um usuário pode ter vários empréstimos, um livro pode ter vários empréstimos.
// User.hasMany(Loan);
// Book.hasMany(Loan);
// Loan.belongsTo(User);
// Loan.belongsTo(Book);

// Exporta a instância do Sequelize e os modelos
module.exports = {
    sequelize,
    Book,
    User
};
