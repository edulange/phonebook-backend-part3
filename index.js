const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3001
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, _request, response, next) => {
  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformed id' })
  else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })

  console.error(error.message)

  next(error)
}

morgan.token('body', (request) =>
  request.method === 'POST' ? JSON.stringify(request.body) : null
)

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
)

app.use(express.json())

app.use(express.static('public'))

app.get('/info', (_request, response, next) =>
  Person.countDocuments()
    .then((count) =>
      response.send(
        `The phonebook contains records of ${count} people.<br>${new Date()}`
      )
    )
    .catch((error) => next(error))
)

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  Person.exists({ name })
    .then((exists) => {
      if (exists) {
        response.status(400).json({ error: 'name must be unique' })
      } else {
        const person = new Person({ name, number })
        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson)
          })
          .catch((error) => next(error))
      }
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (_request, response) =>
  Person.find()
    .then((data) => {
      response.json(data)
    })
    // eslint-disable-next-line no-undef
    .catch((error) => next(error))
)

app.get('/api/persons/:id', (request, response, next) =>
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
)

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`)
})
