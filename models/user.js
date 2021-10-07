var mongoose = require('mongoose')
//schema for users
var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zip: Number,
  username: String,
  password: String,
  role: String
})
module.exports = mongoose.model('account', userSchema, 'accounts')
