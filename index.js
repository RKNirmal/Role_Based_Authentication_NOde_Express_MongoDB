//variable initialization
const express = require('express')
const app = express()
const route = require('./routes.js')
const mongoose = require('mongoose')
const session = require('express-session')
const productRoutes = require('./productRoutes.js')
const cookieParser = require('cookie-parser')

//////////////////////////////////////////////////////////////////////

//Connect MongoDB and create database and collection and a admin account if not exist
require('./connectdb.js')

//initialization of mongoose
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//setting view engine
app.use(express.json())
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
)
//View engine initialization
app.use(express.static(__dirname + '/views'))
app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

//middleware initialization
app.use(
  session({
    secret: 'secret string',
    saveUninitialized: true,
    resave: true
  })
)

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

//initialize all routes as middleware
app.use('/', route)
app.use('/', productRoutes)
app.use(cookieParser())

// simple route
//Initializing the route.js as middleware for the express application
/*
app.use('/', () => {
    console.log("Middleware to run whenever the request comes to homepage '/' ");
});
*/
//error handling
/*
app.use((err, req, res, next) => {
  if (!err) return next()
  return res.status(400).json({
    status: 400,
    error: 'OOps! Bad request'
  })
  console.log(err)
})
*/
// set port, listen for requests
////server to listen on specified port number:3000
const PORT = process.env.PORT || 3000
//start the server to make it receive the request from client under the port 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})

////////////////////////////////////////////////////////////////////
