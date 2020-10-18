const Keyv = require('keyv')

class DBAdapter {
  constructor() {
    this.connection = new Keyv('redis://localhost:6379')
  }

  set = (key, value) => {
    this.connection.set(key, JSON.stringify(value))
  }

  get = (key) => {
    return JSON.parse(this.connection.get(key))
  }
}

const myDB = new DBAdapter()

module.exports = {
  myDB,
}
