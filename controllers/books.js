const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

// Validation helper function
const validateBook = (book) => {
    const errors = [];
    
    if (!book.title?.trim()) {
        errors.push('Title is required');
    }
    if (!ObjectId.isValid(book.author)) {
        errors.push('Valid author ID is required');
    }
    if (!book.isbn?.trim()) {
        errors.push('ISBN is required');
    } else if (!/^\d{10}(\d{3})?$/.test(book.isbn.replace(/-/g, ''))) {
        errors.push('Invalid ISBN format');
    }
    if (!book.publishYear || book.publishYear < 1000 || book.publishYear > new Date().getFullYear()) {
        errors.push('Valid publish year is required');
    }
    if (!Array.isArray(book.genre) || book.genre.length === 0) {
        errors.push('At least one genre is required');
    }
    if (!book.pages || book.pages <= 0) {
        errors.push('Valid number of pages is required');
    }
    if (!book.publisher?.trim()) {
        errors.push('Publisher is required');
    }
    
    return errors;
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const result = await mongodb.getDb().db().collection('books')
            .aggregate([
                {
                    $lookup: {
                        from: 'authors',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                }
            ]).toArray();
            
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving books',
            error: err.message 
        });
    }
};

// Get single book
const getBook = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('books')
            .aggregate([
                { $match: { _id: bookId } },
                {
                    $lookup: {
                        from: 'authors',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorDetails'
                    }
                }
            ]).toArray();

        if (!result.length) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving book',
            error: err.message 
        });
    }
};

// Create book
const createBook = async (req, res) => {
    try {
        const book = {
            title: req.body.title,
            author: new ObjectId(req.body.author),
            isbn: req.body.isbn,
            publishYear: parseInt(req.body.publishYear),
            genre: req.body.genre,
            pages: parseInt(req.body.pages),
            publisher: req.body.publisher,
            language: req.body.language,
            inStock: Boolean(req.body.inStock)
        };

        const validationErrors = validateBook(book);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors 
            });
        }

        // Check if author exists
        const authorExists = await mongodb.getDb().db().collection('authors')
            .findOne({ _id: book.author });
        if (!authorExists) {
            return res.status(400).json({ message: 'Author not found' });
        }

        // Check for duplicate ISBN
        const existingBook = await mongodb.getDb().db().collection('books')
            .findOne({ isbn: book.isbn });
        if (existingBook) {
            return res.status(400).json({ message: 'ISBN already exists' });
        }

        const result = await mongodb.getDb().db().collection('books').insertOne(book);
        res.status(201).json({ 
            message: 'Book created successfully',
            id: result.insertedId 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error creating book',
            error: err.message 
        });
    }
};

// Update book
const updateBook = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const book = {
            title: req.body.title,
            author: new ObjectId(req.body.author),
            isbn: req.body.isbn,
            publishYear: parseInt(req.body.publishYear),
            genre: req.body.genre,
            pages: parseInt(req.body.pages),
            publisher: req.body.publisher,
            language: req.body.language,
            inStock: Boolean(req.body.inStock)
        };

        const validationErrors = validateBook(book);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors 
            });
        }

        // Check for duplicate ISBN (excluding current book)
        const existingBook = await mongodb.getDb().db().collection('books')
            .findOne({ isbn: book.isbn, _id: { $ne: bookId } });
        if (existingBook) {
            return res.status(400).json({ message: 'ISBN already exists' });
        }

        const result = await mongodb.getDb().db().collection('books')
            .updateOne({ _id: bookId }, { $set: book });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ 
            message: 'Book updated successfully',
            modifiedCount: result.modifiedCount 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating book',
            error: err.message 
        });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('books')
            .deleteOne({ _id: bookId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error deleting book',
            error: err.message 
        });
    }
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};