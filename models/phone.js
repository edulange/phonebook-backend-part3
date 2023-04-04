const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB (from backend)')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB(from backend):', error.message)
  })

  const phoneSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: {
      type: String,
      minLength: 3,
      required: [true, "User phone number required"],
    },
  });



  module.exports = mongoose.model('Phone', phoneSchema)