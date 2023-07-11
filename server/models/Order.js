const mongoose = require('mongoose'); // Require mongoose package

const { Schema } = mongoose; // Destructure Schema

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

const Order = mongoose.model('Order', orderSchema); // Create Order model

module.exports = Order; // Export Order model
