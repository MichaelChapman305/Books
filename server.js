'use strict';

//------------------------------------------
// Libraries
//------------------------------------------
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');

//------------------------------------------
// Server
//------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//------------------------------------------
// Database
//------------------------------------------
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//------------------------------------------
// Templating
//------------------------------------------
app.set('view engine', 'ejs');

//------------------------------------------
// Constructor
//------------------------------------------
function Books(data) {
  let author = 'No author available';
  if (data.authors) {
    author = data.authors[0];
  } else if (data.author) {
    author = data.author;
  }
  let image = data.imageLinks ? urlCheck(data.imageLinks.thumbnail) : 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = data.title || 'No title available';
  this.author = author;
  this.isbn = data.isbn || data.industryIdentifiers[0].identifier || 'ISBN Not available';
  this.description = data.description || 'No description available';
  this.image = data.image || image;
  this.bookshelf = 'Fantasy';
}

//------------------------------------------
// Helper functions
//------------------------------------------
let urlCheck = (link) => {
  return link.indexOf('https') === -1 ? link.replace('http', 'https') : link;
};

//------------------------------------------
// Route Handlers
//------------------------------------------
let renderHome = (req, res) => {
  let SQL = `SELECT * FROM books;`;

  return client.query(SQL)
    .then(results => {
      res.render('pages/index', {savedBooks: results.rows, booksAmount: results.rows.length});
    })
    .catch(() => errorMessage());
};

let renderForm = (req, res) => {
  res.render('pages/searches/new');
};

let renderBook = (req, res) => {
  console.log('render book');
  // let id = req.params.id.slice(1);

  let SQL = `SELECT * FROM books WHERE id=${req.params.id};`;


  return client.query(SQL)
    .then(results => {
      res.render('pages/books/show', {bookDetails: results.rows});
    })
    .catch(() => errorMessage());
};

let getSearch = (req, res) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${req.body.search[1]}:${req.body.search[0]}`;

  superagent.get(url)
    .then(result => {
      return result.body.items.map(book => {
        let newBook = new Books(book.volumeInfo);
        return newBook;
      });
    })
    .then(books => {
      let booksArr = [];

      for (let i = 0; i < 10; i++) {
        books[i].id = i;
        booksArr.push(books[i]);
      }
      res.render('pages/searches/show', {searchResults: booksArr});
    })
    .catch(() => errorMessage());
};

let getHello = (req, res) => {
  res.render('pages/index')
    .catch(() => errorMessage());
};

let saveBook = (req, res) => {
  let newBook = new Books(req.body);
  newBook.save()
    .then(book => {
      console.log(book);
    });
};

//------------------------------------------
// Save to database
//------------------------------------------
Books.prototype.save = function() {
  let SQL = `INSERT INTO books 
    (title, author, isbn, description, image, bookshelf)
    VALUES ($1, $2, $3, $4, $5, $6);`;

  let values = Object.values(this);
  return client.query(SQL, values);
};

//------------------------------------------
// Routes
//------------------------------------------
app.get('/', renderHome);
app.get('/search', renderForm);
app.get('/books/:id', renderBook);
app.post('/searches/new', getSearch);
app.post('/books', saveBook);
app.get('/hello', getHello);

//------------------------------------------
// Error handling
//------------------------------------------
app.get('*', (req, res) => res.render('pages/error', {errorMessage: 'Error: Route does not exist!'}));

let errorMessage = () => {
  let errorObj = {
    status: 500,
    responseText: 'Sorry something went wrong',
  };
  return errorObj;
};

//------------------------------------------
// Run server
//------------------------------------------
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
