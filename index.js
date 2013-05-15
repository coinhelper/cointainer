var fs = require('fs')

var ApiServer = require('apiserver')
var sqlite3 = require('sqlite3').verbose();

var db = require('./lib/db')
var btcd = require('./lib/bitcoind')
var config = JSON.parse(fs.readFileSync('config.json'))

// set bitcoid location
btcd.setup(config.bitcoind.uri)

// connect to the database
db.setup(sqlite3, 'db/transactions.db')

// startup synchronization
db.load_block_height(function(block_height){
  btcd.unprocessed_transactions_since(block_height, function(transactions){
    transactions.forEach(function(transaction){
      db.add_transaction(transaction)
    })
  })
})
