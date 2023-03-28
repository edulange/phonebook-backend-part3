require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const Phone = require("./models/phone");

app.use(cors());

app.use(bodyParser.json());
logger.token("body", (req, res) => {
	return JSON.stringify(req.body);
});


app.use(express.json());
app.use(express.static("build"));



app.get('/api/persons', (request, response) => {
	Phone.find({}).then(persons => {
	  response.json(persons.map(person => person))
	})
  })

  app.get('/info', (request, response) => {
	Phone.find({})
	  .then((persons) => {
		response.send(
		  `<div>
				  <span>Phonebook has info of ${persons.length} people</span> 
			  </div>
			  <span>${new Date().toString()}</span>`
		)
	  })
	  // eslint-disable-next-line no-undef
	  .catch((error) => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {

	Phone.findById(request.params.id)
	  .then(person => {
		if (person) {
		  response.json(person)
		}else{
		  response.status(404).end()
		}
	  })
  
	  .catch((error) => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
	Phone.findByIdAndRemove(request.params.id)
	  .then(() => {
		response.status(204).end()
	  })
	  .catch(error => next(error))
  
  })

  app.post('/api/persons', (request, response, next) => {

	const body = request.body
  
	if (body.name === undefined) {
	  return response.status(400).json({ error: 'name missing' })
	}
	if (body.number === undefined) {
	  return response.status(400).json({ error: 'number missing' })
	}
	const person = new Person({
	  name: body.name,
	  number: body.number,
	})
  
	person
	  .save()
	  .then(savedPerson => {
		response.json(savedPerson.toJSON())
	  })
	  .catch((error) => next(error))
  
  })
  app.put('/api/persons/:id', (request, response, next) => {
	const { body } = request
	const { id } = request.params
  
	const person = {
	  name: body.name,
	  number: body.number,
	}
  
	Phone.findByIdAndUpdate(id, person, { new: true })
	  .then((updatedPerson) => {
		response.json(updatedPerson)
	  })
	  .catch((error) => next(error))
  })
  
  const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
	  return response.status(400).send({ error: 'malformatted id' })
	} else if(error.name === 'ValidationError'){
	  return response.status(400).json({ error: error.message })
	}
  
	next(error)
  }
  
  // handler of requests with result to errors
  app.use(errorHandler)

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//não fazz sentido eu preciso fazer um post e um put? ou é um post ou é um put
