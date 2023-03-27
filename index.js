const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Phone = require("./models/phone");

const app = express();
app.use(cors());

app.use(bodyParser.json());
logger.token("body", (req, res) => {
	return JSON.stringify(req.body);
});

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(express.static("build"));
app.use(requestLogger);
let persons = []; // Inicializando a variável persons como um array vazio

app.get("/", (req, res) => {
	res.send("<h1> Hello vorld! </h1>");
});

app.get("/api/persons", (request, response) => {
	Phone.find({}).then((phones) => {
		response.json(phones);
	});
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;

	Phone.findById(id)
		.then((person) => {
			if (person) {
				response.json(person.toJSON());
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => {
			console.log(error);
			response.status(500).end();
		});
});

app.delete("/api/persons/:id", (request, response) => {
	Phone.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.get('/api/persons/query/:name', (req, res, next) => {
	const name = req.params.name
  
	Person.findOne({ "name": name })
	  .then(result => {
		res.json(result)
	  }).catch(error => next(error))
  })
  
  
  app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
  
	const person = {
	  name: body.name,
	  number: body.number
	}
  
	Phone.findByIdAndUpdate(req.params.id, person, { new: true })
	  .then(updatedPerson => {
		res.json(updatedPerson)
	  }).catch(error => next(error))
  })
  
  app.post('/api/persons', (req, res, next) => {
	const body = req.body
  
	if (body.name === undefined) {
	  return res.status(400).json({ error: 'name missing' })
	}
	if (body.number === undefined) {
	  return res.status(400).json({ error: 'number missing' })
	}
  
	const person = new Person({
	  name: body.name,
	  number: body.number
	})
  
	person.save().then(savedPerson => {
	  res.json(savedPerson.toJSON())
	}).catch(error => next(error))
  })
  

app.get("/info", (request, response) => {
	const actualDate = new Date();
	response.send(`Phonebook has info for ${persons.length} people
    <br>${actualDate}<br>`);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//não fazz sentido eu preciso fazer um post e um put? ou é um post ou é um put
