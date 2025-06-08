// src/models/User.js
// Define o modelo 'User' (Usuário) para o Sequelize.

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // Nome de usuário deve ser único
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // Email pode ser nulo
            unique: true, // Email deve ser único, se fornecido
            validate: {
                isEmail: true // Valida se é um formato de e-mail válido
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false // Senha não pode ser nula
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'), // Exemplo de roles
            defaultValue: 'user', // Role padrão
            allowNull: false
        }
    }, {
        tableName: 'users', // Nome da tabela no banco de dados
        timestamps: true // Adiciona `createdAt` e `updatedAt`
    });

    return User;
};
