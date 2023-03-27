const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB (from backend)");
	})
	.catch((error) => {
		console.log(
			"error connecting to MongoDB(from backend):",
			error.message
		);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		unique: true,
	},
	number: {
		type: String,
		match: /^\d{8}$/g,
	},
});



personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);