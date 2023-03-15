const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
const nameToAdd = process.argv[3];
const numberToAdd = process.argv[4];

const url = `mongodb+srv://edugod:${password}@phonebook.rhhvpeh.mongodb.net/numbers?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema(
	{
		name: String,
		number: Number,
	},
	{ versionKey: false }
);

const Phone = mongoose.model("Phone", phoneSchema);

const phone = new Phone({
	name: nameToAdd,
	number: numberToAdd,
});

if (nameToAdd === undefined || numberToAdd === undefined) {
	console.log("phonebook:");
	Phone.find({}).then((result) => {
		result.forEach((phone) => {
			console.log(phone.name, phone.number);
		});
		mongoose.connection.close();
	});
} else {
	phoneSchema.save().then((result) => {
		console.log(
			`Contact saved! with name: ${nameToAdd}, number: ${numberToAdd}`
		);
		mongoose.connection.close();
	});
}
