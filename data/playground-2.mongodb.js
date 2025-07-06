/* global use, db */
// MongoDB Playground
// Make sure you are connected to enable completions and to be able to run a playground.

// Select the database to use.
use('project2');

// Insert documents into the books collection
db.getCollection('books').insertMany([
  {
    title: 'The Great Gatsby',
    author: new ObjectId('64c12345f392d8b8c9a11111'),
    isbn: '9780743273565',
    publishYear: 1925,
    genre: ['Fiction', 'Classic'],
    pages: 180,
    publisher: 'Scribner',
    language: 'English',
    inStock: true
  },
  {
    title: '1984',
    author: new ObjectId('64c12345f392d8b8c9a22222'),
    isbn: '9780451524935',
    publishYear: 1949,
    genre: ['Fiction', 'Science Fiction', 'Dystopian'],
    pages: 328,
    publisher: 'Penguin Books',
    language: 'English',
    inStock: true
  },
  {
    title: 'Pride and Prejudice',
    author: new ObjectId('64c12345f392d8b8c9a33333'),
    isbn: '9780141439518',
    publishYear: 1813,
    genre: ['Fiction', 'Romance', 'Classic'],
    pages: 432,
    publisher: 'Penguin Classics',
    language: 'English',
    inStock: false
  }
]);

// Insert documents into the authors collection
db.getCollection('authors').insertMany([
  {
    _id: ObjectId('64c12345f392d8b8c9a11111'),
    firstName: 'F. Scott',
    lastName: 'Fitzgerald',
    birthDate: new Date('1896-09-24'),
    nationality: 'American',
    biography: 'American novelist and short story writer'
  },
  {
    _id: ObjectId('64c12345f392d8b8c9a22222'),
    firstName: 'George',
    lastName: 'Orwell',
    birthDate: new Date('1903-06-25'),
    nationality: 'British',
    biography: 'English novelist and essayist'
  },
  {
    _id: ObjectId('64c12345f392d8b8c9a33333'),
    firstName: 'Jane',
    lastName: 'Austen',
    birthDate: new Date('1775-12-16'),
    nationality: 'British',
    biography: 'English novelist known for romantic fiction'
  }
]);

// Find all books in the collection
const books = db.getCollection('books').find().toArray();

// Find all authors in the collection
const authors = db.getCollection('authors').find().toArray();

// Print the results to the output window
console.log('Books inserted:', books);
console.log('Authors inserted:', authors);