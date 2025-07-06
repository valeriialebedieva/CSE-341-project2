const mongodb = require('../data/db');
const ObjectId = require('mongodb').ObjectId;

// Validation helper function
const validateAuthor = (author) => {
    const errors = [];
    
    if (!author.firstName?.trim()) {
        errors.push('First name is required');
    }
    if (!author.lastName?.trim()) {
        errors.push('Last name is required');
    }
    if (!author.birthDate) {
        errors.push('Birth date is required');
    }
    if (!author.nationality?.trim()) {
        errors.push('Nationality is required');
    }
    
    return errors;
};

// Get all authors
const getAllAuthors = async (req, res) => {
    try {
        const result = await mongodb.getDb().db().collection('authors').find();
        const authors = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(authors);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving authors',
            error: err.message 
        });
    }
};

// Get single author
const getAuthor = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid author ID format' });
        }

        const authorId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('authors').findOne({ _id: authorId });
        
        if (!result) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving author',
            error: err.message 
        });
    }
};

// Create author
const createAuthor = async (req, res) => {
    try {
        const author = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: new Date(req.body.birthDate),
            nationality: req.body.nationality,
            biography: req.body.biography
        };

        const validationErrors = validateAuthor(author);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors 
            });
        }

        const result = await mongodb.getDb().db().collection('authors').insertOne(author);
        if (result.acknowledged) {
            res.status(201).json({ 
                message: 'Author created successfully',
                id: result.insertedId 
            });
        }
    } catch (err) {
        res.status(500).json({ 
            message: 'Error creating author',
            error: err.message 
        });
    }
};

// Update author
const updateAuthor = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid author ID format' });
        }

        const authorId = new ObjectId(req.params.id);
        const author = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: new Date(req.body.birthDate),
            nationality: req.body.nationality,
            biography: req.body.biography
        };

        const validationErrors = validateAuthor(author);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors 
            });
        }

        const result = await mongodb.getDb().db().collection('authors').updateOne(
            { _id: authorId },
            { $set: author }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json({ 
            message: 'Author updated successfully',
            modifiedCount: result.modifiedCount 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating author',
            error: err.message 
        });
    }
};

// Delete author
const deleteAuthor = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid author ID format' });
        }

        const authorId = new ObjectId(req.params.id);
        
        // Check if author has books
        const books = await mongodb.getDb().db().collection('books')
            .findOne({ author: authorId });
        
        if (books) {
            return res.status(400).json({ 
                message: 'Cannot delete author with existing books' 
            });
        }

        const result = await mongodb.getDb().db().collection('authors')
            .deleteOne({ _id: authorId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }

        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error deleting author',
            error: err.message 
        });
    }
};

module.exports = {
    getAllAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor
};