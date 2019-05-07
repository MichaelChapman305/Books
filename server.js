'use strict';

//------------------------------------------
// Libraries
//------------------------------------------
const express = require('express');
const superagent = require('superagent');

//------------------------------------------
// Server
//------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

//------------------------------------------
// Constructor
//------------------------------------------
function Books(data) {
  let image = data.imageLinks ? urlCheck(data.imageLinks.thumbnail) : 'https://www.flickr.com/photos/susankeys/4231850506/in/photolist-7rXkHL-rj3Hsq-dWQtuv-7VGQL8-cnAc2N-LM2sE-aqFr5Y-5LCZ34-ayeSbi-8xS4cq-7W5pGF-eY9RPd-9erFQF-9uLoad-84dEBR-9AuVM-fJH2Zs-aAeQ3F-4eLSR9-cZUmwb-9VzZv4-971rUp-4uyjvP-6C6RMd-b2xdpe-iGbFjw-r5f5pK-MeUau9-9exFsv-51Whem-hfCbvb-nhecpm-4ZRUcT-nG555a-bk2tkB-cuUJXQ-dsbMZo-jXJp-3drmaF-mH1bMi-ACUYf-5gLPAY-3dvH7J-ocpoWm-9YckAw-7dj9ir-7L5moo-gLhwM9-abyiEQ-dnyBsr';
  this.title = data.title || 'No title available';
  this.authors = data.authors ? data.authors[0] : 'No author available';
  this.description = data.description || 'No description available';
  this.image = image;
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
  res.render('pages/index')
    .catch(() => errorMessage());
};

let getSearch = (req, res) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${req.body.search[1]}:${req.body.search[0]}`;

  superagent.get(url)
    .then(result => result.body.items.map(book => new Books(book.volumeInfo)))
    .then(books => {
      let booksArr = [];

      for (let i = 0; i < 10; i++) {
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

//------------------------------------------
// Routes
//------------------------------------------
app.get('/', renderHome);
app.post('/searches', getSearch);
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
