'use strict';

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
