const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MessageSchema = new Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	time_stamp: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("Message", MessageSchema)
