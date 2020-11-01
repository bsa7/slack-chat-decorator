const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const app = express()
app.set('trust proxy', 1)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

module.exports = {
  app,
}
