const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.send("Book Added");
});

router.get('/', async (req, res) => {
  const { page = 1, limit = 5, genre, author } = req.query;

  let filter = {};
  if (genre) filter.genre = genre;
  if (author) filter.author = author;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(books);
});

router.put('/:id', auth, async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.send("Book Updated");
});

router.delete('/:id', auth, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.send("Book Deleted");
});

module.exports = router;