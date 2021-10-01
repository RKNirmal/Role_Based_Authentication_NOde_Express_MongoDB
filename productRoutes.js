const express = require('express')
const router = express.Router()
const product = require('./models/product') //product model schema
const mongo = require('mongodb').MongoClient

router.get('/view/product/:category', function (req, res) {
  console.log(req.params.category) //logs the requested category to console
  product.find({ productCategory: req.params.category }, function (
    err,
    products
  ) {
    if (err) {
      res.end(err)
    }
    console.log(products)
    renderResult(res, products) //calls the below function
  })

  function renderResult (res, products) {
    console.log(products.length) //no.of products after filtering with the requested category
    res.render('welcome.html', { products }, function (err, result) {
      if (!err) {
        res.end(result) //if no error, render the page with the products
      } else {
        res.end('Oops ! An error occurred.') //error handling
        console.log(err)
      }
    })
  }
})

router.post('/viewProduct', function (req, res) {
  mongo.connect(process.env.DB_CONNECTION, function (err) {
    if (err) throw err
    let category = req.body.productCategory //get the category from the request
    console.log('this is the category name:' + category)
    res.redirect('/view/product/' + category) //redirect to get request
  })
})

//fetch product api
router.get('/createProduct', function (req, res) {
  product.find({}, (err, items) => {
    if (err) {
      console.log(err)
      res.status(500).send('An error occurred', err)
    } else {
      res.render('createProduct.html', { products: items })
    }
  })
})

router.post('/createProduct', (req, res) => {
  let obj = {
    productName: req.body.name,
    productDesc: req.body.description,
    productPrice: req.body.price,
    productCategory: req.body.category
  }
  console.log(obj)
  product.create(obj, (err, item) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/createProduct')
      console.log(item)
    }
  })
})

module.exports = router
