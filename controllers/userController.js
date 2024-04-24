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
				return done(null, false, { message: "Incorrect username" })
			}
			if (!bcrypt.compare(password, user.passwordHash)) {
				return done(null, false, { message: "Incorrect password" })
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
