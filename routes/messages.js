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

// POST message delete
router.post("/:id/delete", messageController.message_delete_post)

// GET message update
router.get("/:id/update", messageController.message_update_get)

// POST message update
router.post("/:id/update", messageController.message_update_post)

module.exports = router
