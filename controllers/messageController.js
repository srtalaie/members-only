const User = require("../models/user")
const Message = require("../models/message")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Latest 10 messages GET
exports.latest_messages_get = asyncHandler(async (req, res, next) => {
	const messages = await Message.find({}, "title text time_stamp user")
		.sort({ _id: -1 })
		.limit(10)
		.populate("user")
		.exec()
	console.log("=========", messages)
	res.render("message_board", {
		title: "Message Board",
		messages: messages,
	})
})

// Message create form GET
exports.message_create_get = asyncHandler(async (req, res, next) => {
	res.render("message_form", { title: "Create a Message" })
})

// Message create form POST
exports.message_create_post = [
	// Validate and Sanitize user input
	body("title")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Must provide a title for you message."),
	body("text")
		.trim()
		.escape()
		.isLength({ min: 1 })
		.withMessage("You message must contain text."),

	// Process request after sanitation and validation
	asyncHandler(async (req, res, next) => {
		// Extract validation errors.
		const errors = validationResult(req)

		const currentUser = await User.findById(req.user._id).exec()

		// Create message object with sanitized data.
		const message = new Message({
			title: req.body.title,
			text: req.body.text,
			user: req.user._id,
		})

		if (!errors.isEmpty()) {
			res.render("message_form", {
				title: "Create a Message",
				errors: errors.array(),
			})
		} else {
			// Data from form is saved.
			await message.save()
			currentUser.messages.push(message)
			await currentUser.save()
			res.redirect(message.url)
		}
	}),
]
