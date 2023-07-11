const mongoose = require('mongoose'); // Require mongoose package

const { Schema } = mongoose; // Destructure Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

const Category = mongoose.model('Category', categorySchema); // Create Category model

module.exports = Category; // Export Category model
