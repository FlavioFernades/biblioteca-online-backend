// src/data/books.js
// Este arquivo contém os dados estáticos dos livros, simulando um banco de dados.

const books = [
    {
        id: "1",
        title: "A Metamorfose",
        author: "Franz Kafka",
        genre: "Ficção Absurda",
        publishedYear: 1915,
        available: true
    },
    {
        id: "2",
        title: "1984",
        author: "George Orwell",
        genre: "Distopia",
        publishedYear: 1949,
        available: true
    },
    {
        id: "3",
        title: "Cem Anos de Solidão",
        author: "Gabriel García Márquez",
        genre: "Realismo Mágico",
        publishedYear: 1967,
        available: false // Exemplo de livro indisponível
    },
    {
        id: "4",
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        genre: "Literatura Infantil",
        publishedYear: 1943,
        available: true
    },
    {
        id: "5",
        title: "Dom Quixote",
        author: "Miguel de Cervantes",
        genre: "Romance Picaresco",
        publishedYear: 1605,
        available: true
    }
];

// Exporta a lista de livros para que possa ser usada por outros módulos.
module.exports = books;
