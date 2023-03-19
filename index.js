const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config();

const Phone = require("./models/phone")

const app = express()
app.use(cors())

app.use(bodyParser.json())
logger.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method);
	console.log("Path:  ", request.path);
	console.log("Body:  ", request.body);
	console.log("---");
	next();
};

app.use(express.json())
app.use(express.static('build'))
app.use(requestLogger);
let persons = []; // Inicializando a variável persons como um array vazio


app.get('/', (req, res) => {
    res.send('<h1> Hello vorld! </h1>')
})

app.get("/api/persons", (request, response) => {
    Phone.find({}).then((phones) => {
        response.json(phones);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    
    Phone.findById(id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Phone.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    return Math.floor((Math.random() * 100000) + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({
            error: 'name content missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number content missing'
        })
    }
    
    Phone.findOne({ name: body.name })
    .then((result) => {
        if (result) {
            return response.status(409).json({
                error: 'name should be unique'
            })
        }
        
        const phone = new Phone({
            name: body.name,
            number: body.number
        })
        
        phone.save().then((savedPhone) => {
            response.json(savedPhone.toJSON())
        })
    })
})

app.get('/info', (request, response) => {
    const actualDate = new Date()
    response.send(`Phonebook has info for ${persons.length} people
    <br>${actualDate}<br>`)
    
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})