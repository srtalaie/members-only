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

// GET Message detail page
exports.message_detail_get = asyncHandler(async (req, res, next) => {
	const message = await Message.findById(req.params.id).populate("user").exec()

	const authorId = message.user._id.toString()
	const signedInUserId = req.user.id

	res.render("message_detail", {
		title: "Message Detail",
		message: message,
		author_id: authorId,
		signed_in_user: signedInUserId,
	})
})

// GET Message Delete
exports.message_delete_get = asyncHandler(async (req, res, next) => {
	const message = await Message.findById(req.params.id).populate("user").exec()

	if (message === null) {
		// No results, redirect to home
		res.redirect("/")
	}

	res.render("message_delete", {
		title: "Delete Message",
		message: message,
	})
})

// POST Message delete
exports.message_delete_post = asyncHandler(async (req, res, next) => {
	const message = await Message.findById(req.params.id).populate("user").exec()

	if (message === null) {
		// No results, redirect to home
		res.redirect("/")
	}

	const authorId = message.user._id.toString()
	const signedInUserId = req.user.id

	if (authorId !== signedInUserId) {
		res.render("message_detail", {
			title: "Message Detail",
			message: message,
			error_message: "You are not authorized to delete this message.",
		})
		return
	} else {
		await Message.findByIdAndDelete(req.params.id).exec()
		res.redirect("/")
	}
})
