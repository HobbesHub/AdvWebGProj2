
const express = require('express');
const books = express.Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');



// GET all books from MongoDB
books.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all books from a JSON file (assuming you have one)
books.get('/', (req, res) => {
  readFromFile('./db/books.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// POST a new book to MongoDB
books.post('/mongo', async (req, res) => {
  const { title, author, genre, releaseYear } = req.body;
  console.log('Received book data:', req.body);

  if (req.body) {
    const newBook = {
      title,
      author,
      genre,
      releaseYear,
      book_id: uuidv4(),
    };

    try {
      // Saving all new book to MongoDB
      const book = new Book(newBook);
      const savedBook = await book.save();
      console.log('Saved book:', savedBook); 

      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.error('Error adding new book to mongoDB');
  }
});

// POST a new book to a JSON file
books.post('/file', (req, res) => {
  console.log(req.body);

  const { title, author, genre, releaseYear } = req.body;

  if (req.body) {
    const newBook = {
      title,
      author,
      genre,
      releaseYear,
      book_id: uuidv4(),
    };
      // Append the new book to the JSON file
      readAndAppend(newBook, './db/books.json');
      res.json(`book added to file`);
  } else {
    res.error('Sorry! Error adding book');
  }
});

module.exports = books;

