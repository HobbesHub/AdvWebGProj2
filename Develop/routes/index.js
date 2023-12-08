
const express = require('express');

// Import our modular routers for books 
const bookRouter = require('./books');

const app = express();

app.use('/books', bookRouter);


module.exports = app;
