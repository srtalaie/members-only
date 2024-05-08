var express = require("express")
var router = express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Message Bored", user: req.user })
})

// GET Logout
router.get("/logout", function (req, res, next) {
	req.logout((err) => {
		if (err) {
			return next(err)
		}
		res.redirect("/")
	})
})

module.exports = router
