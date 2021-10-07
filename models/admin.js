const jwt = require('jsonwebtoken')
//initialize environmental variables
require('dotenv/config')
//initialize user schema
var userSchema = require('./user.js')
//initialize the encryption decryption function from cypher.js
const enc = require('../enc/cypher')
//storing admin name from environmental variable
var candidateName = process.env.NAMEADMIN
var findName = {}
findName.username = candidateName

//finding a particular user in the database to check for the user already existing or not
userSchema.findOne(findName, function (err, user) {
  if (err) {
    console.log(err)
  } else if (user) {
    console.log('Admin user already exists!')
  } else {
    //user details of admin initialized in this variable
    var userDetails = {
      firstName: 'admin',
      lastName: 'user',
      email: 'admin@admin.com',
      address: 'address',
      city: 'city',
      state: 'state',
      country: 'country',
      zip: '3000',
      username: process.env.NAMEADMIN,
      password: enc.encrypt(process.env.PASSADMIN),
      role: 'admin',
      token: String
    }
    const token = jwt.sign(
      {
        username: userDetails.username,
        password: userDetails.password
      },
      process.env.PASSWD
    )
    userDetails.token = token
    process.env.adminToken = token
    console.log(process.env.adminToken)

    //creation of admin user with the above initialized admin details from userdetails variable
    userSchema.create(userDetails, function (e) {
      if (e) {
        throw e
      }
      console.log('Admin user signed with token: ' + userDetails.token)
    })
    console.log('Admin account created successfully')
  }
})
