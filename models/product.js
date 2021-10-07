const mongoose = require('mongoose')
var productSchema = new mongoose.Schema({
  productName: String,
  productDesc: String,
  productPrice: Number,
  productCategory: String,
  productImg: {
    type: Buffer,
    required: true
  }
})

// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// IT WILL GIVE US OUR IMAGE SOURCE THAT WE WILL USE IN OUT IMG TAG
productSchema.virtual('coverImage').get(function () {
  if (this.productImg != null) {
    return `data:charset=utf-8;base64,${this.productImg.toString('base64')}`
  }
})

module.exports = mongoose.model('product', productSchema, 'products')
