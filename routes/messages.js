var express = require("express")
var router = express.Router()
const messageController = require("../controllers/messageController")

// GET latest messages
router.get("/message-board", messageController.latest_messages_get)

// GET message form
router.get("/create", messageController.message_create_get)

// POST message form
router.post("/create", messageController.message_create_post)

module.exports = router
