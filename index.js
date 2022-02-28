require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

morgan.token('person', function getPerson(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.static('build'))


app.get('/', (request, response) => {
    response.send('<h1>Hello !</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
app.get('/info', (request, response) => {
    response.send(`
    <p>
        Phonebook has info for ${persons.length} people
    </p>
    <p>${new Date()}</p>`
    )
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(p => p.id === id)
//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

//using Mongoose's findById to get individual person
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    
})

app.post('/api/persons', (request, response) => {

    // const generateId = () => {
    //     const maxId = persons.length > 0
    //     ? Math.max(...persons.map(p => p.id))
    //     : 0
    //     return maxId + 1
    // }
     
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } 

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    // nameExists = persons.find(pers => pers.name === body.name)
    // if (nameExists) {
    //     return response.status(400).json({
    //         error: 'name must be unique, already exists in phonebook'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(),
    })
    
    person.save().then(savedPerson => {
        response.json(person)
    })
    // persons = persons.concat(person)
    // response.json(person)
})

// let persons = [   
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})