//initialize routes with required modules and files
const express = require('express')
const router = express.Router()
const user = require('./models/user')
const enc = require('./enc/cypher')
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const { db } = require('./models/user')

//homepage
router.get('/', function (req, res) {
  res.render(__dirname + '/views/home.html')
})

// Showing register form
router.get('/register', function (req, res) {
  res.render(__dirname + '/views/register.html')
})

//Showing login form
router.get('/login', function (req, res) {
  res.render(__dirname + '/views/login.html')
})

/*
router.get("/home", isLoggedIn, function (req, res) {
  res.locals.user = req.user;
  res.render("home");
});
*/

// Handling user signup
router.post('/register', async (req, res) => {
  // Check if this user already exisits
  mongo.connect(process.env.DB_CONNECTION, function (err, db) {
    if (err) throw err
    var dataBase = db.db('nkdatabase')
    var collection = dataBase.collection('accounts')
    //getting detail of requesting usern name
    var candidateName = req.body.username
    var findName = {}
    findName.username = candidateName
    // does user exist is found by below function
    collection.findOne(findName, function (err, doc) {
      if (err) throw err
      if (doc) {
        //if exist throw error saying user already exist to aware conflicts in registering user and instruct to enter different username
        return res
          .status(400)
          .send(
            `user with "${req.body.username}" is already exists! Click here to go back to registration page: "` +
              '<a href="/register">Sign up</a>'
          )
      } else {
        // Get details of the user from register page in this variable of array
        var userDetails = {
          firstName: req.body.firstName, //first name
          lastName: req.body.lastName, //last name
          email: req.body.email, //email
          address: req.body.address, //address
          city: req.body.city, //city
          state: req.body.state, //state
          country: req.body.country, //country
          zip: req.body.zip, //zip
          username: req.body.username, //username
          password: enc.encrypt(req.body.password), //encrypting the password
          role: 'user'
        }
        // Insert the new user if not exist in database by fetching details from register page
        user.create(userDetails, function (e) {
          if (e) {
            res.send(e.message) //error handling
          } else {
            console.log('user registered successfully')
            //redirect to login page after successful registration
            //res.redirect('login')
          }
        })
      }
      //close mongodb
      db.close()
    })
  })
})

//Handling user login
router.post('/login', async (req, res) => {
  mongo.connect(process.env.DB_CONNECTION, function (err, db) {
    if (err) throw err //error handling
    //to get the database, username, collection details
    var dataBase = db.db('nkdatabase')
    var collection = dataBase.collection('accounts')
    var candidateName = req.body.username
    console.log(candidateName + ': requesting for logging in')
    var findName = {}
    findName.username = candidateName
    // this function handling whether user exist in the database or not
    collection.findOne(findName, function (err, doc) {
      if (err) {
        res.send(err.message) //error handling
      } else {
        //if user exist, proceed for authentication process
        if (doc) {
          //comparing the password entered by the user and the decrypted password retrieved from database
          if (enc.decrypt(doc.password) === req.body.password) {
            //role based routing
            if (doc.role === 'admin') {
              console.log('Admin User logged in successfully')
              //listing all the user in the admin page
              user.find({ role: { $ne: 'admin' } }, function (err, users) {
                if (err) throw err
                // object of all the users
                //var userDetails = users
                //route admin to admin page
                //console.log(users)
                var registeredUsers = users.length
                res.render(__dirname + '/views/admin.html', {
                  users,
                  candidateName,
                  registeredUsers
                })
              })
            } else {
              console.log('User account loggedin successfully')
              //route user to welcome page
              res.render(__dirname + '/views/welcome.html', { candidateName })
            }
          } else {
            //error handling
            return res
              .status(400)
              .send(
                `Either the entered username or password is incorrect. Click here '<a href="/login">Login</a>' to login with correct details`
              )
          }
          db.close() //close mongodb
        } else {
          //error handling
          return res
            .status(400)
            .send(
              `user with "${req.body.username}" doesn't exist. Click here '<a href="/login">Login</a>' to login with correct details`
            )
        }
      }
    })
  })
})

//Delete a user from database
router.delete('/user', async (req, res) => {
  mongo.connect(process.env.DB_CONNECTION, function (err, db) {
    if (err) throw err //error handling
    //to get the database, username, collection details
    var dataBase = db.db('nkdatabase')
    var collection = dataBase.collection('accounts')
    console.log('\nrequest received for deleting this user id: ' + req.body._id)
    collection.deleteOne({ _id: new ObjectId(req.body._id) }, function (err) {
      if (err) {
        res.send(err.message) //error handling
      } else {
        console.log('deleted user id: ' + req.body._id)
      }
    })
  })
  res.redirect('admin.html')
})

router.post('/edit', (req, res) => {
  mongo.connect(process.env.DB_CONNECTION, function (err, db) {
    if (err) throw err //error handling
    //to get the database, username, collection details
    var dataBase = db.db('nkdatabase')
    var collection = dataBase.collection('accounts')
    console.log(
      'Request received for modifying this user : ' +
        '"' +
        req.body.name +
        '" details'
    )
    collection
      .findOneAndUpdate(
        { username: req.body.name },
        {
          $set: {
            firstName: req.body.firstName, //first name
            lastName: req.body.lastName, //last name
            email: req.body.email, //email
            address: req.body.address, //address
            city: req.body.city, //city
            state: req.body.state, //state
            country: req.body.country, //country
            zip: req.body.zip, //zip
            password: enc.encrypt(req.body.password) //encrypting the password
          }
        },
        {
          upsert: true
        }
      )
      .then(() => {
        console.log('Successfully updated user')
        user.find({ role: { $ne: 'admin' } }, function (err, users) {
          if (err) throw err
          // object of all the users
          //var userDetails = users
          //route admin to admin page
          //console.log(users)
          var registeredUsers = users.length
          var candidateName = 'administrator'
          res.render(__dirname + '/views/admin.html', {
            users,
            candidateName,
            registeredUsers
          })
        })
      })
      .catch(() => {})
  })
})

//Handling user logout
/*
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/register')
})
*/
module.exports = router
