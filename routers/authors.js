const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors');

router.get('/', authorsController.getAllAuthors);
router.get('/:id', authorsController.getAuthor);
router.post('/', authorsController.createAuthor);
router.put('/:id', authorsController.updateAuthor);
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;