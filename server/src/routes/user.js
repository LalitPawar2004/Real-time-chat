const express = require('express')
const { protect } = require('../middleware/auth')
const { searchUsers } = require('../controllers/userController')
const router = express.Router()
router.use(protect)
router.get('/', searchUsers)
module.exports = router
