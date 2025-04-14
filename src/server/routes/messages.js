import express from 'express';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          'user.name': 1,
          'user.avatar': 1,
          'lastMessage.content': 1,
          'lastMessage.createdAt': 1,
          'lastMessage.read': 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar');

    // Mark messages as read
    await Message.updateMany(
      {
        recipient: req.user._id,
        sender: req.params.userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Send a message
router.post('/:userId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const message = new Message({
      sender: req.user._id,
      recipient: req.params.userId,
      content
    });

    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('recipient', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error.message });
  }
});

export default router; 