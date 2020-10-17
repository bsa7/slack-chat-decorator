const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)
