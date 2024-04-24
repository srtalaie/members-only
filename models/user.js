const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	username: { type: String, required: true, minLength: 3, unique: true },
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate: {
			validator(v) {
				return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
			},
			message: "Please enter a valid email address.",
		},
	},
	passwordHash: { type: String, required: true },
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
})

module.exports = mongoose.model("User", UserSchema)
