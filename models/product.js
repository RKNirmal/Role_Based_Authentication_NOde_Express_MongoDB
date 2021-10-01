const mongoose = require('mongoose')
var productSchema = new mongoose.Schema({
  productName: String,
  productDesc: String,
  productPrice: Number,
  productCategory: String
})

module.exports = mongoose.model('Product', productSchema, 'products')
