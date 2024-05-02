const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MessageSchema = new Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	time_stamp: { type: Date, default: Date.now() },
	user: { type: Schema.Types.ObjectId, ref: "User" },
})

// Virtual for messages's url
MessageSchema.virtual("url").get(function () {
	return `/message/${this._id}`
})

module.exports = mongoose.model("Message", MessageSchema)
