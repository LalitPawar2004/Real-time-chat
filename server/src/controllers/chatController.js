const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email avatarUrl')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
    res.json(conversations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createConversation = async (req, res) => {
  const { userId, isGroup, name, participants } = req.body
  try {
    let convo
    if (!isGroup) {
      convo = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [req.user._id, userId], $size: 2 }
      }).populate('participants', 'name email')
      if (convo) return res.json(convo)
    }
    const members = isGroup ? [...participants, req.user._id] : [req.user._id, userId]
    convo = await Conversation.create({
      isGroup: !!isGroup,
      name,
      participants: members,
      admins: [req.user._id]
    })
    const populated = await Conversation.findById(convo._id).populate('participants', 'name email')
    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMessages = async (req, res) => {
  const { conversationId } = req.params
  const { before, limit = 30 } = req.query
  try {
    const query = { conversationId }
    if (before) query.createdAt = { $lt: new Date(before) }
    const messages = await Message.find(query)
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
    res.json(messages.reverse())
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getConversations, createConversation, getMessages }
