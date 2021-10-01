require('dotenv/config')
const mongo = require('mongodb').MongoClient

mongo.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    if (err) {
      console.log(err)
      process.exit(0)
    }
    var dbOpen = db.db(process.env.DBNAME)
    var collName = process.env.COLLECTION
    console.log(`database under the name "${dbOpen.databaseName}" is created`)
    dbOpen.listCollections({ name: collName }).next(function (err, collinfo) {
      if (collinfo) {
        console.log(
          `The collection "accounts" under the database : ${dbOpen.databaseName} already exists`
        )
      } else {
        dbOpen.createCollection(process.env.COLLECTION, err => {
          if (err) {
            console.log(err)
            process.exit(0)
          }
          console.log(
            `collection : "${process.env.COLLECTION}" created under database: ${dbOpen.databaseName}`
          )
          db.close()
        })
      }
      require('./models/admin.js')
    })
  }
)
