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

app.use(express.json());
app.use(express.static("build"));
app.use(requestLogger);

app.get("/api/persons", (req, res) => {
	Phone.find({}).then((persons) => {
		res.json(persons);
	});
});

app.get("/info", (req, res, next) => {
	const requestTime = new Date(Date.now());

	Phone.find({})
		.then((persons) => {
			res.send(
				`<p>Phonebook has info for ${persons.length} people</p> <p>${requestTime}</p>`
			);
		})
		.catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
	Phone.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Phone.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	const person = new Phone({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => savedPerson.toJSON())
		.then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Phone.findByIdAndUpdate(req.params.id, person, {
		runValidators: true,
		context: "query",
		new: true,
	})
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

//não fazz sentido eu preciso fazer um post e um put? ou é um post ou é um put
