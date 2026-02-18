const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
// app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {response.json(contacts)})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phone has info for ${contacts.length} people.</p>
    <p>Request received at ${new Date()}</p>
  `)
})
app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  const contact = contacts.find(contact => contact.id)
  response.json(contact)
})

app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post(`/api/persons`, (request, response) => {
  let newContact = request.body
  newContact.id = String(Math.floor(Math.random() * 1000))
  contacts.push(newContact)

  response.status(201).json(newContact)  
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}.`)
})


