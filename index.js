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



app.get("/api/persons", (req, res, next) => {
	Phone.find({})
		.then((response) => {
			res.json(response);
		})
		.catch((error) => next(error));
});
  
app.get("/api/persons/:id", (req, res, next) => {
	Phone.findById(req.params.id)
		.then((response) => {
			if (response) {
				res.json(response);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	Phone.findByIdAndUpdate(req.params.id, { number: req.body.number })
		.then(() => {
			Phone.findById(req.params.id)
				.then((response) => res.json(response))
				.catch((error) => next(error));
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Phone.deleteOne({ _id: req.params.id })
		.then((response) => {
			console.log(response);
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	if (!req.body.name || !req.body.number) {
		res.status(400).json({
			error: "Name and/or Number is missing",
		});
	} else {
		const person = new Phone({
			name: req.body.name,
			number: req.body.number,
		});

		person
			.save()
			.then((savedPhone) => {
				res.json(savedPhone);
			})
			.catch((error) => next(error));
	}
});

app.get("/info", (req, res, next) => {
	Phone.find({})
		.then((response) => {
			const date = new Date(Date.now());
			res.send(
				`Phonebook has info for ${
					response.length
				} people <br/> ${date.toString()}`
			);
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