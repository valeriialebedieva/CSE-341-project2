const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const booksController = require('../controllers/books');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBook);
router.post('/', isAuthenticated, booksController.createBook);
router.put('/:id', isAuthenticated, booksController.updateBook);
router.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = router;