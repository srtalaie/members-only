const bcrypt = require("bcrypt")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const User = require("../models/user")
const Message = require("../models/message")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Passport Strategy setup
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username })
			if (!user) {
				return done(null, false, {
					message: "Incorrect username and/or password",
				})
			}
			if (!bcrypt.compare(password, user.passwordHash)) {
				return done(null, false, {
					message: "Incorrect username and/or password",
				})
			}
			return done(null, user)
		} catch (error) {
			return done(error)
		}
	})
)

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		done(null, user)
	} catch (err) {
		done(err)
	}
})

// Display User sign up page GET
exports.sign_up_page_get = asyncHandler(async (req, res, next) => {
	res.render("sign_up_form", {
		title: "Sign Up",
	})
})

// Handle User sign up POST
exports.sign_up_page_post = [
	// Validate & Sanitize user input
	body("first_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Must provide a first name."),
	body("last_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Must provide a last name."),
	body("username")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Must provide a username."),
	body("email")
		.trim()
		.toLowerCase()
		.escape()
		.isEmail()
		.withMessage("Must provide an email."),
	body("password")
		.trim()
		.escape()
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			"Password must be at least 8 characters long, contain an upper and lower case character, and contain at least 1 special character and 1 number"
		),

	// Process request after sanitation and validation
	asyncHandler(async (req, res, next) => {
		// Extract errors from above validation
		const errors = validationResult(req)

		// Hash passowrd
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

		// Create user
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email: req.body.email,
			passwordHash: passwordHash,
		})

		// Check to see if email or username is already in use or if there any additional errors
		const [existingUsername, existingEmailAddress] = await Promise.all([
			User.findOne({ username: req.body.username }).exec(),
			User.findOne({ email: req.body.email }).exec(),
		])
		if (existingUsername || existingEmailAddress) {
			res.render("sign_up_form", {
				title: "Sign Up",
				user: {
					first_name: user.first_name,
					last_name: user.last_name,
					username: user.username,
					email: user.email,
				},
				errors: [
					{
						msg: "This Username or Email is already in use",
					},
				],
			})
			return
		} else if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("sign_up_form", {
				title: "Sign Up",
				user: {
					first_name: user.first_name,
					last_name: user.last_name,
					username: user.username,
					email: user.email,
				},
				errors: errors.array(),
			})
			return
		} else {
			// Data is valid, save author
			await user.save()
			// Redirect to login page
			res.redirect("/user/sign-in")
		}
	}),
]

// Display User sign in page GET
exports.sign_in_page_get = asyncHandler(async (req, res, next) => {
	res.render("sign_in_form", {
		title: "Sign In",
		messages: req.flash("error"),
	})
})

// Handle User sign in POST
exports.sign_in_page_post = [
	// Validate & Sanitize user input
	body("username")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Must provide a username."),
	body("password")
		.trim()
		.escape()
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			"Password must be at least 8 characters long, contain an upper and lower case character, and contain at least 1 special character and 1 number"
		),

	// Process request after sanitation and validation
	asyncHandler(async (req, res, next) => {
		// Extract errors from above validation
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("sign_in_form", {
				title: "Sign In",
				username: req.body.username,
				errors: errors.array(),
			})
			return
		} else {
			passport.authenticate("local", {
				successRedirect: "/",
				failureMessage: true,
				failureFlash: true,
				failureRedirect: "/user/sign-in",
			})(req, res, next)
		}
	}),
]

// User's Messages GET
exports.all_users_messages_get = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id, "messages")
		.populate("messages")
		.exec()

	if (user._id.toString() === req.user.id) {
		res.render("message_board", {
			title: "Your Messages",
			messages: user.messages,
			user_id: user._id.toString(),
			signed_in_user: req.user.id,
		})
		return
	}
})
