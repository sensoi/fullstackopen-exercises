const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('  node mongo.js <password>')
  console.log('  node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const username = 'sensoi'
const clusterHost = 'clusterfso.j3apkfo.mongodb.net'


const url = `mongodb+srv://${username}:${password}@${clusterHost}/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  Person.find({})
    .then(result => {
      result.forEach(p => console.log(p))
    })
    .catch(err => console.error(err))
    .finally(() => mongoose.connection.close())
} else {

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
    })
    .catch(err => console.error('save error:', err))
    .finally(() => mongoose.connection.close())
}
