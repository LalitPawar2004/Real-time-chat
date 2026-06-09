const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const register = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User exists' })
    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = generateToken(user._id)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    res.json({ _id: user._id, name: user.name, email: user.email, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const me = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, me }
