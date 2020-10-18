const { redisClient } = require('./redis-client')

class RedisAdapter {
  constructor() {
    this.connection = redisClient
  }

  set = async (key, value) => {
    await this.connection.set(key, JSON.stringify(value))
  }

  getSync = async (key) => {
    return JSON.parse(await this.connection.get(key))
  }
}

const myDB = new RedisAdapter()

module.exports = {
  myDB,
}
