const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: String, 
  releaseYear: Number,  
});


module.exports = mongoose.model('Book', bookSchema);
