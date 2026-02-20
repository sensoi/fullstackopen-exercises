const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')

let getAsync
let setAsync

if (!REDIS_URL) {
  const redisIsDisabled = async () => null
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = redis.createClient(REDIS_URL)

  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)
}

module.exports = {
  getAsync,
  setAsync
}
