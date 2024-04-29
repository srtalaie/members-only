var express = require("express")
var router = express.Router()
const userController = require("../controllers/userController")

// GET user sign up form
router.get("/sign-up", userController.sign_up_page_get)

// POST user sign up form
router.post("/sign-up", userController.sign_up_page_post)

// GET user sign in form
router.get("/sign-in", userController.sign_in_page_get)

// POST user sign in form
router.post("/sign-in", userController.sign_in_page_post)

module.exports = router
