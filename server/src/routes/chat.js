const express = require('express')
const { protect } = require('../middleware/auth')
const { getConversations, createConversation, getMessages } = require('../controllers/chatController')
const upload = require('../middleware/upload')
const router = express.Router()
router.use(protect)
router.get('/conversations', getConversations)
router.post('/conversations', createConversation)
router.get('/conversations/:conversationId/messages', getMessages)
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` })
})
module.exports = router
