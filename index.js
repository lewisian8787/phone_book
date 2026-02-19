require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')
const PORT = process.env.PORT

app.use(express.json())
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

//updated to use mongodb

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post(`/api/persons`, (request, response) => {
  let newContact = request.body

  if (!newContact.name || !newContact.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: newContact.name,
    number: newContact.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get(`/api/persons/:id`, (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

//legacy routes

app.get('/info', (request, response) => {
  response.send(`
    <p>Phone has info for ${contacts.length} people.</p>
    <p>Request received at ${new Date()}</p>
  `)
})

app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}.`)
})


