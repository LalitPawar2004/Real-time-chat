const User = require('../models/User')
exports.searchUsers = async (req, res) => {
  const search = req.query.search || ''
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }).select('name email').limit(10)
  res.json(users)
}
