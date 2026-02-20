const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:example@localhost:3456/test?authSource=admin'
const REDIS_URL = process.env.REDIS_URL || undefined

module.exports = {
  MONGO_URL,
  REDIS_URL
}
