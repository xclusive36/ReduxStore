const mongoose = require('mongoose'); // Require mongoose package

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-shopping'); // Connect to MongoDB

module.exports = mongoose.connection; // Export mongoose connection
