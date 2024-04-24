var express = require("express")
var router = express.Router()
const userController = require("../controllers/userController")

// GET user sign up form
router.get("/sign-up", userController.sign_up_page_get)

// POST user sign up form
router.post("/sign-up", userController.sign_up_page_post)

module.exports = router
