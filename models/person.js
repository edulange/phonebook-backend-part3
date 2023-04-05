const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message));

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: String,
      validate: {
        validator: (v) => /^\d{2}-\d{6,}|\d{3}-\d{5,}|(?<!-)\d{8,}$/.test(v),
        message: (props) => `\`${props.value}\` is not a valid phone number.`,
      },
      minlength: 8,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
      },
    },
  }
);

module.exports = mongoose.model('Person', schema);