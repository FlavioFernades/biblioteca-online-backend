// src/models/Book.js
// Define o modelo 'Book' (Livro) para o Sequelize.

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.UUID, // Tipo UUID para IDs únicos
            defaultValue: DataTypes.UUIDV4, // Gera UUIDs automaticamente
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false // Título não pode ser nulo
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false // Autor não pode ser nulo
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: true // Gênero pode ser nulo
        },
        publishedYear: {
            type: DataTypes.INTEGER,
            allowNull: true // Ano de publicação pode ser nulo
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true // Por padrão, o livro está disponível
        }
    }, {
        // Opções do modelo
        tableName: 'books', // Nome da tabela no banco de dados
        timestamps: true // Adiciona campos `createdAt` e `updatedAt` automaticamente
    });

    return Book;
};
