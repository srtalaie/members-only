var express = require("express")
var router = express.Router()
const messageController = require("../controllers/messageController")

// GET latest messages
router.get("/message-board", messageController.latest_messages_get)

// GET message form
router.get("/create", messageController.message_create_get)

// POST message form
router.post("/create", messageController.message_create_post)

// GET message detail
router.get("/:id", messageController.message_detail_get)

// GET message delete
router.get("/:id/delete", messageController.message_delete_get)

module.exports = router
