const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
const logger = require("morgan");

const Phone = require("./models/phone");


app.use(bodyParser.json());
logger.token("body", (req, res) => {
	return JSON.stringify(req.body);
});


app.use(express.json());
app.use(express.static("build"));



app.get("/api/persons", (request, response) => {
	Phone.find({}).then((persons) => {
	  response.json(persons);
	});
  });
  
  app.get("/api/persons/:id", (request, response, next) => {
	Phone.findById(request.params.id)
	  .then((person) => {
		if (person) {
		  response.json(person);
		} else {
		  response.status(404).end();
		}
	  })
	  .catch((error) => next(error));
  });

  app.get("/info", (request, response, next) => {
	Phone.find({})
	  .then((people) => {
		response.send(
		  `<p>Phonebook has info for ${
			people.length
		  } people</p><p>${new Date()}</p>`
		);
	  })
	  .catch((error) => next(error));
  });


  app.delete("/api/persons/:id", (request, response, next) => {
	Phone.findByIdAndDelete(request.params.id)
	  .then(() => {
		response.status(204).end();
	  })
	  .catch((error) => next(error));
  });

  app.post("/api/persons", (request, response, next) => {
	const { name, number } = request.body;
  
	const person = new Phone({
	  name: name,
	  number: number,
	});
  
	person
	  .save()
	  .then((savedPerson) => {
		response.json(savedPerson);
	  })
	  .catch((error) => next(error));
  });

  app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;
  
	Phone.findByIdAndUpdate(
	  request.params.id,
	  { name, number },
	  { new: true }
	)
	  .then((updatedPerson) => {
		response.json(updatedPerson);
	  })
	  .catch((error) => next(error));
  });
  
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
//a vida é só isso?
//acho que loucura é eu achar que iss ovai mudar alguma coisa.