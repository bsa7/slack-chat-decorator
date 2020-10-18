const Keyv = require('keyv')

class DBAdapter {
  constructor() {
    this.connection = new Keyv('redis://localhost:6379')
  }

  set = (key, value) => {
    this.connection.set(key, JSON.stringify(value))
  }

  get = (key) => {
    const value = this.connection.get(key)
    if (/^[\{\]]/.test(value)) return JSON.parse(value)
    return value
  }
}

const myDB = new DBAdapter()

module.exports = {
  myDB,
}
