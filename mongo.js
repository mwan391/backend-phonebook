const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.3fxqm.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: 'exampleName',
//   number: 999-573,
// })

// add people via terminal
if (process.argv.length > 3 ) {
  // console.log(process.argv)
  // mongoose.connection.close()
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(pers => {
    console.log(`added ${pers.name} number ${pers.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // display details of existing people
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}





